const loop = require('../lib/loop-async');
const { LOOPD_HOST, LOOPD_PORT } = process.env;

/** Get loop in terms.

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
*/

module.exports = async (req, res) => {
  try {
    const client = await loop.connect({
      loopHost: LOOPD_HOST || 'localhost',
      loopPort: LOOPD_PORT || 11010,
    });
    const terms = await client.getLoopInTerms({});

    return res.status(200).json(terms);
  } catch (e) {
    return res.status(404).json(e);
  }
};
