const Templates = require('./templates');
const Mappings = require('./mappings');
const path = require('path');
const utils = require('./utils');
const [log, error] = require('./utils').getLogger(__filename);
const _ = require('lodash');

class Templator {
  constructor(base, options = {}) {
    this.base = base;
    options.configDir = options.configDir || 'context';

    this.contextParser = utils.getContextParser(base, {
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
    await this.expandTemplatesContext(mapping, context, mappingFilepath);
    await this._expandTemplates(mapping, mappingFilepath);
    log('Expanded mapping %o', mapping);
    return mapping;
  }

  async expandTemplatesContext(
    renderedMapping,
    mappingContext,
    mappingFilepath
  ) {
    for (const location of renderedMapping.locations) {
      log('Expand location %o', location);

      location.templateData = location.templateData || {
        context: await this.contextParser._selectFromConfig(
          mappingContext,
          location.contextSelector
        ),
        meta: {
          __mapping: this.mappings.relPath(mappingFilepath),
          __template: this.templates.relPath(location.template),
        },
      };
    }
  }

  async _expandTemplates(renderedMapping, mappingFilepath) {
    log('Destinations rendered into %o', renderedMapping);

    for (const location of renderedMapping.locations) {
      log('Expand location %o', location);

      location.renderedTemplate = await this.templates.render(
        location.template,
        location.templateData.context,
        location.templateData.meta
      );
    }
  }
}

module.exports = Templator;
