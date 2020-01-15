#!/usr/bin/env node

const { join } = require('path');
const convertRulesFile = require('./index');
const help = require('./help');

const inputFileName = process.argv[2];

if (!inputFileName) {
  console.error('ERROR: File with urlrewrite-rules is not specifed!\n');
  console.log(`\n${help}`);
  process.exit(1);
}

const fullFileName = join(process.cwd(), process.argv[2]);

convertRulesFile(fullFileName, { source: true, html: false })
  .then(rules => console.log(`RewriteEngine On\n\n${rules}`))
  // .catch(err => console.error(err.message));