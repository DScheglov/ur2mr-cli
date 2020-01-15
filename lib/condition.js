const { fixAction } = require('./utils');


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

const NegPatternCond = ({ input, pattern, ignoreCase }) => ({
  input: fixAction(input),
  pattern: `!${pattern}`,
  flags: ncFlag(ignoreCase),
});

const PatternCond = ({ input, pattern, ignoreCase }) => ({
  input: fixAction(input),
  pattern,
  flags: ncFlag(ignoreCase),
});

const Condition = ({ input, matchType, negate, pattern, ignoreCase }) => (
  matchType === 'IsFile' ? IsFileCond({ input, negate }) :
  matchType === 'IsDirectory' ? IsDirCond({ input, negate }) :
  negate === 'true' ? NegPatternCond({ input, pattern, ignoreCase }) :
  PatternCond({ input, pattern, ignoreCase })
);

Condition.toString = operator => ({ input, pattern, flags }) => [
  'RewriteCond', input, pattern, flags, operator
].filter(Boolean).join(' ');

module.exports = Condition;