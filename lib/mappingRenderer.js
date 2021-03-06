const Renderer = require("./renderer");
const _ = require("lodash");

class mappingRenderer extends Renderer {
  constructor(base, options = {}) {
    const opts = _.cloneDeep(options);
    opts.templatesDir = opts.mappingsDir || "mappings";
    super(base, opts);
  }

  render(template, context) {
    const result = super.render(template, context);
    let objResult;
    try {
      objResult = _.isString(result) ? JSON.parse(result) : result;
    } catch (e) {
      console.error(
        `Failed to parse render ${template}, not valid json on ${result}`
      );
    }
    return objResult;
  }
}

module.exports = mappingRenderer;
