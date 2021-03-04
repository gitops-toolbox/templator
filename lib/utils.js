const fs = require('fs');
const logger = require('debug');
const path = require('path');

function isDirectory(path) {
  return fs.statSync(path).isDirectory();
}

function pushToIf(element, list, filter) {
  if (filter(element)) {
    list.push(element);
  }
}

function contextSliceParser(slice) {
  try {
    return JSON.parse(slice);
  } catch (e) {
    return slice;
  }
};

function getLogger(filename) {
  return logger(`tp:${path.relative(__dirname, filename)}`);
}

module.exports = {
  isDirectory,
  pushToIf,
  contextSliceParser,
  getLogger,
};
