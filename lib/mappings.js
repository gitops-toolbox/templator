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
      console.error(
        `Failed to parse render ${template}, not valid json on ${result}`
      );
      throw e;
    }

    return objResult;
  }
}

module.exports = Mappings;
