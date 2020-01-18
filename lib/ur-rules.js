const { attrs } = require('./utils');

const toBool = value => {
  if (value == null) return false;
  if (typeof value !== 'string') return Boolean(value);
  try {
    return Boolean(JSON.parse(value.toLowerCase()));
  } catch(e) {
    return false;
  }
}

const mapComditions = conditions => (
  conditions == null || !Array.isArray(conditions[0].add) || conditions[0].add.length === 0
    ? { conditions: [], logicalGrouping: ''}
    ? {
      ...conditions[0].$,
      conditions: conditions[0].add.map(attrs),
    }
    : { conditions: [] }
);

const parseUrl = (url, patternSyntax) => (
  /^wildcard$/i.test(patternSyntax)
    ? url.replace(/\*/g, '(.*)').replace(/\?/g, '.')
    : url
);

const parseMatch = ({ url, patternSyntax, negate, ingoreCase }) => ({
  url: url,
  patternSyntax: patternSyntax || 'ECMAScript',
  negate: toBool(negate),
  ingoreCase: toBool(ingoreCase),
});

const parseAction = action => (
  /^rewrite$/i.test(action.type) ? rewriteAction(action) :
  /^redirect$/i.test(action.type) ? redirectAction(action) :
  /^CustomResponse$/i.test(action.type) ? customResponseAction(action) :
  /^AbortRequest$/i.test(action.type) ? abortResponseAction(action) :
  /* NONE */ ? noneAction
)

const urRule = ({ $, match, conditions, action }) => ({
  name: $.name || null,
  stopProcessing: toBool($.stopProcessing),
  match: parseMatch(match.$),
  ...mapComditions(conditions),
  action: parseAction(action.$),
});

module.exports = urRule;
