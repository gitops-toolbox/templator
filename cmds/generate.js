const lodash = require('lodash');
const Templator = require('../lib/templator');
const persist = require('../lib/persist');
const { tryJSONParse, output, commonYargsOptions } = require('../lib/utils');

exports.command = 'generate <mapping> [context-selector]';

exports.desc = 'Output the rendered templates';

exports.builder = (yargs) => {
  commonYargsOptions(yargs)
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
      coerce: (param) => tryJSONParse(param),
    })
    .options('just-mapping', {
      describe: 'Just render mapping, not templates, useful to debug issues',
      type: 'boolean',
    })
    .option('persist', {
      describe: 'persist templates using the defined destination type',
      type: 'boolean',
      conflicts: ['just-mapping'],
    });
};

function _human_reabable(render, args) {
  for (const item of render.locations) {
    if (
      !lodash.isUndefined(args.limitTo) &&
      !lodash.isMatch(item.tags, args.limitTo)
    ) {
      continue;
    }

    if (!args.hideHeaders) {
      console.log('---');
      console.log(
        JSON.stringify({ destination: item.destination, tags: item.tags })
      );
      console.log('---');
    }

    console.log(item.renderedTemplate);
  }
}

exports.handler = async (args) => {
  const templator = new Templator(args.baseDir, args);

  if (args.justMapping) {
    const { mapping, context } = await templator.renderMapping(
      args.mapping,
      args.contextSelector
    );

    await templator.expandTemplatesContext(mapping, context, args.mapping);

    output({ mapping, context }, args.output || 'json');
    return;
  }

  const render = await templator.render(args.mapping, args.contextSelector);

  if (args.h) {
    _human_reabable(render, args);
  }

  output(render, args.output);

  if (args.persist) {
    output(await persist(render, args), args.output || 'json');
  }
};
