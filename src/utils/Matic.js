const MaticPoSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Matic = require("@maticnetwork/maticjs");
const config = require("./config.json");

// posClientGeneral facilitates the operations like approve, deposit, exit
export const posClientParent = (maticProvider, account, inj_provider) => {
  const maticPoSClient = new MaticPoSClient({
    network: config.NETWORK,
    version: config.VERSION,
    maticProvider: maticProvider,
    parentProvider: inj_provider,
    parentDefaultOptions: { from: account },
    maticDefaultOptions: { from: account },
  });
  return maticPoSClient;
};

// getMaticPlasmaClient facilitates the burning of tokens on the matic chain
export const getMaticPlasmaParent = async (maticProvider, account, inj_provider) => {
  const _network = config.NETWORK;
  const _version = config.VERSION;
  // const network = new Network(_network, _version);
  const matic = new Matic({
    network: _network,
    version: _version,
    parentProvider: inj_provider,
    maticProvider: maticProvider,
    parentDefaultOptions: { from: account },
    maticDefaultOptions: { from: account },
  });
  await matic.initialize();
  return matic;
};
