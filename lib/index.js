const { parseStringPromise } = require('xml2js');
const { readFileAsync } = require('./files');
const Rule = require('./rule');

const getXmlText = fileName => readFileAsync(fileName, { encoding: 'utf-8' });

const toRules = ({ rules }) => rules.rule.map(Rule);

const toText = options => rules => rules.map(
  Rule.toString(options)
).join('\n\n');

const convertRulesFile = (fileName, options) => getXmlText(fileName)
  .then(parseStringPromise)
  .then(toRules)
  .then(toText(options))

module.exports = convertRulesFile;