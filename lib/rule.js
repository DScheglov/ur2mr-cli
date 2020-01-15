const { 
  compose,
  attrs,
  forEachline,
  prepend,
  rebuild,
  escHtml,
  fixInhput,
  fixAction,
  idX,
} = require('./utils');

const Condition = require('./condition');

const flags = ({ stopProcessing }, { type }) => (
  type === "Redirect" ? '[R]' :
  stopProcessing === 'true' ? '[L]' :
  null
);

const logicalOperator = ({ logicalGrouping } = {}, count) => (
  count > 0 && logicalGrouping === 'MatchAny' ? '[OR]' : ''
);

const preventQs = str => /\?/.test(str) ? str : `${str}?`

const ruleAction = ({ type, url, appendQueryString, }) => (
  type === 'None' ? '-' :
  appendQueryString === 'false' ? preventQs(fixAction(url)) :
  fixAction(url)
);

const Rule = source => {
  const { $, match, conditions, action } = source;
  return ({
    source,
    name: $.name,
    flags: flags($, action[0].$),
    match: fixInhput(match[0].$.url),
    conditions: conditions != null && Array.isArray(conditions[0].add)
      ? conditions[0].add.map(compose(Condition, attrs))
      : null,
    logicalOperator: conditions != null && Array.isArray(conditions[0].add)
      ? logicalOperator(conditions[0].$, conditions[0].add.length)
      : null,
    action: ruleAction(action[0].$),
  });
}


const allowComments = ({ comments = true } = {}) => Boolean(comments);
const allowSource = ({ comments = true, source = true } = {}) => Boolean(comments && source);
const allowHtml = ({ html = false } = {}) => Boolean(html)

const srcAsRemark = options => compose(
  forEachline(prepend('# ')),
  allowSource(options) && allowHtml(options)
    ? escHtml 
    : idX,
  rebuild
);

Rule.toString = options => ({ source, name, flags, match, action, conditions, logicalOperator }) => [
    allowComments(options) && `# ${name}`,
    allowSource(options) && `${srcAsRemark(options)(source)}`,
    ...(conditions != null
      ? conditions.map(Condition.toString(logicalOperator))
      : []
    ),
    ['RewriteRule', match, action, flags].filter(Boolean).join(' '),
  ].filter(Boolean).join('\n');

module.exports = Rule;
