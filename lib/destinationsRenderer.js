const Renderer = require('./renderer');
const path = require('path');
const _ = require('lodash');

class destinationRenderer extends Renderer {

  constructor(base, options = {}) {
    super(base, {templatesDir: 'destinations', ...options});
  }

  render(template, context) {
    let jsTemplate;

    try {
      jsTemplate = require(path.join(this.absTemplatesPath, template))
    } catch (e) {
      return super.render(template, context);
    }

    if (! _.has(jsTemplate, 'render')) {
      throw new Error(`Destination ${template} does not have a render function`);
    }

    return jsTemplate.render(context);
  }
}

module.exports = destinationRenderer;
