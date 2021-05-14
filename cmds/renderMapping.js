'use strict';

const Utils = require('../lib/utils');
const ContextParser = require('@gitops-toolbox/config-loader');
const Mappings = require('../lib/mappings');
const log = require('debug')('t:renderMapping');

exports.command = 'renderMapping <mapping> [context-selector]';

exports.desc = `Output the rendered mapping`;

exports.builder = (yargs) => {
  yargs
    .positional('mapping', {
      describe: 'name of the mapping to render',
      type: 'string',
    })
    .option('context-selector', {
      describe: 'context slice, path can be passed as x.y.z or ["x","y","z"]',
      coerce: (param) => {
        return Utils.tryJSONParse(param);
      },
    });
};

exports.handler = async function (args) {
  const contextParser = new ContextParser(args.baseDir, args);
  const context = await contextParser.fromSelector(args.contextSelector);
  log('Selected context %o from %o', context, args.contextSelector);
  const mappings = new Mappings(args.baseDir, args);
  const result = await mappings.render(args.mapping, context);
  console.log(JSON.stringify(result, null, 2));
};
