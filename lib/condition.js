const { fixAction, line } = require('./utils');


const IsFileCond = ({ input, negate, ignoreCase }) => ({
  input: fixAction(input),
  pattern: negate === 'true' ? '!-f' : '-f',
  flags: ncFlag(ignoreCase),
});

const IsDirCond = ({ input, negate, ignoreCase }) => ({
  input: fixAction(input),
  pattern: negate === 'true' ? '!-d' : '-d',
  flags: ncFlag(ignoreCase),
});

const ncFlag = ignoreCase => (
  ignoreCase === 'true' ? '[NC]' : ''
);

const PatternCond = ({ input, pattern, ignoreCase, negate }) => ({
  input: fixAction(input),
  pattern: negate === 'true' ? `!${pattern}` : pattern,
  flags: ncFlag(ignoreCase),
});

const Condition = ({ input, matchType, negate, pattern, ignoreCase }) => (
  matchType === 'IsFile' ? IsFileCond({ input, negate }) :
  matchType === 'IsDirectory' ? IsDirCond({ input, negate }) :
  PatternCond({ input, negate, pattern, ignoreCase })
);

Condition.toString = operator => ({ input, pattern, flags }) => line(
  'RewriteCond', input, pattern, flags, operator
);

module.exports = Condition;