'use strict';

var fs = require('node:fs');
var path = require('node:path');
var yaml = require('js-yaml');

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeObjects(base, override) {
  var result = Object.assign({}, base || {});
  Object.keys(override || {}).forEach(function (key) {
    var baseValue = result[key];
    var overrideValue = override[key];

    if (isObject(baseValue) && isObject(overrideValue)) {
      result[key] = mergeObjects(baseValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  });
  return result;
}

hexo.extend.filter.register('before_generate', function () {
  var configPath = path.join(hexo.theme_dir, '_config.mingyue.yml');

  if (!fs.existsSync(configPath)) return;

  var raw = fs.readFileSync(configPath, 'utf8');
  var parsed = yaml.load(raw) || {};

  hexo.theme.config = mergeObjects(hexo.theme.config || {}, parsed);
});
