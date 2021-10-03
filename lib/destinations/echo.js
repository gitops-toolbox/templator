class EchoDestination {
  constructor(templates, logs, args) {
    this.templates = templates;
    this.logger = logs;
    this.args = args;
  }

  async persist() {
    return {
      templates: this.templates,
    };
  }
}

module.exports = EchoDestination;
