require('dotenv').config();
const https = require('https');
const { join } = require('path');
const { readFileSync } = require('fs');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const compress = require('compression')();
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const {
  getTerms,
  loopOut,
  loopOutQuote,
} = require('./service');

const {
  TLS_DIR,
  LOOPD_BASIC_AUTH_USER,
  LOOPD_BASIC_AUTH_PASSWORD,
} = process.env;
const { log } = console;
const app = express();
const logFormat = ':method :url :status - :response-time ms - :user-agent';
const port = process.env.PORT || 20010;
const httpsPort = 20020;

if (!LOOPD_BASIC_AUTH_PASSWORD) {
  log('LOOPD_BASIC_AUTH_PASSWORD env var is required for Stand-Alone REST API Server');
  process.exit(1);
}

if (!TLS_DIR) {
  log('TLS_DIR env var is required for Stand-Alone REST API Server');
  process.exit(1);
}

app.disable('x-powered-by');
app.use(compress);
app.use(cors());
app.use(bodyParser.json());
app.use(logger(logFormat));
const users = {users:{}};
const userName = LOOPD_BASIC_AUTH_USER || 'admin';
users.users[userName] = LOOPD_BASIC_AUTH_PASSWORD;
app.use(basicAuth(users));

app.get('/v0/terms', getTerms);
app.post('/v0/loop_out', loopOut);
app.post('/v0/loop_out_quote', loopOutQuote);

const [cert, key] = ['cert', 'key']
  .map(extension => join(TLS_DIR, `tls.${extension}`))
  .map(n => readFileSync(n, 'utf8'));
const httpsServer = https.createServer({ cert, key }, app);
httpsServer.listen(httpsPort, () => log(`Listening HTTPS on port: ${httpsPort}`));
