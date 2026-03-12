(function () {
  var config = window.__MINGYUE_CONTENT_CONFIG || {};
  var sidewaysConfig = config.sideways || {};
  var westernEnabled = sidewaysConfig.western_enabled !== false;

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
        tag === 'SAMP' ||
        tag === 'TEXTAREA'
      ) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  function decorateWesternText(container) {
    if (!westernEnabled) return;

    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (!shouldSkipTextNode(node) && node.nodeValue) {
        nodes.push(node);
      }
    }

    nodes.forEach(function (textNode) {
      var text = textNode.nodeValue;
      var re = /[A-Za-z0-9]+(?:[._:+\/-][A-Za-z0-9]+)*/g;
      var match;
      var last = 0;
      var hasMatch = false;
      var fragment = document.createDocumentFragment();

      while ((match = re.exec(text)) !== null) {
        hasMatch = true;
        if (match.index > last) {
          fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
        }

        var span = document.createElement('span');
        span.className = 'content-sideways-inline content-sideways-inline--western';
        span.textContent = match[0];
        fragment.appendChild(span);

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

  document.addEventListener('DOMContentLoaded', function () {
    var containers = document.querySelectorAll('.post-content');
    if (!containers.length) return;
    toArray(containers).forEach(function (container) {
      decorateWesternText(container);
    });
  });
})();
