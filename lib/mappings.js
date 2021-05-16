const Templates = require('./templates');
const _ = require('lodash');
const [log, error] = require('./utils').getLogger(__filename);

class Mappings extends Templates {
  constructor(base, options = {}) {
    super(base, {
      ...options,
      templatesDir: options.mappingsDir || 'mappings',
    });
  }

  async render(template, context) {
    const result = await super.render(template, context);

    let objResult;

    try {
      objResult = _.isString(result) ? JSON.parse(result) : result;
    } catch (e) {
      error('Failed to render %s, invalid json found: %s', template, result);
      throw new Error(`Failed to render ${template}, invalid json found`);
    }

    return objResult;
  }
}

module.exports = Mappings;
