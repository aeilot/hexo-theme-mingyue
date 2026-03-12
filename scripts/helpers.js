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

function toChineseYear(year) {
  var digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return String(year)
    .split('')
    .map(function (d) {
      return digits[Number(d)] || d;
    })
    .join('');
}

function toChineseMonth(month) {
  var months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  return months[month - 1] || String(month);
}

function toChineseDay(day) {
  var nums = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (day <= 10) return day === 10 ? '初十' : '初' + nums[day - 1];
  if (day < 20) return '十' + nums[day - 11];
  if (day === 20) return '二十';
  if (day < 30) return '廿' + nums[day - 21];
  if (day === 30) return '三十';
  return '三十' + nums[day - 31];
}

function ganzhiYear(year) {
  var stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var offset = year - 1984;
  var stem = stems[((offset % 10) + 10) % 10];
  var branch = branches[((offset % 12) + 12) % 12];
  return stem + branch;
}

hexo.extend.helper.register('format_cn_ganzhi_date', function (input) {
  var d = input ? new Date(input) : new Date();
  if (Number.isNaN(d.getTime())) return '';

  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var day = d.getDate();
  var gzy = ganzhiYear(y);

  return gzy + '年 ' + toChineseYear(y) + '年' + toChineseMonth(m) + '月' + toChineseDay(day) + '日';
});
