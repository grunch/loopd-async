# loopd-async

## Overview
This library simplifies connecting to a [Loop](https://github.com/lightninglabs/loop) Daemon via gRPC. It wraps all callback functions in promises to make api calls easier to work with.

This library supports Loop version 0.1.0 commit e8005d095a3dfd79269054bb9a6569b997eafe42.

The gRPC wrapper of this library is a fork and adaptation of lnd-async, all credit is for lnd-async developers.

The project can be run alone to create a simplified REST interface on top of `LOOP` that exposes functionality to client applications, it's recommended to not expose the REST interface directly to the dangerous internet as that gives anyone control of your node.

Loop is in a early stage, for security reasons we should run this software on the same host where `loopd` is running, default port `11010`.

## Using gRPC
You can install loopd-async via npm

    npm install loopd-async
To establish a connection to gRPC `localhost:11010`:

```javascript
const loop = require('loopd-async');

async function getTerms() {
  const client = await loop.connect();
  return await client.loopOutTerms({});
}
getTerms()
  .then(loop => console.log(loop))
  .catch(error => console.error(error));
```
If you need to add specific node IP and Port you can do it this way:
```javascript
const loop = require('loopd-async');

async function getTerms() {
  const client = await loop.connect({
    loopHost: '1.1.1.1',
    loopPort: 11010,
  });
  return await client.loopOutTerms({});
}
getTerms()
  .then(loop => console.log(loop))
  .catch(error => console.error(error));
```
## Using as a Stand-Alone REST API Server

    git clone git@github.com:grunch/loopd-async.git
    cd loopd-async
    npm install
### Configure
In REST mode:

For convenience in REST mode, you can make a .env file with KEY=VALUE pairs instead of setting environment variables.

Environment variables:

    export LOOPD_HOST='1.1.1.1'
    export LOOPD_PORT=11010
    export LOOPD_BASIC_AUTH_USER='admin'
    export LOOPD_BASIC_AUTH_PASSWORD='super_secret_passwd!'
    export TLS_DIR='/home/your_user/.lnd/'

Setting environment variables in Linux:

- Edit `.bashrc` or `~/.profile`
- `$ source ~/.bashrc` in the window you are running the service from

Setting environment variables in MacOS:

- Edit `~/.bash_profile`
- `$ . ~/.bash_profile` in the window you are running the service from

Run the service:

    npm start
### REST API
Authentication is with Basic Authentication.  Make sure that the request has an
authorization header that contains Base64 encoded credentials.

    Authorization: Basic {{TOKEN_GOES_HERE_WITHOUT_BRACES}}

To generate the Base64 encoded credentials you can:

    > let username = 'admin';
    // default username is admin.
    > let password = 'super_secret_passwd!';
    // password must match the LOOPD_SECRET_KEY in your env variables.
    > btoa(`${username}:${password}`);
    // YWRtaW46c3VwZXJfc2VjcmV0X3Bhc3N3ZCE=

And then set the value of the Authorization header to the returned value
`YWRtaW46c3VwZXJfc2VjcmV0X3Bhc3N3ZCE=`.
