const { 
  compose,
  attrs,
  forEachline,
  prepend,
  rebuild,
  escHtml,
  fixInhput,
  fixAction,
  idX: skip,
  line,
  block,
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

const mapConditions = conditions => (
  conditions != null && Array.isArray(conditions[0].add)
    ? {
      conditions: conditions[0].add.map(compose(Condition, attrs)),
      logicalOperator: logicalOperator(conditions[0].$, conditions[0].add.length),
    }
    : { conditions: [], logicalOperator: null }
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
    ...mapConditions(conditions),
    action: ruleAction(action[0].$),
  });
}

const allowComments = ({ comments = true } = {}) => Boolean(comments);
const allowSource = ({ comments = true, source = true } = {}) => Boolean(comments && source);
const allowHtml = ({ html = false } = {}) => Boolean(html)

const srcAsRemark = options => compose(
  forEachline(prepend('# ')),
  allowSource(options) && allowHtml(options) ? escHtml  : skip,
  rebuild
);

Rule.toString = options => 
  ({ source, name, flags, match, action, conditions, logicalOperator }) => block(
    allowComments(options) && Boolean(name) && `# ${name}`,
    allowSource(options) && `${srcAsRemark(options)(source)}`,
    ...conditions.map(Condition.toString(logicalOperator)),
    line('RewriteRule', match, action, flags),
  );

module.exports = Rule;
