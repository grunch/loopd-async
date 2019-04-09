const path = require('path');
const grpc = require('grpc');
const { loadSync } = require('@grpc/proto-loader');

module.exports = {
  connect,
};

/**
 * Creates the Loop grpc client.
 * @param {Object} obj
 * @param {String} obj.loopHost
 * @param {Int} obj.loopPort
 * @returns {looprpc}
 */
async function connect({
  loopHost = 'localhost',
  loopPort = 11010,
  longsAsNumbers = false,
}) {
  const packageDefinition = loadSync(path.join(__dirname, 'client.proto'), {
    defaults: true,
    enums: String,
    keepCase: true,
    longs: longsAsNumbers ? Number : String,
    oneofs: true,
  });

  const looprpc = grpc.loadPackageDefinition(packageDefinition).looprpc;
  const loopPath = `${loopHost}:${loopPort}`;
  const swapClient = new looprpc.SwapClient(loopPath, grpc.credentials.createInsecure());

  // return the services and the service definition with all its types
  return { looprpc, services: {swapClient} };
}
