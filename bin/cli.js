#!/usr/bin/env node
const yargs = require('yargs');

yargs
  .env('TP')
  .option('base-dir', {
    alias: 'b',
    desc: 'path where to find the config',
    type: 'string',
    default: '.',
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
