const nunjucks = require('nunjucks');
const [log, error] = require('./utils').getLogger(__filename);

class TemplateEngine {
  constructor(baseDir, options = {}) {
    options.autoescape = options.autoescape || false;
    options.throwOnUndefined = options.throwOnUndefined || true;
    this.baseDir = baseDir;
    nunjucks.installJinjaCompat();
    this.env = nunjucks.configure(baseDir, options);
  }

  render(template, context) {
    log('rendering %s with context (%o)', template, context);
    return this.env.addGlobal('this', context).render(template, context);
  }
}

module.exports = TemplateEngine;
