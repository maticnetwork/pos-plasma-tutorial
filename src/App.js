import React, { useEffect, useState } from "react";
import ERC20abi from "./contracts/Token.json";
import Web3 from "web3";
import Navbar from "./Navbar";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
const config = require('./config')
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs");

console.log("MATIC",Matic);
const App = () => {
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);
  let content;
  const [loading2, setloading2] = useState(false);

  const [Networkid, setNetworkid] = useState(0);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [ERC20, setERC20] = useState({});
  const [Maticweb3, setMaticweb3] = useState();
  const [Goerliweb3, setGoerliweb3] = useState();
  const [MycontractAddress, setMycontractaddress] = useState("");
  const [inputvalue, setinputvalue] = useState("");
	const [burnHash, setburnHash] = useState("");
  const [maticSdk, setmaticSdk] = useState();
  const [maticprovider, setMaticprovider] = useState();
  const [goerliprovider, setgoerliprovider] = useState();
  const [erc20balance, seterc20balance] = useState("");

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

  const loadBlockchainData = async () => {
    setLoading(true);
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

    setMaticprovider(maticProvider);
    setgoerliprovider(goerliProvider);

    const maticWeb3 = new Web3(maticProvider);
    setMaticweb3(maticWeb3);
    const goerilWeb3 = new Web3(goerliProvider);
    setGoerliweb3(goerilWeb3);
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    setNetworkid(networkId);

    if (networkId === 5) {
      const erc20 = new web3.eth.Contract(ERC20abi.abi, config.goerliDerc20address);
      const name = await erc20.methods.balanceOf(accounts[0]).call();
      const balance = name / 1000000000000000000; // 18 decimals
      console.log(balance);
      seterc20balance(balance);

      setERC20(erc20);
      setLoading(false);
    } else if (networkId === 80001) {
      const erc20 = new web3.eth.Contract(ERC20abi.abi, config.maticDerc20address);
      const name = await erc20.methods.balanceOf(accounts[0]).call();
      const balance = name / 1000000000000000000; // 18 decimals
      console.log(balance);
      seterc20balance(balance);
      setLoading(false);
    } else {
      window.alert(" contract not deployed to detected network.");
      setloading2(true);
    }
  };
  // posclientGeneral facilitates the operations like approve, deposit, exit  
  const posclientGeneral = () => {
    const maticPOSClient = new MaticPOSClient({
      network: "testnet",
      version: "mumbai",
      maticProvider: maticprovider,
      parentProvider: window.web3,
      POSRootChainManager: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74",
      posERC20Predicate: "0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34",
      posERC721Predicate: "0x74D83801586E9D3C4dc45FfCD30B54eA9C88cf9b",
      posERC1155Predicate: "0xB19a86ba1b50f0A395BfdC3557608789ee184dC8",
      posEtherPredicate: "0xe2B01f3978c03D6DdA5aE36b2f3Ac0d66C54a6D5",
      parentDefaultOptions: { from: account },
      maticDefaultOptions: { from: account },
    });
    return maticPOSClient;
  };
  // posclientBurn facilitates the burning of tokens on the matic chain
  const posclientBurn = () => {
    const maticPOSClient = new MaticPOSClient({
      network: "testnet",
      version: "mumbai",
      maticProvider: window.web3,
      parentProvider: window.web3,
      POSRootChainManager: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74",
      posERC20Predicate: "0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34",
      posERC721Predicate: "0x74D83801586E9D3C4dc45FfCD30B54eA9C88cf9b",
      posERC1155Predicate: "0xB19a86ba1b50f0A395BfdC3557608789ee184dC8",
      posEtherPredicate: "0xe2B01f3978c03D6DdA5aE36b2f3Ac0d66C54a6D5",
      parentDefaultOptions: { from: account },
      maticDefaultOptions: { from: account },
    });
    return maticPOSClient;
  };
// getMaticPlasmaClient facilitates the burning of tokens on the matic chain
  const getMaticPlasmaClient = async (_network = "testnet", _version = "mumbai") => {
    const network = new Network(_network, _version);
    const matic = new Matic({
    network: _network,
    version: _version,
    parentProvider: window.web3,
    maticProvider: maticprovider,
    parentDefaultOptions: { from:account },
    maticDefaultOptions: { from:account },


    });
    await matic.initialize();
    return { matic, network };
  };

    // getMaticPlasmaClientBurn facilitates the operations like approve, deposit,confirmWithdraw ,exit 
  const getMaticPlasmaClientBurn = async (_network = "testnet", _version = "mumbai") => {
    const network = new Network(_network, _version);
    const matic = new Matic({
    network: _network,
    version: _version,
    parentProvider: goerliprovider,
    maticProvider: window.web3,
    parentDefaultOptions: { from:account },
    maticDefaultOptions: { from:account },


    });
    await matic.initialize();
    return { matic, network };
  };

  const maticPlasma = new Matic({
    maticProvider: maticprovider,
    parentProvider: window.web3,
    rootChain: "0x2890bA17EfE978480615e330ecB65333b880928e",
    withdrawManager: "0x2923C8dD6Cdf6b2507ef91de74F1d5E0F11Eac53",
    depositManager: "0x7850ec290A2e2F40B82Ed962eaf30591bb5f5C96",
    registry: "0xeE11713Fe713b2BfF2942452517483654078154D",
});
const maticPlasmaBurn = new Matic({
  maticProvider: window.web3,
  parentProvider: window.web3,
  rootChain: "0x2890bA17EfE978480615e330ecB65333b880928e",
  withdrawManager: "0x2923C8dD6Cdf6b2507ef91de74F1d5E0F11Eac53",
  depositManager: "0x7850ec290A2e2F40B82Ed962eaf30591bb5f5C96",
  registry: "0xeE11713Fe713b2BfF2942452517483654078154D",
})
  // POS ether functionality
  const Approve = async () => {
		const maticPOSClient = posclientGeneral();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await maticPOSClient.approveERC20ForDeposit(config.goerliDerc20address, x1, {
      from: account,
    });
  };

  const DepositEther = async () => {
    const maticPOSClient = posclientGeneral();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();

    await maticPOSClient.depositEtherForUser(account, x1, {
      from: account,
    });
  };

  const burnEther = async () => {
    const maticPOSClient = posclientBurn();
    const x = inputvalue * 1000000000000000000;
		const x1 = x.toString();
    await maticPOSClient.burnERC20(config.maticWETH, x1, {
      from: account,
    }).then((res) => {
			console.log(res.transactionHash);
			setburnHash(res.transactionHash);
		})
  };

  const exitEther = async () => {
    const maticPOSClient = posclientGeneral();
    await maticPOSClient.exitERC20(inputvalue, {
      from: account,
    }).then((res) => {
      console.log("exit o/p",res);
    })
  };

  // POS ERC20 functionality
  const ApproveERC20 = async () => {
		const maticPOSClient = posclientGeneral();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await maticPOSClient.approveERC20ForDeposit(config.goerliDerc20address, x1, {
      from: account,
    });
  };

  const DepositERC20 = async () => {
    const maticPOSClient = posclientGeneral();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await maticPOSClient.depositERC20ForUser(config.goerliDerc20address,account, x1, {
      from: account,
    });
  };

  const burnERC20 = async () => {
    const maticPOSClient = posclientBurn();
    const x = inputvalue * 1000000000000000000;
		const x1 = x.toString();
    await maticPOSClient.burnERC20(config.maticDerc20address, x1, {
      from: account,
    }).then((res) => {
			setburnHash(res.transactionHash);
		})
  };

  const exitERC20 = async () => {
    const maticPOSClient = posclientGeneral();
    await maticPOSClient.exitERC20(inputvalue, {
      from: account,
      gas: "7000000"
    }).then((res) => {
      console.log("exit o/p",res);
    })
  };
  const onchange = (e) => {
    setinputvalue(e.target.value);
  };


  // Plasma ether functionality
  const depositEtherPlasma = async () => {
    const { matic,network } = await getMaticPlasmaClient();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await matic.depositEther(x1,{
      from: account
    }).catch(err => {
      console.log(err);

    })
  }
  
  const ApproveEtherPlasma = async () => {
    console.log("approve")
  }

  const burnEtherPlasma = async () => {
    const { matic,network } = await getMaticPlasmaClientBurn();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await matic.startWithdraw(config.childMTXaddress, x1, {
      from:account
    }).then((res) => {
      console.log("burn ether plasma txn hash",res.transactionHash);
    })
  }

  const confirmWithdrawEtherPlasma = async () => {
    const { matic,network } = await getMaticPlasmaClient();
    await matic.withdraw(inputvalue, { from:account, gas: "7000000" }).then((res) => {
      console.log("Confirm withdraw hash: ", res.transactionHash);
    });
  }

  const exitEtherPlasma = async () => {
    const { matic,network } = await getMaticPlasmaClient();
    await matic.processExits(config.mainMaticWETH, {from:account, gasPrice:"7000000"}).then((res)=> {
      console.log("process exit",res.transactionHash);
    })
  }

  // Plasma ERC20 functionality 
  const depositERC20Plasma = async () => {
    const { matic,network } = await getMaticPlasmaClient();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await matic.approveERC20TokensForDeposit(config.mainTestToken, x1, {
      from:account,
      gasPrice: "10000000000",
    });
    return matic.depositERC20ForUser(config.mainTestToken, account, x1, {
      from:account,
      gasPrice: "10000000000",
    });
  }
  const burnERC20Plasma = async () => {
    const { matic,network } = await getMaticPlasmaClientBurn();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    maticPlasmaBurn.startWithdraw(config.MaticTestToken, x1, {
            from:account,
        }).then((res) => {
            console.log(res.transactionHash) // eslint-disable-line
        })
  }

  const confirmWithdrawERC20Plasma = async () => {
    const { matic,network } = await getMaticPlasmaClient();
    maticPlasma.withdraw(inputvalue, {
      from:account,
    })
    .then((res) => {
      console.log(res.transactionHash); // eslint-disable-line
    })
  }

  const exitERC20Plasma = async () => {
    const { matic,network } = await getMaticPlasmaClient();
    await matic.processExits(config.mainTestToken, { from:account, gas: "7000000" }).then((res) => {
      console.log("Exit hash: ", res.transactionHash);
    });
  }
  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>load on mainenet </div> : ""}
      </p>
    );
  } else {
    content = (
      <div>
        <h1>**POS**</h1>
        <h1>ETHER</h1>

        <button
          onClick={Approve}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Approve
        </button>

        <button
          onClick={DepositEther}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Deposit
        </button>

        <button
          onClick={burnEther}
          disabled={Networkid !== 0 && Networkid === 5 ? true : false}
        >
          burn
        </button>

        <button
          onClick={exitEther}
          disabled={Networkid !== 0 && Networkid === 5 ? false : true}
        >
          exit
        </button>

        <br />
        <p></p>
        <input
          id="inputvalue"
          type="text"
          placeholder="value"
          name="inputvalue"
          value={inputvalue}
          onChange={onchange}
          required
        />
				<p id="burnHash">{burnHash}</p>

        <h1>ERC20</h1>

        <button
          onClick={ApproveERC20}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Approve
        </button>

        <button
          onClick={DepositERC20}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Deposit
        </button>

        <button
          onClick={burnERC20}
          disabled={Networkid !== 0 && Networkid === 5 ? true : false}
        >
          burn
        </button>

        <button
          onClick={exitERC20}
          disabled={Networkid !== 0 && Networkid === 5 ? false : true}
        >
          exit
        </button>

        <br />
        <p></p>
        <input
          id="inputvalue"
          type="text"
          placeholder="value"
          name="inputvalue"
          value={inputvalue}
          onChange={onchange}
          required
        />
				<p id="burnHash">{burnHash}</p>

        <h1>**PLASMA ETHER**</h1>

        <button
          onClick={ApproveEtherPlasma}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Approve
        </button>

        <button
          onClick={depositEtherPlasma}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Deposit
        </button>

        <button
          onClick={burnEtherPlasma}
          disabled={Networkid !== 0 && Networkid === 5 ? true : false}
        >
          burn
        </button>
        <button
          onClick={confirmWithdrawEtherPlasma}
          disabled={Networkid !== 0 && Networkid === 5 ? false : true}
        >
          Confirm Withdraw
        </button>

        <button
          onClick={exitEtherPlasma}
          disabled={Networkid !== 0 && Networkid === 5 ? false : true}
        >
          exit
        </button>

        <br />
        <p></p>
        <input
          id="inputvalue"
          type="text"
          placeholder="value"
          name="inputvalue"
          value={inputvalue}
          onChange={onchange}
          required
        />
				<p id="burnHash">{burnHash}</p>
        <h1>**PLASMA ERC20**</h1>

        <button
          onClick={ApproveEtherPlasma}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Approve
        </button>

        <button
          onClick={depositERC20Plasma}
          disabled={Networkid !== 0 && Networkid === 80001 ? true : false}
        >
          Deposit
        </button>

        <button
          onClick={burnERC20Plasma}
          disabled={Networkid !== 0 && Networkid === 5 ? true : false}
        >
          burn
        </button>
        <button
          onClick={confirmWithdrawERC20Plasma}
          disabled={Networkid !== 0 && Networkid === 5 ? false : true}
        >
          Confirm Withdraw
        </button>

        <button
          onClick={exitERC20Plasma}
          disabled={Networkid !== 0 && Networkid === 5 ? false : true}
        >
          exit
        </button>

        <br />
        <p></p>
        <input
          id="inputvalue"
          type="text"
          placeholder="value"
          name="inputvalue"
          value={inputvalue}
          onChange={onchange}
          required
        />
				<p id="burnHash">{burnHash}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />
      {content}
    </div>
  );
};

export default App;

