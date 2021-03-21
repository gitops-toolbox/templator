const TemplateEngine = require('./templateEngine');
const path = require('path');
const [log, error] = require('./utils').getLogger(__filename);

class Renderer {
  constructor(base, options = {}) {
    this.base = base;
    log('options %o', options);
    this.absBase = path.isAbsolute(base)
      ? base
      : path.resolve(process.cwd(), base);
    this.absTemplatesPath = path.join(this.absBase, options.templatesDir);

    this.templateEngine =
      options.templateEngine || new TemplateEngine(this.absTemplatesPath);
  }

  _renderJs(templatePath, context) {
    let jsTemplate;
    try {
      jsTemplate = require(templatePath);
    } catch (e) {
      console.error(e);
      return;
    }

    if (jsTemplate.render == undefined) {
      throw new Error(
        `Destination ${templatePath} does not have a render function`
      );
    }

    return jsTemplate.render(context);
  }

  async render(template, context) {
    const templatePath = path.join(this.absTemplatesPath, template);

    let result;

    if (templatePath.endsWith('.js')) {
      result = this._renderJs(templatePath, context);
    }

    return result != undefined
      ? result
      : this.templateEngine.render(templatePath, context);
  }
}

module.exports = Renderer;
