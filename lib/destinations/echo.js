const _ = require('lodash');

class EchoDestination {
  constructor(templates, logs, args) {
    this.templates = templates;
    this.logger = logs;
    this.args = args;
  }

  async persist() {
    let templates = this.templates;

    return {
      templates,
    };
  }
}

module.exports = EchoDestination;
