const EventEmitter = require('events');
const loop = require('../lib/loop-async');
const { LOOPD_HOST, LOOPD_PORT } = process.env;

/** loop monitor request

  {}

  @returns
  <EventEmitter Object>

  @on(data)
  {
    amt: <Requested swap amount in sats Number>
    id: <Swap identifier String>
    type: <Swap type String>
    state: <SwapState, State the swap is currently in String>
    initiation_time: <Initiation time of the swap Number>
    last_update_time: <Initiation time of the swap Number>
    htlc_address: <Htlc address string>
    cost_server: <Swap server cost Number>
    cost_onchain: <On-chain transaction cost Number>
    cost_offchain: <Off-chain routing fees Number>
  }
*/

module.exports = async _ => {
  try {
    const client = await loop.connect({
      loopHost: LOOPD_HOST || 'localhost',
      loopPort: LOOPD_PORT || 11010,
    });
    const eventEmitter = new EventEmitter();
    const monitor = await client.monitor({});
    monitor.on('data', swap => {
      if (!swap) {
        return eventEmitter.emit('error', new Error('ExpectedSwap'));
      }
      if (!swap.id) {
        return eventEmitter.emit('error', new Error('ExpectedSwapId'));
      }

      return eventEmitter.emit('data', swap);
    });

    monitor.on('end', () => eventEmitter.emit('end'));
    monitor.on('error', err => eventEmitter.emit('error', err));
    monitor.on('status', status => eventEmitter.emit('status', status));

    return eventEmitter;
  } catch (e) {
    console.log(e);
  }
};
