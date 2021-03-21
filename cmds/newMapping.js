'use strict';

const fs = require('fs');
const path = require('path');

exports.command = 'newMapping type';

exports.desc = `Print a mapping structure, you can save that in a file`;

exports.builder = function (yargs) {
  yargs.positional('type', {
    describe: 'mapping type',
    choices: ['js', 'json', 'njk'],
    type: 'string',
  });
};

exports.handler = function (args) {
  const mapping = path.join(
    __dirname,
    `../examples/mappings/mapping.${args.type}`
  );
  console.log(fs.readFileSync(mapping, 'utf-8'));
};
