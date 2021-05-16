const ContextParser = require('@gitops-toolbox/config-loader');
const Templates = require('./templates');
const MappingRenderer = require('./mappings');
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
      ...options,
    });

    this.mappingRenderer = new MappingRenderer(base, options);
    this.templates = new Templates(base, options);
  }

  async render(mappingFilepath, contextSelector) {
    const context = await this.contextParser.fromSelector(contextSelector);

    log('mappingContext from %o,  %o ', contextSelector, context);
    const mapping = await this.mappingRenderer.render(mappingFilepath, context);

    log('Base mapping %o', mapping);
    await this._expandTemplates(mapping, context, mappingFilepath);
    log('Expanded mapping %o', mapping);
    return mapping;
  }

  async humanReadable(mappingTemplate, contextSelector) {
    log('human readable');
    const mapping = await this.render(mappingTemplate, contextSelector);
    const destinations = [];

    for (const location of mapping.locations) {
      destinations.push({
        destination: location.destination,
        content: location.renderedTemplate,
      });
    }

    return destinations;
  }

  async _expandTemplates(renderedMapping, mappingContext, mappingFilepath) {
    log('Destinations rendered into %o', renderedMapping);

    renderedMapping.locations = _.filter(
      renderedMapping.locations,
      (x) => x != null
    );

    for (const location of renderedMapping.locations) {
      log('Expand location %o', location);
      if (
        !(_.has(location, 'contextSelector') && _.has(location, 'template'))
      ) {
        throw new Error(
          'Each location should have a contextSelector and a template'
        );
      }
      const context = await this.contextParser._selectFromConfig(
        mappingContext,
        location.contextSelector
      );
      log('Template context %j', context);
      location.renderedTemplate = await this.templates.render(
        location.template,
        context,
        this.mappingRenderer.getAbsTemplatePath(mappingFilepath)
      );
    }
  }
}

module.exports = Templator;
