const parseQueryString = require('querystring').parse;
const parseUrl = require('url').parse;
const {
  LOOPD_BASIC_AUTH_USER,
  LOOPD_BASIC_AUTH_PASSWORD,
} = process.env;
const username = LOOPD_BASIC_AUTH_USER || 'admin';
const passwd = LOOPD_BASIC_AUTH_PASSWORD;
const urlPrefix = '/?';

/** Verify a websocket client

  {
    origin: <Websocket URL String>
  }

  @returns via cbk
  <Is Authenticated Bool>
*/
module.exports = (args, cbk) => {
  if (!passwd || !args || !args.req || !args.req.url) {
    return false;
  }
  const parsedQuery = parseQueryString(args.req.url.slice(urlPrefix.length));
  if (!parsedQuery || !parsedQuery.passwd || !parsedQuery.username) {
    return false;
  }

  return cbk(parsedQuery.passwd === passwd && parsedQuery.username === username);
};
