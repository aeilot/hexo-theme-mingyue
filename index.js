'use strict';

function stripHtml(input) {
  return String(input || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateText(input, limit) {
  var text = stripHtml(input);
  if (!limit || text.length <= limit) return text;
  return text.slice(0, limit) + '...';
}

hexo.extend.helper.register('format_bracket_title', function (input) {
  var raw = String(input || '').trim();
  if (!raw) return '「无题」';
  if (raw.startsWith('「') && raw.endsWith('」')) return raw;
  return '「' + raw + '」';
});

hexo.extend.helper.register('build_excerpt', function (post, limit) {
  if (!post) return '';
  if (post.excerpt && post.excerpt.length) {
    return stripHtml(post.excerpt);
  }
  if (post.description && post.description.length) {
    return stripHtml(post.description);
  }
  return truncateText(post.content || '', limit || 120);
});
