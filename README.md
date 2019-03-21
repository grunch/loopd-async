# loop-async

This library simplifies connecting to a [Loop](https://github.com/lightninglabs/loop) Daemon via gRPC. It wraps all callback functions in promises to make api calls easier to work with.

This library supports LND version 0.5.2-99-beta commit=queue/v1.0.1-106-g9143067014bcde14f1e8f7eb515bae1ccccb97c5.

This library is just a fork and adaptation of lnd-async, all credit is for lnd-async developer.

Loop is in a early stage, for security reasons we should run this software on the same host where `loopd` is running, default port `11010`.

To establish a connection to gRPC `localhost:11010`:

```javascript
const loop = require('./lib/loop-async');

async function getTerms() {
  const client = await loop.connect();
  return await client.loopOutTerms({});
}
getTerms()
  .then(loop => console.log(loop))
  .catch(error => console.error(error));
```
