const path = require('path');
const [log, error] = require('./utils').getLogger(__filename);
const nunjucks = require('nunjucks');

class Templates {
  constructor(base, options = {}) {
    this.base = base;

    log('options %o', options);

    this.absTemplatesPath = path.resolve(
      path.resolve(process.cwd(), base),
      options.templatesDir || 'templates'
    );

    this.njk = nunjucks.configure(this.absTemplatesPath, {
      autoescape: false,
      throwOnUndefined: true,
      ...options,
    });
  }

  getAbsTemplatePath(template) {
    return path.resolve(this.absTemplatesPath, template);
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
        __template: templatePath,
        __mapping: mappingFilepath,
      },
    });
  }

  async render(template, context, mappingFilepath) {
    const templatePath = path.resolve(this.absTemplatesPath, template);
    log('Template path %o, context %o', templatePath, context);

    if (templatePath.endsWith('.js')) {
      return this._renderJs(templatePath, context, mappingFilepath);
    }

    return this.njk
      .addGlobal('context', context)
      .addGlobal('meta', {
        __mapping: mappingFilepath,
        __template: templatePath,
      })
      .render(templatePath, context);
  }
}

module.exports = Templates;
