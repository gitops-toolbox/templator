'use strict';

const Utils = require('../lib/utils');
const Templator = require('../lib/templator');
const _ = require('lodash');

exports.command = 'render <mapping> [context-selector]';

exports.desc = `Output the rendered template`;

exports.builder = (yargs) => {
  yargs.positional('mapping', {
    describe: 'name of the template to render',
    type: 'string',
  }).option('context-selector', {
    describe: 'context slice, path can be passed as x.y.z or ["x", "y", "z"]',
    coerce: (param) => {
      return Utils.contextSliceParser(param);
    },
  }).option('human-readable', {
    describe: 'output the templates in human readable format',
    alias: 'h',
    type: 'boolean',
    default: false,
  }).options('hide-headers', {
    describe: 'Hide the header from the human readable output',
    type: 'boolean',
    default: false,
    implies: 'human-readable',
  }).options('limit-to', {
    describe: 'Only show file with a given header',
    type: 'string',
    implies: 'human-readable',
  });
};

exports.handler = async function(args) {
  const templator = new Templator(args.configDir, args);
  console.log(args.h);
  if (args.h) {
    const hm = templator.humanReadable(args.mapping, args.contextSelector);
    for (const location of hm) {
      if (! _.isUndefined(limitTo) &&
          !_.isEqual(JSON.parse(args.limitTo), location.destination)) {
        continue;
      }
      if (!args.hideHeaders) {
        console.log('===============================================');
        console.log(JSON.stringify(location.destination));
        console.log('===============================================');
      }
      console.log(location.content);
    }
  } else {
    const render = templator.render(args.mapping, args.contextSelector);
    console.log(JSON.stringify(render, null, 2));
  }
};
