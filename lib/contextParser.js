const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const log = require("./utils").getLogger(__filename);
const { isDirectory, pushToIf } = require("./utils.js");

class ContextParser {
  constructor(base, options = {}) {
    this.absBase = path.isAbsolute(base)
      ? base
      : path.resolve(process.cwd(), base);

    this.contextDir = options.contextDir || "context";
    this.fileFilter = options.fileFilter || ((x) => true);
    this.parseFunction = options.parseFunction || require;
    this.absContextDir = path.join(this.absBase, this.contextDir);

    this.context_cache = undefined;
    this.context_files;
  }

  get contextFiles() {
    if (this.context_files != undefined) {
      return this.context_files;
    }
    const list = [];
    const queue = [];
    queue.push(this.absContextDir);

    while (queue.length > 0) {
      const directory = queue.shift();
      for (const file of fs.readdirSync(directory)) {
        const next = path.join(directory, file);

        if (isDirectory(next)) {
          queue.push(next);
          continue;
        }

        pushToIf(next.replace(`${this.absBase}/`, ""), list, this.fileFilter);
      }
    }

    this.context_files = list;
    return list;
  }

  loadContextFromFiles() {
    const context = { [this.contextDir]: {} };

    for (const file of this.contextFiles) {
      const json = this.parseFunction(path.join(this.absBase, file));
      const key = path.dirname(file).split(path.sep);
      const property = _.get(context, key);

      log("extending %o with %o", key, json);

      if (key === "ctx.") {
        context.ctx = json;
      } else if (_.isPlainObject(property)) {
        _.assign(property, json);
      } else if (_.isUndefined(property)) {
        _.set(context, key, json);
      } else {
        throw new Error(`Fail ${file}: ${key} is not Object nor Undefined`);
      }
    }

    this.context_cache = context[this.contextDir];
  }

  get context() {
    if (this.context_cache == undefined) {
      this.loadContextFromFiles();
    }
    return _.cloneDeep(this.context_cache);
  }

  _extendContext(baseContext, selector, method, context) {
    log("selector %o, %o", selector, baseContext);
    log("selector[%s] = %o", method, selector[method]);
    for (const subContext of selector[method] || []) {
      if (_.isPlainObject(subContext)) {
        _[method](baseContext, subContext);
        continue;
      }
      if (subContext == ".") {
        log("_.%s(%o, %o)", method, baseContext, context);
        _[method](baseContext, context);
      } else {
        log("_.%s(%o, %o)", method, baseContext, _.get(context, subContext));
        _[method](baseContext, _.get(context, subContext));
      }
    }
  }

  _contextFromObject(context, selector) {
    log("Context %o", context);
    const baseContext = _.get(this.context, selector.base);
    log("Base context from %s %o", selector.base, context);
    this._extendContext(baseContext, selector, "assign", context);
    this._extendContext(baseContext, selector, "mergeWith", context);
    log("result %o", baseContext);
    return baseContext;
  }

  _selectFromContext(context, selector) {
    if (selector == undefined) return context;
    let result;
    if (_.isString(selector) || _.isArray(selector)) {
      if (selector == ".") {
        result = context;
      } else {
        result = _.get(context, selector);
      }
    }

    if (_.isPlainObject(selector)) {
      log("Selector is object %o", selector);
      result = this._contextFromObject(context, selector);
    }

    if (_.isUndefined(result)) {
      throw new Error(`${selector} seems not to get any context`);
    }

    log("Selected context %o", result);
    return result;
  }

  fromSelector(selector) {
    log("=== Selecting new context from %o ===", selector);
    return this._selectFromContext(this.context, selector);
  }
}

module.exports = ContextParser;
