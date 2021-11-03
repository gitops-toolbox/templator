const lodash = require('lodash');
const Templator = require('../lib/templator');
const persist = require('../lib/persist');
const {
  tryJSONParse,
  output,
  commonYargsOptions,
  parseTags,
} = require('../lib/utils');

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
      implies: 'filter-by',
    })
    .options('filter-by', {
      describe: 'Only show file with a give set of tags',
      type: 'string',
      implies: 'human-readable',
      coerce: (param) => parseTags(param),
    })
    .options('group-by', {
      describe: 'group templates by a set of given tags names',
      type: 'array',
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

  let render = await templator.render(args.mapping, args.contextSelector);

  if (!lodash.isUndefined(args.filterBy)) {
    render.locations = lodash.filter(render.locations, (render) =>
      lodash.isMatch(render.tags, args.filterBy)
    );
  }

  if (args.h) {
    _human_reabable(render, args);
  }

  if (!lodash.isUndefined(args.groupBy)) {
    for (const location of render.locations) {
      location.group = Object.values(
        lodash.pick(location.tags, args.groupBy)
      ).join('_');
    }
  }

  if (args.persist) {
    output(await persist(render, args), args.output || 'json');
  } else {
    output(render, args.output);
  }
};
