const loop = require('../lib/loop-async');
const { LOOPD_HOST, LOOPD_PORT } = process.env;

/** loop out request

  {
    amt: <Requested swap amount in satoshis Number>
    dest: <Base58 encoded destination address for the swap String>
    max_swap_routing_fee: <Maximum off-chain fee in msat that may be paid for payment to the server Number>
    max_prepay_routing_fee: <Maximum off-chain fee in msat that may be paid for payment to the server Number>
    max_swap_fee: <Maximum we are willing to pay the server for the swap Number>
    max_prepay_amt: <Maximum amount of the swap fee that may be charged as a prepayment Number>
    max_miner_fee: <Maximum in on-chain fees that we are willing to spent Number>
    loop_out_channel: <The channel to loop out>
  }

  @returns
  {
    id: <wap identifier to track status in the update stream that is returned from the Start() call String>
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
      dest,
      max_swap_routing_fee,
      max_prepay_routing_fee,
      max_swap_fee,
      max_prepay_amt,
      max_miner_fee,
      loop_out_channel,
    } = req.body;

    const out = await client.loopOut({
      amt,
      dest,
      max_swap_routing_fee,
      max_prepay_routing_fee,
      max_swap_fee,
      max_prepay_amt,
      max_miner_fee,
      loop_out_channel,
    });

    return res.status(200).json(out);
  } catch (e) {
    return res.status(404).json(e);
  }
};
