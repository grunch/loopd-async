const { OPEN } = require('ws');

const { stringify } = JSON;

/** Broadcast a response to web socket clients.

  {
    log: <Log Function>
    row: <Data Object>
    wss: [<Web Socket Server Object>]
  }
*/
module.exports = ({log, row, wss}) => {
  const stringifiedRow = stringify(row);

  return wss.clients.forEach(client => {
    if (!client || client.readyState !== OPEN) {
      return;
    }

    try {
      return client.send(stringifiedRow);
    } catch (err) {
      return log([500, 'BroadcastFailure', err]);
    }
  });
};
