const ContextParser = require('@gitops-toolbox/config-loader');
const Templates = require('./templates');
const Mappings = require('./mappings');
const [log, error] = require('./utils').getLogger(__filename);
const _ = require('lodash');

function isJson(filepath) {
  return filepath.endsWith('.json');
}

class Templator {
  constructor(base, options = {}) {
    options.configDir = options.configDir || 'context';

    this.contextParser = new ContextParser(base, {
      fileFilter: this.fileFilter || isJson,
      configDir: options.contextDir,
      ...options,
    });

    this.mappings = new Mappings(base, options);
    this.templates = new Templates(base, options);
  }

  async renderMapping(mappingFilepath, contextSelector) {
    const context = await this.contextParser.fromSelector(contextSelector);

    log('mappingContext from %o,  %o ', contextSelector, context);
    const mapping = await this.mappings.render(mappingFilepath, context);

    return { mapping, context };
  }

  async render(mappingFilepath, contextSelector) {
    const { mapping, context } = await this.renderMapping(
      mappingFilepath,
      contextSelector
    );
    log('Base mapping %o', mapping);
    await this._expandTemplates(mapping, context, mappingFilepath);
    log('Expanded mapping %o', mapping);
    return mapping;
  }

  async _expandTemplates(renderedMapping, mappingContext, mappingFilepath) {
    log('Destinations rendered into %o', renderedMapping);

    for (const location of renderedMapping.locations) {
      log('Expand location %o', location);

      const context = await this.contextParser._selectFromConfig(
        mappingContext,
        location.contextSelector
      );
      log('Template context %j', context);
      location.renderedTemplate = await this.templates.render(
        location.template,
        _.cloneDeep(context),
        this.mappings.getAbsTemplatePath(mappingFilepath)
      );
    }
  }
}

module.exports = Templator;
