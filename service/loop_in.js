const loop = require('../lib/loop-async');
const { LOOPD_HOST, LOOPD_PORT } = process.env;

/** loop in request

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
*/

module.exports = async (req, res) => {
  try {
    const client = await loop.connect({
      loopHost: LOOPD_HOST || 'localhost',
      loopPort: LOOPD_PORT || 11010,
    });
    const {
      amt,
      max_swap_fee,
      max_miner_fee,
      loop_out_channel,
      external_htlc,
    } = req.body;

    const loopIn = await client.loopIn({
      amt,
      max_swap_fee,
      max_miner_fee,
      loop_out_channel,
      external_htlc,
    });

    return res.status(200).json(loopIn);
  } catch (e) {
    return res.status(404).json(e);
  }
};
