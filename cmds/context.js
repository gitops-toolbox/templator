'use strict';

const Utils = require('../lib/utils');
const _ = require('lodash');
const ConfigParser = require('@gitops-toolbox/config-loader');

exports.command = 'context [context-selector]';

exports.desc = `Output the full context`;

exports.builder = (yargs) => {
  yargs
    .positional('template', {
      describe: 'name of the template to render',
      type: 'string',
    })
    .option('context-selector', {
      describe: "context slice, path can be passed as x.y.z or ['x', 'y', 'z']",
      coerce: (param) => {
        return Utils.tryJSONParse(param);
      },
    });
};

exports.handler = async function (args) {
  const context = await new ConfigParser(args.baseDir, {
    configDir: args.contextDir,
    ...args,
  }).fromSelector(args.contextSelector);
  console.log(JSON.stringify(context, null, 2));
};
