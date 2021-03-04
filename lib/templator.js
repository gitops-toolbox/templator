const ContextParser = require('./contextParser');
const TemplateRenderer = require('./templateRenderer');
const MappingRenderer = require('./mappingRenderer');
const log = require('./utils').getLogger(__filename);
const _ = require('lodash');

function isJson(filepath) {
  return filepath.endsWith('.json');
}

class Templator {
  constructor(base, options = {}) {
    this.base = base;

    this.fileFilter = options.fileFilter || isJson;
    this.contextParser = new ContextParser(base, {
      fileFilter: this.fileFilter,
      ...options
    });
    this.mappingRenderer = new MappingRenderer(base, _.cloneDeep(options));
    this.templateRenderer = new TemplateRenderer(base, _.cloneDeep(options));
  }

  render(mappingTemplate, contextSelector) {
    const mappingContext = this.contextParser.fromSelector(contextSelector);
    log('mappingContext from %o,  %o ', contextSelector, mappingContext);
    const mapping = this.mappingRenderer.render(mappingTemplate, mappingContext);
    this._expandTemplates(mapping, mappingContext);
    return mapping;
  }

  humanReadable(mappingTemplate, contextSelector) {
    log('human readable');
    const mapping = this.render(mappingTemplate, contextSelector);
    const destinations = [];
    for (const location of mapping.locations) {
      destinations.push(
        {
          destination: location.destination,
          content: location.renderedTemplate
        }
      )
    }
    return destinations;
  }

  _expandTemplates(renderedMapping, mappingContext) {
    log('Destinations rendered into %o', renderedMapping);
    renderedMapping.locations = _.filter(renderedMapping.locations, (x) => x != null);
    for (const location of renderedMapping.locations) {
      log('Expand location %o', location);
      if (! (_.has(location, 'contextSelector') && _.has(location, 'template'))) {
        throw new Error('Each location should have a contextSelector and a template defined')
      }
      const context = this.contextParser._selectFromContext(mappingContext, location.contextSelector);
      location.renderedTemplate = this.templateRenderer.render(location.template, context); 
    }
  }
}

module.exports = Templator;
