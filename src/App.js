// import React ,{ useEffect, useState } from 'react';
// import './App.css';
// import { getWeb3 } from './utils.js';
// import Navbar from "./Navbar";
// import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
// const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

// function App() {

// 	let content;
// 	const [web3, setWeb3] = useState(undefined);
// 	const [loading, setLoading] = useState(true);
// 	const [loading2, setLoading2] = useState(false);
// 	const [NetworkID, setNetworkID] = useState(0);
// 	const [account, setAccount] = useState("");
// 	const [ERC20, setERC20] = useState({});
// 	const [Maticweb3,setMaticweb3] = useState();
// 	const [Goerliweb3, setGoerliweb3] = useState();
// 	const [MyContractAddress,setMyContractAddress] = useState("");
// 	const [inputValue, setinputValue] = useState("");
// 	const [maticSdk, setMaticSdk] = useState();
// 	const [maticProvider, setmaticProvider] = useState();
// 	const [goerliProvider, setgoerliProvider] = useState();
// 	const [erc20balance, seterc20balance] = useState("");
// 	const goerilDerc20address = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
// 	const maticDerc20address = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic

// 	useEffect(() => {
// 		const init = async () => {
// 				const web3 = await getWeb3();
// 				setWeb3(web3);
// 		}
// 		init();
// }, []);

// const loadBlockchainData = async () => {
// 	setLoading(true);
// 	const maticProvider = new WalletConnectProvider({
// 		host: `https://rpc-mumbai.matic.today`,
// 		callbacks: {
// 			onConnect: console.log("matic connected"),
// 			onDisconnect: console.log("matic disconnected!"),
// 		},
// 	});

// 	const goerillProvider = new WalletConnectProvider({
// 		host: `https://goerli.infura.io/v3/05cee1c13b0e455e929f6e5ef4c7b92a`,
// 		callbacks: {
// 			onConnect: console.log("goeril connected"),
// 			onDisconnect: console.log("goeril disconnected"),
// 		},
// 	});

// 	setmaticProvider(maticProvider);
// 	setgoerliProvider(goerillProvider);

// 	const maticWeb3 = web3(maticProvider);
// 	setMaticweb3(maticWeb3);
// 	const goerilWeb3 = web3(goerillProvider);
// 	setGoerliweb3(goerilWeb3);
// 	const web3 = window.web3;

// 	const accounts = await web3.eth.getAccounts();

// 	setAccount(accounts[0]);
// 	const networkId = await web3.eth.net.getId();

	

// 	setNetworkID(networkId);

// 	if (networkId == 5) {
// 		// const erc20 = new web3.eth.Contract(ERC20abi.abi, goerilDerc20address);
// 		// const name = await erc20.methods.balanceOf(accounts[0]).call();
// 		// const balance = name / 1000000000000000000; // 18 decimals
// 		// console.log(balance);
// 		// seterc20balance(balance);

// 		// setERC20(erc20);
// 		setLoading(false);
// 	} else if (networkId == 80001) {
// 		// const erc20 = new web3.eth.Contract(ERC20abi.abi, maticDerc20address);
// 		// const name = await erc20.methods.balanceOf(accounts[0]).call();
// 		// const balance = name / 1000000000000000000; // 18 decimals
// 		// console.log(balance);
// 		// seterc20balance(balance);
// 		setLoading(false);
// 	} else {
// 		window.alert(" contract not deployed to detected network.");
// 		setLoading2(true);
// 	}
// };

// const posclient = () => {
// 	const maticPOSClient = new MaticPOSClient({
// 		network: "testnet",
// 		version: "mumbai",
// 		maticProvider: window.web3,
// 		parentProvider: window.web3,
// 		POSRootChainManager: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74",
// 		posERC20Predicate: "0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34",
// 		posERC721Predicate: "0x74D83801586E9D3C4dc45FfCD30B54eA9C88cf9b",
// 		posERC1155Predicate: "0xB19a86ba1b50f0A395BfdC3557608789ee184dC8",
// 		posEtherPredicate: "0xe2B01f3978c03D6DdA5aE36b2f3Ac0d66C54a6D5",
// 		parentDefaultOptions: { from: account },
// 		maticDefaultOptions: { from: account },
// 	});
// 	return maticPOSClient;
// };
// const Approve = async () => {
// 	const maticPOSClient = posclient();
// 	const x = inputValue * 1000000000000000000; // 18 decimals
// 	const x1 = x.toString();
// 	await maticPOSClient.approveERC20ForDeposit(goerilDerc20address, x1, {
// 		from: account,
// 	});
// };

// const Deposit = async () => {
// 	const maticPOSClient = posclient();

// 	const x = inputValue * 1000000000000000000; // 18 decimals
// 	const x1 = x.toString();

// 	await maticPOSClient.depositERC20ForUser(goerilDerc20address, account, x1, {
// 		from: account,
// 	});
// };

// const burn = async () => {
// 	const maticPOSClient = posclient();
// 	const x = inputValue * 1000000000000000000;
// 	const x1 = x.toString();
// 	await maticPOSClient.burnERC20(maticDerc20address, x1, {
// 		from: account,
// 	});
// };

// const exit = async () => {
// 	const maticPOSClient = posclient();
// 	await maticPOSClient.exitERC20(inputValue, {
// 		from: account,
// 	});
// };
// const onchange = (e) => {
// 	setinputValue(e.target.value);
// };

// if (loading === false) {
// 	content = (
// 		<p className="text-center">
// 			Loading...{loading2 ? <div>load on mainenet </div> : ""}
// 		</p>
// 	);
// } else {
// 	content = (
// 		<div class="container">
// 			<h1>
// 				your ERC20 balance : <b>{erc20balance} </b>
// 			</h1>
// 			<button
// 				class="btn-primary"
// 				onClick={Approve}
// 				disabled={NetworkID != 0 && NetworkID == 80001 ? true : false}
// 			>
// 				Approve
// 			</button>

// 			<button
// 				class="btn-primary"
// 				onClick={Deposit}
// 				disabled={NetworkID != 0 && NetworkID == 80001 ? true : false}
// 			>
// 				Deposit
// 			</button>

// 			<button
// 				class="btn-primary"
// 				onClick={burn}
// 				disabled={NetworkID != 0 && NetworkID == 5 ? true : false}
// 			>
// 				burn
// 			</button>

// 			<button
// 				class="btn-primary"
// 				onClick={exit}
// 				disabled={NetworkID != 0 && NetworkID == 5 ? true : false}
// 			>
// 				exit
// 			</button>

// 			<br />
// 			<p></p>
// 			<input
// 				id="inputvalue"
// 				type="text"
// 				className="form-control"
// 				placeholder="value"
// 				name="inputvalue"
// 				value={inputValue}
// 				onChange={onchange}
// 				required
// 			/>
// 		</div>
// 	);
// }
// 	return (
// 		<div className="App">
// 			<Navbar account = {account} />
// 			{content}
// 		</div>
// 	);
// }

// export default App;

import React, { useEffect, useState } from "react";
import ERC20abi from "./contracts/Token.json";
import Web3 from "web3";
import Navbar from "./Navbar";
// import TestImport from "./testimport.js";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const Network = require("@maticnetwork/meta/network");
const Matic = require("@maticnetwork/maticjs");
console.log("MATIC",Matic);
// const maticUtils = require('./maticUtils');
const App = () => {
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
    // TestImport.x(89);
    //esl
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

    const goerilDerc20address = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    const maticDerc20address = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic

    setNetworkid(networkId);

    if (networkId === 5) {
      const erc20 = new web3.eth.Contract(ERC20abi.abi, goerilDerc20address);
      const name = await erc20.methods.balanceOf(accounts[0]).call();
      const balance = name / 1000000000000000000; // 18 decimals
      console.log(balance);
      seterc20balance(balance);

      setERC20(erc20);
      setLoading(false);
    } else if (networkId === 80001) {
      const erc20 = new web3.eth.Contract(ERC20abi.abi, maticDerc20address);
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

  const getMaticPlasmaClient = async (_network = "testnet", _version = "mumbai") => {
    const network = new Network(_network, _version);
    // const { from } = getAccount();
    const matic = new Matic({
    network: _network,
    version: _version,
    parentProvider: window.web3,
    maticProvider: maticprovider,
    parentDefaultOptions: { from:account },
    maticDefaultOptions: { from:account },


    });
    console.log("matic1",matic);
    await matic.initialize();
    // await matic.depositEther("1.9",{
    //   from: account
    // })
    return { matic, network };
  };

  const Approve = async () => {
		const maticPOSClient = posclientGeneral();
		const goerliDerc20address = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    const maticDerc20address = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic

    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await maticPOSClient.approveERC20ForDeposit(goerliDerc20address, x1, {
      from: account,
    });
  };

  const DepositEther = async () => {
    const maticPOSClient = posclientGeneral();
		let g = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    let m = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic
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
		let g = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    let m = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic
    const maticWETH="0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323";
    await maticPOSClient.burnERC20(maticWETH, x1, {
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

  const ApproveERC20 = async () => {
		const maticPOSClient = posclientGeneral();
		const goerliDerc20address = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    const maticDerc20address = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic

    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    await maticPOSClient.approveERC20ForDeposit(goerliDerc20address, x1, {
      from: account,
    });
  };

  const DepositERC20 = async () => {
    const maticPOSClient = posclientGeneral();
		let g = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    let m = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();

    await maticPOSClient.depositERC20ForUser(g,account, x1, {
      from: account,
    });
  };

  const burnERC20 = async () => {
    const maticPOSClient = posclientBurn();
    const x = inputvalue * 1000000000000000000;
		const x1 = x.toString();
		let g = "0x655F2166b0709cd575202630952D71E2bB0d61Af"; // Derc 20 token addres deployed on  goeril
    let m = "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1"; // Derc20 token address deployed on matic
    const maticWETH="0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323";
    await maticPOSClient.burnERC20(m, x1, {
      from: account,
    }).then((res) => {
			console.log(res.transactionHash);
			setburnHash(res.transactionHash);
		})
  };

  const exitERC20 = async () => {
    const maticPOSClient = posclientGeneral();
    await maticPOSClient.exitERC20(inputvalue, {
      from: account,
    }).then((res) => {
      console.log("exit o/p",res);
    })
  };
  const onchange = (e) => {
    setinputvalue(e.target.value);
  };

  const depositEtherPlasma = async () => {
    // const { maticPlasma,network } = await maticUtils.getMaticClient();
    const { matic,network } = await getMaticPlasmaClient();
    const x = inputvalue * 1000000000000000000; // 18 decimals
    const x1 = x.toString();
    console.log("maticPlasma",matic);
    await matic.depositEther(x1,{
      from: account
    }).catch(err => {
      console.log(err);

    })
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
        <h1>
          your ERC20 balance : <b>{erc20balance} </b>
        </h1>
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
        <h1>
          your ERC20 balance : <b>{erc20balance} </b>
        </h1>
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
          disabled={Networkid !== 0 && Networkid === 5 ? true : false}
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

        <h1>**PLASMA**</h1>
        <h1>
          your ERC20 balance : <b>{erc20balance} </b>
        </h1>
        <button
          onClick={Approve}
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

