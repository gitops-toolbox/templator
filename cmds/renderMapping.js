'use strict';

const Utils = require('../lib/utils');
const ContextParser = require('../lib/contextParser');
const MappingRenderer = require('../lib/mappingRenderer');
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
        return Utils.contextSliceParser(param);
      },
    });
};

exports.handler = async function (args) {
  const contextParser = new ContextParser(args.configDir, args);
  const context = contextParser.fromSelector(args.contextSelector);
  log('Selected context %o from %o', context, args.contextSelector);
  const mappingRenderer = new MappingRenderer(args.configDir, args);
  const mapping = mappingRenderer.render(args.mapping, context);
  console.log(JSON.stringify(mapping, null, 2));
};
