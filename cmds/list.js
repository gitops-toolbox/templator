'use strict';

const _ = require('lodash');
const Mappings = require('../lib/mappings');
const Templates = require('../lib/templates');
const utils = require('../lib/utils');

exports.command = 'list <target>';

exports.desc = `List one between templates and mappings`;

exports.builder = (yargs) => {
  utils.commonYargsOptions(yargs).option('target', {
    describe: 'one between templates and mappings',
    choices: ['templates', 'mappings'],
  });
};

exports.handler = async function (args) {
  let files;

  if (args.target === 'mappings') {
    files = new Mappings(args.baseDir, args).list();
  }

  if (args.target === 'templates') {
    files = new Templates(args.baseDir, args).list();
  }

  utils.output(files, args.output || 'json');
};
