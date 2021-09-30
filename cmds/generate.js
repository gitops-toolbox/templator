const lodash = require('lodash');
const Templator = require('../lib/templator');
const persist = require('../lib/persist');
const { tryJSONParse } = require('../lib/utils');

exports.command = 'generate <mapping> [context-selector]';

exports.desc = 'Output the rendered templates';

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
    .option('json-output', {
      describe: 'output the templates in json format',
      alias: 'j',
      type: 'boolean',
      default: false,
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
    const mapping = await templator.renderMapping(
      args.mapping,
      args.contextSelector
    );
    console.log(JSON.stringify(mapping, null, 2));
    return;
  }

  const render = await templator.render(args.mapping, args.contextSelector);

  if (args.h) {
    _human_reabable(render, args);
  }

  if (args.j) {
    console.log(JSON.stringify(render, null, 2));
  }

  if (args.persist) {
    console.log(JSON.stringify(await persist(render, args), null, 2));
  }
};
