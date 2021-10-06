const logger = require('debug');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const ContextParser = require('@gitops-toolbox/config-loader');
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

function isJsonOrYaml(filepath) {
  return (
    filepath.endsWith('.json') ||
    filepath.endsWith('.yaml') ||
    filepath.endsWith('.yml')
  );
}

function loadJsonOrYaml(filepath) {
  if (filepath.endsWith('.json')) {
    return require(filepath);
  } else if (filepath.endsWith('.yaml') || filepath.endsWith('.yml')) {
    return yaml.load(fs.readFileSync(filepath, 'utf8'));
  } else {
    return {};
  }
}

function getContextParser(base, args) {
  return new ContextParser(base, {
    parseFunction: loadJsonOrYaml,
    fileFilter: isJsonOrYaml,
    ...args,
  });
}

function output(obj, type) {
  if (type === 'json') {
    console.log(JSON.stringify(obj, null, 2));
  }

  if (type === 'yaml' || type === 'yml') {
    console.log(yaml.dump(obj));
  }
}

function commonYargsOptions(yargs) {
  yargs.option('output', {
    describe: 'output the templates in selected format',
    alias: 'o',
    choices: ['yaml', 'json'],
  });

  return yargs;
}

const supportedLodashMethods = ['assign', 'defaults', 'defaultsDeep', 'merge'];

module.exports = {
  listFiles,
  getLogger,
  supportedLodashMethods,
  tryJSONParse,
  getContextParser,
  output,
  commonYargsOptions,
  loadJsonOrYaml,
};
