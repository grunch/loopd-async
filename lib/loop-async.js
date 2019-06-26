const { promisify } = require('util');
const looprpc = require('./loop-rpc');

module.exports = {
  connect: async (opts = {}) => wrapAsync(await looprpc.connect(opts)),
};

let streamApis = new Set([
  'monitor',
]);

let callbackApis = new Set([
  'loopIn',
  'getLoopInTerms',
  'getLoopInQuote',
  'loopOut',
  'loopOutTerms',
  'loopOutQuote',
]);

function wrapAsync(looprpc) {
  let result = {
    looprpc,
  };
  for (let service of Object.keys(looprpc.services)) {
    for (let method in looprpc.services[service]) {
      if (streamApis.has(method))
        result[method] = looprpc.services[service][method].bind(looprpc.services[service]);
      else if (callbackApis.has(method))
        result[method] = promisify(looprpc.services[service][method].bind(looprpc.services[service]));
    }
  }
  return result;
}
