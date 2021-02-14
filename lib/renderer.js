const TemplateEngine = require('./templateEngine');
const path = require('path');
const log = require('debug')('cg:renderer');

class Renderer {

  constructor(base, options = {}) {
    this.base = base;
    log('options %o', options);
    this.absBase = path.isAbsolute(base)
      ? base
      : path.resolve(process.cwd(), base);
    this.absTemplatesPath = path.join(this.absBase, options.templatesDir);

    this.templateEngine = options.templateEngine || new TemplateEngine(this.absTemplatesPath);
  }

  render(template, context) {
    const templatePath = path.join(this.absTemplatesPath, template);
  
    return this.templateEngine.render(templatePath, context);
  }
}

module.exports = Renderer;
