'use strict';

const utils = require('../lib/utils');
const _ = require('lodash');

exports.command = 'context [context-selector]';

exports.desc = `Output the full context`;

exports.builder = (yargs) => {
  utils
    .commonYargsOptions(yargs)
    .option('context-selector', {
      describe: "context slice, path can be passed as x.y.z or ['x', 'y', 'z']",
      coerce: (param) => {
        return utils.tryJSONParse(param);
      },
    })
    .option('output', {
      describe: 'output the templates in json format',
      alias: 'o',
      choices: ['yaml', 'json'],
    });
};

exports.handler = async function (args) {
  const context = await utils
    .getContextParser(args.baseDir, {
      configDir: args.contextDir,
      ...args,
    })
    .fromSelector(args.contextSelector);

  utils.output(context, args.output || 'json');
};
