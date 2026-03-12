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

function toFormalChineseNumber(input) {
  var digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
  var units = ['', '拾', '佰', '仟'];
  var value = Number(input);

  if (!Number.isFinite(value) || value <= 0) return '';
  if (value === 0) return digits[0];

  var raw = String(Math.floor(value));
  var result = '';
  var zeroPending = false;

  for (var i = 0; i < raw.length; i += 1) {
    var digit = Number(raw[i]);
    var unitIndex = raw.length - i - 1;

    if (digit === 0) {
      zeroPending = result.length > 0;
      continue;
    }

    if (zeroPending) {
      result += digits[0];
      zeroPending = false;
    }

    result += digits[digit] + (units[unitIndex] || '');
  }

  return result;
}

function buildPagerState(data) {
  var source = data || {};
  var total = Number(source.total || 0);
  var current = Number(source.current || 0);

  if (!Number.isFinite(total) || total <= 1 || !Number.isFinite(current) || current <= 0) {
    return null;
  }

  return {
    total: total,
    current: current,
    current_label: toFormalChineseNumber(current),
    prev_link: source.prev_link || '',
    next_link: source.next_link || ''
  };
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

hexo.extend.helper.register('format_pager_number', function (input) {
  return toFormalChineseNumber(input);
});

hexo.extend.helper.register('build_pager_state', function (input) {
  return buildPagerState(input);
});
