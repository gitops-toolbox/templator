const path = require('path');
const _ = require('lodash');
const utils = require('./utils');
const [log, error] = utils.getLogger(__filename);
const nunjucks = require('nunjucks');
const filters = require('./filters');

class Templates {
  constructor(base, options = {}) {
    if (_.isUndefined(base) || !path.isAbsolute(base)) {
      throw new Error('Base should be an absolute path');
    }

    this.base = base;

    log('options %o', options);
    this.templatesDir = options.templatesDir || 'templates';

    this.absTemplatesPath = path.resolve(base, this.templatesDir);

    nunjucks.installJinjaCompat();
    const env = nunjucks.configure(this.absTemplatesPath, {
      autoescape: false,
      throwOnUndefined: true,
      ...options,
    });
    for (const [filter, func] of Object.entries(filters)) {
      env.addFilter(filter, func);
    }
    this.njk = env;
  }

  absPath(template) {
    return path.resolve(this.absTemplatesPath, template);
  }

  relPath(template) {
    return path.join(this.templatesDir, template);
  }

  list() {
    return utils.listFiles(this.absTemplatesPath);
  }

  async _renderJs(templatePath, context, meta) {
    const jsTemplate = require(templatePath);

    if (jsTemplate.render == undefined) {
      throw new Error(
        `Destination ${templatePath} does not have a render function`
      );
    }

    return jsTemplate.render(context, meta);
  }

  async render(template, context, meta) {
    const templatePath = this.absPath(template);
    const deepClonedContext = _.cloneDeep(context);
    log('Template path %o, context %o', templatePath, deepClonedContext);

    if (templatePath.endsWith('.js')) {
      return this._renderJs(templatePath, deepClonedContext, meta);
    }

    return this.njk
      .addGlobal('context', deepClonedContext)
      .addGlobal('meta', meta)
      .render(templatePath, context);
  }
}

module.exports = Templates;
