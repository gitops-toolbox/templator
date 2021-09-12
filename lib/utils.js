const logger = require('debug');
const path = require('path');
const fs = require('fs');
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

function listFiles(rootDir) {
  const list = [];
  const queue = [];
  queue.push(rootDir);

  while (queue.length > 0) {
    const directory = queue.shift();
    if (path.basename(directory).startsWith('_')) {
      continue;
    }

    for (const file of fs.readdirSync(directory)) {
      const next = path.join(directory, file);

      if (fs.statSync(next).isDirectory()) {
        queue.push(next);
        continue;
      }

      if (
        next.endsWith('njk') ||
        next.endsWith('js') ||
        next.endsWith('json')
      ) {
        list.push(path.relative(rootDir, next));
      }
    }
  }

  return list;
}

const supportedLodashMethods = ['assign', 'defaults', 'defaultsDeep', 'merge'];

module.exports = {
  listFiles,
  getLogger,
  supportedLodashMethods,
  tryJSONParse,
};
