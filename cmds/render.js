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
    .positional('context-selector', {
      describe: 'context slice, path can be passed as x.y.z or ["x", "y", "z"]',
      default: '.',
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
      implies: 'limit-to',
    })
    .options('limit-to', {
      describe: 'Only show file with a give set of tags',
      type: 'string',
      implies: 'human-readable',
      coerce: (param) => JSON.parse(param),
    })
    .options('mapping-only', {
      describe: 'Only render mapping, not templates, useful to debug issues',
      type: 'boolean',
      default: false,
    });
};

exports.handler = async (args) => {
  const templator = new Templator(args.baseDir, args);

  if (args.h) {
    const hm = await templator.render(args.mapping, args.contextSelector);

    for (const item of hm.locations) {
      if (
        !lodash.isUndefined(args.limitTo) &&
        !lodash.isMatch(item.tags, args.limitTo)
      ) {
        continue;
      }

      if (!args.hideHeaders) {
        console.log('---');
        console.log(
          JSON.stringify({ destinations: item.destinations, tags: item.tags })
        );
        console.log('---');
      }

      console.log(item.renderedTemplate);
    }
    return;
  }

  let render;
  if (args.mappingOnly) {
    render = await templator.renderMapping(args.mapping, args.contextSelector);
  } else {
    render = await templator.render(args.mapping, args.contextSelector);
  }

  console.log(JSON.stringify(render, null, 2));
};
