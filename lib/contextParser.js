const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const log = require("debug")("cg:contextParser");
const error = log.extend("errors");
const {isDirectory, pushToIf} = require('./utils.js');

class ContextParser {
  constructor(base, options = {}) {
    this.base = base;

    this.contexDir = options.contexDir || 'context';
    this.fileFilter = options.fileFilter || (x => true)
    this.parseFunction = options.parseFunction || require;

    this.absBase = path.isAbsolute(base)
      ? base
      : path.resolve(process.cwd(), base);
    this.absContextDir = path.join(this.absBase, this.contexDir);
    
    this.context_files;
  }

  get contextFiles() {
    if (this.context_files) { 
        return this.contex_files
    }
    const list = [];
    const queue = [];
    queue.push(this.absContextDir);

    while (queue.length > 0) {
      const current = queue.shift();
      if (isDirectory(current)) {
        for (const file of fs.readdirSync(current)) {
          const next = path.join(current, file);

          if (isDirectory(next)) {
            queue.push(next);
          } else {
            pushToIf(next.replace(this.absContextDir, ""), list, this.fileFilter);
          }
        }
      }
    }
    this.contex_files = list;
    return list;
  }


  get context() {
    const context = { ctx: {} };
    const path_separator = new RegExp(path.sep, "g");

    for (const file of this.contextFiles) {      
      const json = this.parseFunction(path.join(this.absContextDir, file));
      const key = `ctx${path.dirname(file).replace(path_separator, ".")}`;
      const property = _.get(context, key);

      log("extending %o with %o", key, json);

      if (_.isPlainObject(property)) {
        _.assign(property, json);
      } else if (_.isUndefined(property)) {
        _.set(context, key, json);
      } else {
        throw new Error(`Cannot load ${file}, ${key} is not an Object or Undefined`);
      }
    }
  
    return context.ctx;
  }

  contexSlice(slice) {
    let context = this.context
    if (slice) {
      context = _.get(context, slice);
      if (_.isUndefined(context)) {
        throw new Error(`slice ${slice} seems not to exist in context`);
      } 
    }
    return context
  }
}

module.exports = ContextParser;
