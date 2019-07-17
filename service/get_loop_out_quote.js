const loop = require('../lib/loop-async');
const { LOOPD_HOST, LOOPD_PORT } = process.env;

/** Get loop out quote request

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
*/

module.exports = async (req, res) => {
  try {
    const client = await loop.connect({
      loopHost: LOOPD_HOST || 'localhost',
      loopPort: LOOPD_PORT || 11010,
    });
    const { amt, conf_target } = req.body;

    const quote = await client.loopOutQuote({
      amt,
      conf_target: conf_target || 6,
    });

    return res.status(200).json(quote);
  } catch (e) {
    return res.status(404).json(e);
  }
};
