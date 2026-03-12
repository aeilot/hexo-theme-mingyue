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
