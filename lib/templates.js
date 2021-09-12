const path = require('path');
const _ = require('lodash');
const utils = require('./utils');
const [log, error] = utils.getLogger(__filename);
const nunjucks = require('nunjucks');

class Templates {
  constructor(base, options = {}) {
    if (_.isUndefined(base) || !path.isAbsolute(base)) {
      throw new Error('Base should be an absolute path');
    }

    this.base = base;

    log('options %o', options);

    this.absTemplatesPath = path.resolve(
      base,
      options.templatesDir || 'templates'
    );

    nunjucks.installJinjaCompat();
    this.njk = nunjucks.configure(this.absTemplatesPath, {
      autoescape: false,
      throwOnUndefined: true,
      ...options,
    });
  }

  getAbsTemplatePath(template) {
    return path.resolve(this.absTemplatesPath, template);
  }

  list() {
    return utils.listFiles(this.absTemplatesPath);
  }

  async _renderJs(templatePath, context, mappingFilepath) {
    const jsTemplate = require(templatePath);

    if (jsTemplate.render == undefined) {
      throw new Error(
        `Destination ${templatePath} does not have a render function`
      );
    }

    return jsTemplate.render({
      context,
      meta: {
        __template: path.relative(this.base, templatePath),
        __mapping: mappingFilepath,
      },
    });
  }

  async render(template, context, mappingFilepath = undefined) {
    const templatePath = this.getAbsTemplatePath(template);
    const deepClonedContext = _.cloneDeep(context);
    log('Template path %o, context %o', templatePath, deepClonedContext);
    if (mappingFilepath !== undefined) {
      mappingFilepath = path.relative(this.base, mappingFilepath);
    }

    if (templatePath.endsWith('.js')) {
      return this._renderJs(templatePath, deepClonedContext, mappingFilepath);
    }

    return this.njk
      .addGlobal('context', deepClonedContext)
      .addGlobal('meta', {
        __mapping: mappingFilepath,
        __template: path.relative(this.base, templatePath),
      })
      .render(templatePath, deepClonedContext);
  }
}

module.exports = Templates;
