const loop = require('../lib/loop-async');
const { LOOPD_HOST, LOOPD_PORT } = process.env;

/** loop out quote request

  {
    amt: <The amount to swap in satoshis Number>
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
    const { amt } = req.body;

    const quote = await client.loopOutQuote({ amt });

    return res.status(200).json(quote);
  } catch (e) {
    return res.status(404).json(e);
  }
};
