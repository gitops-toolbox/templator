const Templates = require('./templates');
const _ = require('lodash');
const utils = require('./utils');
const [log, error] = utils.getLogger(__filename);

class Mappings extends Templates {
  constructor(base, options = {}) {
    super(base, {
      ...options,
      templatesDir: options.mappingsDir || 'mappings',
    });
  }

  _validate(mapping) {
    for (const location of mapping.locations) {
      if (
        !(_.has(location, 'contextSelector') && _.has(location, 'template'))
      ) {
        throw new Error(
          'Each location should have a contextSelector and a template'
        );
      }
    }
  }

  list() {
    return utils.listFiles(this.absTemplatesPath);
  }

  async render(template, context) {
    const result = await super.render(template, context);

    let mapping;

    try {
      mapping = _.isString(result) ? JSON.parse(result) : result;
    } catch (e) {
      error('Failed to render %s, invalid json found: %s', template, result);
      throw new Error(`Failed to render ${template}, invalid json found`);
    }

    this._validate(mapping);
    for (const location of mapping.locations) {
      location.tags = location.tags || {};
      location.destination = location.destination || {};
    }

    return mapping;
  }
}

module.exports = Mappings;
