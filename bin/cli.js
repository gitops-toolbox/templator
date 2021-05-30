#!/usr/bin/env node
const yargs = require('yargs');
const path = require('path');

yargs
  .env('TP')
  .option('base-dir', {
    alias: 'b',
    desc: 'path where to find the config',
    type: 'string',
    default: '.',
    coerce: (base) => {
      return path.resolve(process.cwd(), base);
    },
  })
  .option('context-dir', {
    alias: 'config-dir',
    type: 'string',
    describe: 'directory name of the context folder',
    default: 'context',
  })
  .options('mappings-dir', {
    type: 'string',
    describe: 'directory where to search for mappings',
    default: 'mappings',
  })
  .options('templates-dir', {
    type: 'string',
    describe: 'directory where to find the templates',
    default: 'templates',
  })
  .commandDir('../cmds')
  .wrap(yargs.terminalWidth())
  .showHelpOnFail(true)
  .demandCommand()
  .recommendCommands()
  .strict().argv;
