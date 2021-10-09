'use strict';

const fs = require('fs');
const path = require('path');
const templatesDir = path.resolve(__dirname, '../lib/templates');

exports.command = 'new <mapping>';

exports.desc = `Output a template for the selected mapping`;

exports.builder = (yargs) => {
  yargs.option('mapping', {
    describe: 'the type of mapping you want to generate',
    choices: fs.readdirSync(templatesDir, {
      encoding: 'utf-8',
    }),
  });
};

exports.handler = async function (args) {
  console.log(
    fs.readFileSync(path.resolve(templatesDir, args.mapping), {
      encoding: 'utf-8',
    })
  );
};
