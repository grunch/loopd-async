# loopd-async

## Overview
This library simplifies connecting to a [Loop](https://github.com/lightninglabs/loop) Daemon via gRPC. It wraps all callback functions in promises to make api calls easier to work with.

This library supports Loop version v0.2-alpha.

The gRPC wrapper of this library is a fork and adaptation of lnd-async, all credit is for lnd-async developers.

The project can be run alone to create a simplified REST interface on top of `LOOP` that exposes functionality to client applications, it's recommended to not expose the REST interface directly to the dangerous internet as that gives anyone control of your node.

Loop is in a early stage, for security reasons we should run this software on the same host where `loopd` is running, default port `11010`.

## Using gRPC
You can install loopd-async via npm

    npm install loopd-async
To establish a connection to gRPC `localhost:11010`:

```javascript
const loop = require('loopd-async');

async function loopInTerms() {
  const client = await loop.connect();
  return await client.getLoopInTerms({});
}
loopInTerms()
  .then(loop => console.log(loop))
  .catch(error => console.error(error));
```
If you need to add specific node IP and Port you can do it this way:
```javascript
const loop = require('loopd-async');

async function loopInTerms() {
  const client = await loop.connect({
    loopHost: 'localhost',
    loopPort: 11010,
  });
  return await client.getLoopInTerms({});
}
loopInTerms()
  .then(loop => console.log(loop))
  .catch(error => console.error(error));
```
## Using as a Stand-Alone REST API Server

    git clone https://github.com/grunch/loopd-async.git
    cd loopd-async
    npm install
### Configure
In REST mode:

For convenience in REST mode, you can make a .env file with KEY=VALUE pairs instead of setting environment variables.

Environment variables:

    export LOOPD_HOST='localhost'
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
    // username must match the LOOPD_BASIC_AUTH_USER in your env variables
    // if you don't indicate this, the default username is 'admin'
    > let password = 'super_secret_passwd!';
    // password must match the LOOPD_BASIC_AUTH_PASSWORD in your env variables.
    > btoa(`${username}:${password}`);
    // YWRtaW46c3VwZXJfc2VjcmV0X3Bhc3N3ZCE=

And then set the value of the Authorization header to the returned value
`YWRtaW46c3VwZXJfc2VjcmV0X3Bhc3N3ZCE=`.

## Methods
- [loopIn](#loopIn) - LoopIn initiates a loop in swap.
- [getLoopInTerms](#getLoopInTerms) - Returns the terms that the server enforces for swaps.
- [getLoopInQuote](#getLoopInQuote) - Returns the terms that the server enforces for swaps.
- [loopOut](#loopOut) - Initiates an loop out swap.
- [loopOutTerms](#loopOutTerms) - Returns the terms that the server enforces for a loop out swap.
- [loopOutQuote](#loopOutQuote) - Returns a quote for a loop out swap.

### loopIn
Initiates a loop in swap with the given parameters. The call returns after the swap has been set up with the swap server. From that point onwards, progress can be tracked via the SwapStatus stream that is returned from Monitor().

    {
      amt: <Requested swap amount in satoshis Number>
      max_swap_fee: <Maximum we are willing to pay the server for the swap Number>
      max_miner_fee: <Maximum in on-chain fees that we are willing to spent Number>
      loop_in_channel: <The channel to loop in>
      external_htlc: <If external_htlc is true, we expect the htlc to be published by an external Boolean>
    }

    @returns
    {
      id: <Swap identifier to track status in the update stream String>
      htlc_address: <Htlc address String>
    }

### getLoopInTerms
GetTerms returns the terms that the server enforces for swaps.


    {}

    @returns
    {
      swap_payment_dest: <The node pubkey where the swap payment needs to be paid to String>
      swap_fee_base: <The base fee for a swap (sat) Number>
      swap_fee_rate: <The fee rate for a swap (parts per million) Number>
      prepay_amt: <Required prepay amount Number>
      min_swap_amount: <Minimum swap amount (sat) Number>
      max_swap_amount: <Maximum swap amount (sat) Number>
      cltv_delta: <On-chain cltv expiry delta Number>
      max_cltv: <Maximum cltv expiry delta Number>
    }

### getLoopInQuote
Returns a quote for a loop out swap with the provided parameters.


    {
      amt: <The amount to swap in satoshis Number>
    }

    @returns
    {
      swap_fee: <The fee that the swap server is charging for the swap Number>
      prepay_amt: <The part of the swap fee that is requested as a prepayment Number>
      miner_fee: <An estimate of the on-chain fee that needs to be paid to sweep the HTLC Number>
    }

### loopOut
Initiates an loop out swap with the given parameters. The call returns after the swap has been set up with the swap server. From that point onwards, progress can be tracked via the SwapStatus stream that is returned from Monitor().

    {
      amt: <Requested swap amount in satoshis Number>
      dest: <Base58 encoded destination address for the swap String>
      max_swap_routing_fee: <Maximum off-chain fee in msat that may be paid for payment to the server Number>
      max_prepay_routing_fee: <Maximum off-chain fee in msat that may be paid for payment to the server Number>
      max_swap_fee: <Maximum we are willing to pay the server for the swap Number>
      max_prepay_amt: <Maximum amount of the swap fee that may be charged as a prepayment Number>
      max_miner_fee: <Maximum in on-chain fees that we are willing to spent Number>
      loop_out_channel: <The channel to loop out String>
      conf_target: <The confirmation target that should be used by the swap server Number>
    }

    @returns
    {
      id: <Swap identifier to track status in the update stream String>
      htlc_address: <Htlc address String>
    }

### loopOutTerms
Returns the terms that the server enforces for a loop out swap.

    {}

    @returns
    {
      swap_payment_dest: <The node pubkey where the swap payment needs to be paid to String>
      swap_fee_base: <The base fee for a swap (sat) Number>
      swap_fee_rate: <The fee rate for a swap (parts per million) Number>
      prepay_amt: <Required prepay amount Number>
      min_swap_amount: <Minimum swap amount (sat) Number>
      max_swap_amount: <Maximum swap amount (sat) Number>
      cltv_delta: <On-chain cltv expiry delta Number>
      max_cltv: <Maximum cltv expiry delta Number>
    }
### loopOutQuote
Returns a quote for a loop out swap with the provided parameters.

    {
      amt: <The amount to swap in satoshis Number>
      conf_target: <The confirmation target that should be used by the swap server Number>
    }

    @returns
    {
      swap_fee: <The fee that the swap server is charging for the swap Number>
      prepay_amt: <The part of the swap fee that is requested as a prepayment Number>
      miner_fee: <An estimate of the on-chain fee that needs to be paid to sweep the HTLC Number>
    }

## Official API documentation
https://lightningloop.io
