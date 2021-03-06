#!/usr/bin/env node
import { env, terminalWidth } from 'yargs';

env('TP')
  .option('config-dir', {
    alias: 'c',
    desc: 'path where to find the config',
    type: 'string',
    default: '.',
  })
  .option('context-dir', {
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
  .wrap(terminalWidth())
  .showHelpOnFail(true)
  .demandCommand()
  .recommendCommands()
  .strict().argv;
