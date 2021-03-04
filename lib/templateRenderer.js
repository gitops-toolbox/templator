const Renderer = require('./renderer');
const _ = require('lodash');

class TemplateRenderer extends Renderer {
  constructor(base, options = {}) {
    const opts = _.cloneDeep(options);
    super(base, {templatesDir: 'templates', ...opts});
  }
}

module.exports = TemplateRenderer;
