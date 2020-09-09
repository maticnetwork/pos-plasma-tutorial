import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
const bn = require("bn.js");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs").default;

const SCALING_FACTOR = new bn(10).pow(new bn(18));
let maticprovider,parentprovider;
let acc;
function loadAccount(account){
  acc = account;
}
const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
// const web3 = window.web3;
// const accounts = await web3.eth.getAccounts();

const loadData = async () => {
  const maticProvider = new WalletConnectProvider({
    host: `https://rpc-mumbai.matic.today`,
    callbacks: {
      onConnect: console.log("matic connected"),
      onDisconnect: console.log("matic disconnected!"),
    },
  });

  const goerliProvider = new WalletConnectProvider({
    host: `https://goerli.infura.io/v3/541999c8adbc4c3594d03a6b7b71eda6`,
    callbacks: {
      onConnect: console.log("goeril connected"),
      onDisconnect: console.log("goeril disconnected"),
    },
  });
}

async function getMaticClient(_network = "testnet", _version = "mumbai") {
  const network = new Network(_network, _version);
  const { from } = getAccount();
  // const web3 = window.web3;
  // const accounts = await web3.eth.getAccounts();
  const matic = new Matic({
    network: _network,
    version: _version,
    parentProvider: new WalletConnectProvider({
		host: `https://goerli.infura.io/v3/541999c8adbc4c3594d03a6b7b71eda6`,
		callbacks: {
		  onConnect: console.log("goeril connected"),
		  onDisconnect: console.log("goeril disconnected"),
		},
	  }),
    maticProvider: new WalletConnectProvider({
		host: `https://rpc-mumbai.matic.today`,
		callbacks: {
		  onConnect: console.log("matic connected"),
		  onDisconnect: console.log("matic disconnected!"),
		},
	  }),
    parentDefaultOptions: { from:acc },
    maticDefaultOptions: { from:acc },
  });
  await matic.initialize();
  return { matic, network };
}

function getAccount() {
  if (!process.env.PRIVATE_KEY || !process.env.FROM) {
    throw new Error("Please set the PRIVATE_KEY/FROM env vars");
  }
  return { privateKey: process.env.PRIVATE_KEY, from: process.env.FROM };
}

module.exports = {
  SCALING_FACTOR,
  getMaticClient,
  getAccount,
  loadAccount
};