const fs = require('fs');
const logger = require('debug');
const path = require('path');
const [log, error] = getLogger(__filename);

function getLogger(filename) {
  const info = logger(`templator:${path.relative(__dirname, filename)}`);
  const error = info.extend('error');
  return [info, error];
}

function tryJSONParse(slice) {
  try {
    return JSON.parse(slice);
  } catch (e) {
    return slice;
  }
}

const supportedLodashMethods = ['assign', 'defaults', 'defaultsDeep', 'merge'];

module.exports = {
  getLogger,
  supportedLodashMethods,
  tryJSONParse,
};
