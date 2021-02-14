const nunjucks = require('nunjucks');

class TemplateEngine {
  constructor (baseDir, options={}) {
    options.autoescape = options.autoescape || false;
    options.throwOnUndefined = options.throwOnUndefined || true;
    this.baseDir = baseDir;
    nunjucks.installJinjaCompat();
    this.env = nunjucks.configure(baseDir, options);
  }

  render(template, context) {
    return this.env.addGlobal('this', context).render(template, context);
  }
}

module.exports = TemplateEngine;
