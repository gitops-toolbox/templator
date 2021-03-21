const fs = require('fs');
const logger = require('debug');
const path = require('path');
const [log, error] = getLogger(__filename);

function isDirectory(path) {
  return fs.statSync(path).isDirectory();
}

function pushToIf(element, list, filter) {
  if (filter(element)) {
    list.push(element);
  }
}

function contextSliceParser(slice) {
  log('Try parsing context slice %');
  try {
    return JSON.parse(slice);
  } catch (e) {
    return slice;
  }
}

function getLogger(filename) {
  const info = logger(`tp:${path.relative(__dirname, filename)}`);
  const error = info.extend('error');
  return [info, error];
}

module.exports = {
  isDirectory,
  pushToIf,
  contextSliceParser,
  getLogger,
};
