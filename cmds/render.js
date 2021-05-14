const lodash = require('lodash');
const Templator = require('../lib/templator');
const { tryJSONParse } = require('../lib/utils');

exports.command = 'render <mapping> [context-selector]';

exports.desc = 'Output the rendered template';

exports.builder = (yargs) => {
  yargs
    .positional('mapping', {
      describe: 'name of the template to render',
      type: 'string',
    })
    .option('context-selector', {
      describe: 'context slice, path can be passed as x.y.z or ["x", "y", "z"]',
      coerce: (param) => tryJSONParse(param),
    })
    .option('human-readable', {
      describe: 'output the templates in human readable format',
      alias: 'h',
      type: 'boolean',
      default: false,
    })
    .option('hide-headers', {
      describe: 'Hide the header from the human readable output',
      type: 'boolean',
      default: false,
      implies: 'human-readable',
    })
    .options('limit-to', {
      describe: 'Only show file with a given header',
      type: 'string',
      implies: 'human-readable',
    });
};

exports.handler = async (args) => {
  const templator = new Templator(args.baseDir, args);
  console.log(args.h);
  if (args.h) {
    const hm = await templator.humanReadable(
      args.mapping,
      args.contextSelector
    );
    console.log(hm);
    for (const location of hm) {
      if (
        !lodash.isUndefined(args.limitTo) &&
        !lodash.isEqual(JSON.parse(args.limitTo), location.destination)
      ) {
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
    const render = await templator.render(args.mapping, args.contextSelector);
    console.log(JSON.stringify(render, null, 2));
  }
};
