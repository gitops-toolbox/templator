const Renderer = require('./renderer');

class TemplateRenderer extends Renderer{

  constructor(base, options = {}) {
    super(base, {templatesDir: 'templates', ...options});
  }
}

module.exports = TemplateRenderer;
