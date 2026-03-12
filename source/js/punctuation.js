(function () {
  var PUNC_RE = /[，。！？；：、】【（）《》「」『』、]/g;
  var SKIP_TAGS = {
    CODE: true,
    PRE: true,
    KBD: true,
    SAMP: true,
    SCRIPT: true,
    STYLE: true,
    TEXTAREA: true
  };

  function shouldSkip(node) {
    var current = node.parentNode;
    while (current) {
      if (current.nodeType === 1 && SKIP_TAGS[current.tagName]) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  function replacePunctuationInTextNode(node) {
    var text = node.nodeValue;
    if (!text || !PUNC_RE.test(text)) {
      PUNC_RE.lastIndex = 0;
      return;
    }
    PUNC_RE.lastIndex = 0;

    var fragment = document.createDocumentFragment();
    var last = 0;
    var match;

    while ((match = PUNC_RE.exec(text)) !== null) {
      if (match.index > last) {
        fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      var span = document.createElement('span');
      span.className = 'cj-punc';
      span.textContent = match[0];
      fragment.appendChild(span);
      last = match.index + match[0].length;
    }

    if (last < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(last)));
    }

    node.parentNode.replaceChild(fragment, node);
  }

  function processPostContent(container) {
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var node;

    while ((node = walker.nextNode())) {
      if (!shouldSkip(node)) {
        nodes.push(node);
      }
    }

    nodes.forEach(replacePunctuationInTextNode);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var containers = document.querySelectorAll('.post-content');
    for (var i = 0; i < containers.length; i++) {
      processPostContent(containers[i]);
    }
  });
})();
