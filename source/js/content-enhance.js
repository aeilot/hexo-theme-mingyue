(function () {
  var config = window.__MINGYUE_CONTENT_CONFIG || {};
  var codeEnabled = !config.code || config.code.enabled !== false;
  var mathConfig = config.math || {};
  var mathEnabled = mathConfig.enabled !== false;
  var mathEngine = mathConfig.engine || 'katex';
  var previewConfig = config.preview_dialog || {};
  var previewEnabled = previewConfig.enabled !== false;

  var ENGINE_ADAPTERS = {
    katex: {
      inlineSelector: '.katex',
      blockSelector: '.katex-display'
    },
    mathjax: {
      inlineSelector: '',
      blockSelector: ''
    }
  };

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList || []);
  }

  function shouldSkipTextNode(node) {
    var current = node.parentNode;
    while (current && current.nodeType === 1) {
      var tag = current.tagName;
      if (
        tag === 'CODE' ||
        tag === 'PRE' ||
        tag === 'SCRIPT' ||
        tag === 'STYLE' ||
        tag === 'KBD' ||
        tag === 'SAMP'
      ) {
        return true;
      }
      if (current.classList && (current.classList.contains('katex') || current.classList.contains('katex-display'))) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  function renderKatexExpression(expr, displayMode) {
    if (!window.katex || typeof window.katex.render !== 'function') return null;
    var node = document.createElement(displayMode ? 'div' : 'span');
    try {
      window.katex.render(expr, node, {
        displayMode: displayMode,
        throwOnError: false
      });
      return node;
    } catch (e) {
      return null;
    }
  }

  function renderKatexDisplayParagraphs(container) {
    var blocks = container.querySelectorAll('p, li, blockquote');
    toArray(blocks).forEach(function (block) {
      if (block.querySelector('pre, code, figure')) return;
      var raw = (block.textContent || '').trim();
      if (!raw.startsWith('$$') || !raw.endsWith('$$') || raw.length <= 4) return;
      var expr = raw.slice(2, -2).trim();
      if (!expr) return;
      var rendered = renderKatexExpression(expr, true);
      if (!rendered) return;
      block.innerHTML = '';
      block.appendChild(rendered);
      block.classList.add('content-katex-rendered-block');
    });
  }

  function renderKatexInlineNodes(container) {
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (!shouldSkipTextNode(node) && node.nodeValue && node.nodeValue.indexOf('$') !== -1) {
        nodes.push(node);
      }
    }

    nodes.forEach(function (textNode) {
      var text = textNode.nodeValue;
      var re = /\$([^$\n]+?)\$/g;
      var match;
      var last = 0;
      var hasMatch = false;
      var fragment = document.createDocumentFragment();
      while ((match = re.exec(text)) !== null) {
        hasMatch = true;
        if (match.index > last) {
          fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
        }
        var expr = match[1].trim();
        var rendered = renderKatexExpression(expr, false);
        if (rendered) {
          fragment.appendChild(rendered);
        } else {
          fragment.appendChild(document.createTextNode(match[0]));
        }
        last = match.index + match[0].length;
      }
      if (!hasMatch) return;
      if (last < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(last)));
      }
      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });
  }

  function renderKatexIfNeeded(container) {
    if (!mathEnabled || mathEngine !== 'katex') return;
    if (!window.katex || typeof window.katex.render !== 'function') return;
    renderKatexDisplayParagraphs(container);
    renderKatexInlineNodes(container);
  }

  function measureAndSetBlockSize(wrapper, target) {
    var sourceWidth = target.scrollWidth || target.offsetWidth || 0;
    var sourceHeight = target.scrollHeight || target.offsetHeight || 0;
    if (!sourceWidth || !sourceHeight) return;
    var maxSourceWidth = Math.max(300, Math.floor(window.innerWidth * 0.44));
    var maxSourceHeight = Math.max(120, Math.floor(window.innerHeight * 0.22));
    var finalWidth = Math.min(sourceWidth, maxSourceWidth);
    var finalHeight = Math.min(sourceHeight, maxSourceHeight);
    var reserveInline = finalHeight + 28;
    var reserveBlock = finalWidth + 8;

    wrapper.style.setProperty('--sideways-source-width', finalWidth + 'px');
    wrapper.style.setProperty('--sideways-source-height', finalHeight + 'px');
    wrapper.style.setProperty('--sideways-reserve-inline', reserveInline + 'px');
    wrapper.style.setProperty('--sideways-reserve-block', reserveBlock + 'px');
  }

  function createDialog() {
    var dialog = document.createElement('dialog');
    dialog.className = 'content-preview-dialog';
    dialog.innerHTML =
      '<div class="content-preview-dialog__header">' +
      '<button type="button" class="content-preview-dialog__close" aria-label="关闭预览">关闭</button>' +
      '</div>' +
      '<div class="content-preview-dialog__content"></div>';
    document.body.appendChild(dialog);

    var closeBtn = dialog.querySelector('.content-preview-dialog__close');
    closeBtn.addEventListener('click', function () {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    });

    dialog.addEventListener('click', function (event) {
      var rect = dialog.getBoundingClientRect();
      var inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) {
        if (typeof dialog.close === 'function') {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
      }
    });

    return dialog;
  }

  function openDialogPreview(dialog, sourceNode) {
    var container = dialog.querySelector('.content-preview-dialog__content');
    container.innerHTML = '';
    var clone = sourceNode.cloneNode(true);
    clone.classList.remove('content-sideways-block__target');
    clone.classList.add('content-preview-dialog__node');
    container.appendChild(clone);
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', 'open');
    }
  }

  function addBlockPreview(container, target, type, dialog) {
    if (target.closest('.content-sideways-block')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'content-sideways-block content-sideways-block--' + type;

    var targetHolder = document.createElement('div');
    targetHolder.className = 'content-sideways-block__target-wrap';

    target.classList.add('content-sideways-block__target');
    target.parentNode.insertBefore(wrapper, target);
    targetHolder.appendChild(target);
    wrapper.appendChild(targetHolder);
    measureAndSetBlockSize(wrapper, target);

    if (previewEnabled && dialog) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'content-sideways-block__preview-btn';
      button.setAttribute('aria-label', '横向查看');
      button.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center" aria-hidden="true"></i>';
      button.addEventListener('click', function () {
        openDialogPreview(dialog, target);
      });
      wrapper.appendChild(button);
    }
  }

  function decorateContainer(container, dialog) {
    renderKatexIfNeeded(container);

    if (codeEnabled) {
      var inlineCodes = container.querySelectorAll('code:not(pre code)');
      toArray(inlineCodes).forEach(function (node) {
        node.classList.add('content-sideways-inline', 'content-sideways-inline--code');
      });

      var codeBlocks = container.querySelectorAll('figure.highlight, pre:not(figure.highlight pre)');
      toArray(codeBlocks).forEach(function (node) {
        addBlockPreview(container, node, 'code', dialog);
      });
    }

    if (mathEnabled) {
      var adapter = ENGINE_ADAPTERS[mathEngine] || ENGINE_ADAPTERS.katex;
      if (adapter.inlineSelector) {
        var inlineMath = container.querySelectorAll(adapter.inlineSelector);
        toArray(inlineMath).forEach(function (node) {
          if (node.closest('.katex-display')) return;
          node.classList.add('content-sideways-inline', 'content-sideways-inline--math');
        });
      }
      if (adapter.blockSelector) {
        var mathBlocks = container.querySelectorAll(adapter.blockSelector);
        toArray(mathBlocks).forEach(function (node) {
          addBlockPreview(container, node, 'math', dialog);
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var containers = document.querySelectorAll('.post-content');
    if (!containers.length) return;
    var dialog = previewEnabled ? createDialog() : null;
    toArray(containers).forEach(function (container) {
      decorateContainer(container, dialog);
    });

    window.addEventListener('resize', function () {
      var blocks = document.querySelectorAll('.content-sideways-block');
      toArray(blocks).forEach(function (block) {
        var target = block.querySelector('.content-sideways-block__target');
        if (target) {
          measureAndSetBlockSize(block, target);
        }
      });
    });
  });
})();
