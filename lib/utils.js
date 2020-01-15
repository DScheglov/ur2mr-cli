const { Builder } = require("xml2js");
const builder = new Builder({ rootName: "rule", headless: true });

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const attrs = obj => (obj != null ? obj.$ : obj);

const escHtml = str => str.replace(/>/g, "&gt;").replace(/</g, "&lt;");

const rebuild = obj => builder.buildObject(obj);

const prepend = prefix => str => `${prefix}${str}`;

const forEachline = mapper => str =>
  str
    .split("\n")
    .map(mapper)
    .join("\n");

const fixInhput = input => input
  .replace(/({[^{}]+})/g, "%$1");

const fixAction = action => fixInhput(action
  .replace(/{C:(\d+)}/g, "%$1")
  .replace(/{R:(\d+)}/g, "$$$1")
);

const idX = x => x;

module.exports = {
  compose,
  attrs,
  escHtml,
  rebuild,
  prepend,
  forEachline,
  fixInhput,
  fixAction,
  idX
};
