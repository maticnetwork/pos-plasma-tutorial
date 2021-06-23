import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Alert from '@material-ui/lab/Alert';
import { CircularProgress, Typography, Switch } from "@material-ui/core";

import Web3 from "web3";
import MetaNetwork from "@maticnetwork/meta/network";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";

import Navbar from "./components/Navbar";
import Instructions from "./components/Instructions";
import config from "./utils/config.json";
import { useWeb3Context } from './contexts/Web3Context';
import { posClientParent, getMaticPlasmaParent } from "./utils/Matic";


const App = () => {
  const classes = useStyles();
  const { account, providerChainId, inj_provider, connectWeb3 } = useWeb3Context();

  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isPlasma, setIsPlasma] = useState(false);
  const [maticProvider, setMaticProvider] = useState();
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [errLink, setErrLink] = useState(false);

  useEffect(() => {
    if (!account) {
      connectWeb3();
    }
  }, [account, connectWeb3])

  useEffect(() => {
    const setProvider = async () => {
      setLoading(true);
      // matic provider set
      const maticProvider = await new WalletConnectProvider({
        host: config.MATIC_RPC,
        callbacks: {
          onConnect: console.log("matic connected"),
          onDisconnect: console.log("matic disconnected!"),
        },
      });
      setMaticProvider(maticProvider);
      setLoading(false);
    }
    setProvider();
  }, [])

  const getProof = async (type) => {
    try {
      const base_url = 'https://apis.matic.network/api/v1/matic/exit-payload';
      const posSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
      const plasmaSignature = '0xebff2602b3f468259e1e99f613fed6691f3a6526effe6ef3e768ba7ae7a36c4f';
      const url = `${base_url}/${inputValue}?eventSignature=${type === 'pos' ? posSignature : plasmaSignature}`
      let { data } = await axios.get(url);
      console.log(data);
      if (data.result) {
        return data.result;
      }
      return null;
    } catch (error) {
      console.error("Proof not found.");
      return null;
    }
  }


  // POS ERC20 exit function
  const exitERC20 = async () => {
    setError('');
    setHash('');
    setErrLink(false);
    try {
      setLoading(true);
      const proof = await getProof('pos');

      const maticPoSClient = await posClientParent(maticProvider, account, inj_provider);
      const isDone = await maticPoSClient.isERC20ExitProcessed(inputValue);
      console.log(isDone);
      if (isDone) {
        setLoading(false);
        console.log("EXIT ALREADY PROCESSED");
        setError('Withdraw process completed already.');
        return;
      } else if (proof) {
        const network = new MetaNetwork('mainnet', 'v1');
        const parentProvider = inj_provider;
        const parentWeb3 = new Web3(parentProvider)
        const rootChainManagerAbi = network.abi('RootChainManager', 'pos',)
        const rootChainManagerAddress = network.Main.POSContracts.RootChainManagerProxy
        const rootChainManagerContract = new parentWeb3.eth.Contract(
          rootChainManagerAbi,
          rootChainManagerAddress,
        )
        await rootChainManagerContract.methods.exit(proof).send({
          from: account,
        }).then((res) => {
          console.log("Exit transaction hash: ", res);
          setHash(res.transactionHash);
          setLoading(false);
        });
      }
      else {
        await maticPoSClient.exitERC20(inputValue, {
          from: account,
        }).then((res) => {
          console.log("Exit transaction hash: ", res);
          setHash(res.transactionHash);
          setLoading(false);
        });
      }
    } catch (e) {
      setLoading(false);
      if (e.message.substr(0, 28) === `Returned values aren't valid`)
        setError('Seems like you are not on Ethereum Network, change the network and refresh the page.')
      else if (e.message === `Cannot read property 'blockNumber' of null`)
        setError('Incorrect burn transaction hash')
      else if (e.message === `txHash not provided`)
        setError('Please input the transaction hash.')
      else if (e.message.substr(0, 32) === `Returned error: invalid argument`)
        setError('Incorrect burn transaction hash')
      else if (e.message.substr(0, 49) === `Burn transaction has not been checkpointed as yet`)
        setError('Burn transaction has not been checkpointed yet. Please wait for 1-3hrs.')
      else if (e.message.substr(0, 53) === `Invalid parameters: must provide an Ethereum address.`)
        setError('Please refresh the page and try again.')
      else if (e.message === `Log not found in receipt`)
        setErrLink(true);
      else if (e.message === 'Invalid response')
        setError('Please try again after some time.');
      else setError(e.message.substr(0, 80));
      console.error(e);
    }
  };

  // Plasma MATIC withdraw function
  const withdrawPlasmaERC20 = async () => {
    setError('');
    setHash('');
    setErrLink(false);
    try {
      setLoading(true);
      const proof = await getProof('plasma');
      if (proof) {
        const network = new MetaNetwork('mainnet', 'v1');
        const parentProvider = inj_provider;
        const parentWeb3 = new Web3(parentProvider)
        const erc20PredicateAbi = network.abi('ERC20PredicateBurnOnly')
        const erc20PredicateAddress = network.Main.Contracts.ERC20Predicate
        const erc20PredicateContract = new parentWeb3.eth.Contract(
          erc20PredicateAbi,
          erc20PredicateAddress,
        )
        await erc20PredicateContract.methods.startExitWithBurntTokens(proof).send({
          from: account,
        }).then((res) => {
          console.log("Exit transaction hash: ", res);
          setHash(res.transactionHash);
          setLoading(false);
        });
      } else {
        const maticPlasmaClient = await getMaticPlasmaParent(maticProvider, account, inj_provider);
        await maticPlasmaClient.withdraw(inputValue, {
          from: account,
          onTransactionHash: async () => {
            // api call here
            let res = await axios.post("https://airdrop-api.matic.network/plasma-withdraw-notification", {
              "address": account,
              "burnTransactionHash": inputValue,
              "toSendInToken": 0,
              "symbol": "PLASMA_WITHDRAW"
            });
            console.log(res.data);
          }
        }).then((res) => {
          console.log("Exit transaction hash: ", res);
          setHash(res.transactionHash);
          setLoading(false);
        });
      }
    } catch (e) {
      setLoading(false);
      if (e.message.substr(0, 28) === `Returned values aren't valid`)
        setError('Seems like you are not on Ethereum Network, change the network and refresh the page.')
      else if (e.message === `Cannot read property 'blockNumber' of null`)
        setError('Incorrect burn transaction hash')
      else if (e.message === `txHash not provided`)
        setError('Please input the transaction hash.')
      else if (e.message.substr(0, 32) === `Returned error: invalid argument`)
        setError('Incorrect burn transaction hash')
      else if (e.message.substr(0, 49) === `Burn transaction has not been checkpointed as yet`)
        setError('Burn transaction has not been checkpointed yet. Please wait for 1-3hrs.')
      else if (e.message.substr(0, 53) === `Invalid parameters: must provide an Ethereum address.`)
        setError('Please refresh the page and try again.')
      else if (e.message === `Log not found in receipt`)
        setErrLink(true);
      else if (e.message === 'Invalid response')
        setError('Please try again after some time.');
      else setError(e.message.substr(0, 80));
      console.error(e);
    }
  };

  return (
    <React.Fragment>
      {/* Navbar */}
      <Navbar />

      {/* Top Intro section */}
      <div className={classes.inro}>
        <Typography variant="h1" className={classes.title}>
          Polygon Withdraw
        </Typography>

        <Typography variant="h1" className={classes.text}>
          Paste the transaction hash of your burn transaction on Polygon and click on Complete Withdraw.<br />
          If you cannot find your burn transaction, please find it <a target="_blank" style={{ textDecoration: 'underline' }}
            href={`https://polygonscan.com/address/${account}#tokentxns`} rel="noreferrer">here</a>. Also, read the instructions given below carefully.
        </Typography>
      </div>

      {/* Input section */}
      <section className={classes.body}>
        <div className={classes.input}>
          <input type="text" placeholder="0xaa30bf8f73dfdaa..." name="inputValue"
            value={inputValue} onChange={(e) => setInputValue(e.target.value)} required
          />
        </div>

        <div style={{ display: 'flex', maxWidth: 150, margin: '0 auto 20px auto', alignContent: 'center' }}>
          <p>POS</p>
          <Switch
            checked={isPlasma}
            onChange={(e) => setIsPlasma(e.target.checked)}
            color="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <p>Plasma</p>
        </div>

        <button className={classes.btn} onClick={isPlasma ? withdrawPlasmaERC20 : exitERC20}
          disabled={providerChainId === config.ETHEREUM_CHAINID && !loading && account ? false : true}>
          {loading && <CircularProgress size={24} style={{ margin: 'auto', marginRight: 15 }} />}
          {loading ? 'checking...' : 'Complete Withdraw'}
        </button>
        {hash &&
          <Alert severity="success">
            Exit transaction hash: <a target="blank" href={`https://etherscan.io/tx/${hash}`} rel="noreferrer">{hash}</a>
          </Alert>
        }
        {error &&
          <Alert severity="error">
            {error}
          </Alert>
        }
        {errLink &&
          <Alert severity="error">
            Please reach out to <a target="blank" style={{ color: '#0d6efd', textDecoration: 'underline' }}
              href="https://wallet-support.matic.network/portal/en/home" rel="noreferrer">support team</a> {' '}.
          </Alert>
        }
        {providerChainId && providerChainId !== config.ETHEREUM_CHAINID &&
          <Alert severity="error">
            Seems like you are not on Ethereum network, change the network and refresh the page.
          </Alert>
        }
      </section>

      {/* Instructions */}
      <Instructions />

    </React.Fragment>
  );
};

export default App;

const useStyles = makeStyles(() => ({
  btn: {
    height: "44px",
    lineHeight: "44px",
    padding: "0 20px",
    borderRadius: "4px",
    display: "inline-flex",
    textTransform: "capitalize",
    fontWeight: "600",
    fontSize: 16,
    position: "relative",
    backgroundColor: "#061024",
    color: "white",
    cursor: 'pointer',
    marginBottom: 20,

    "&:disabled": {
      backgroundColor: "#bdc3c7",
      borderColor: "#bdc3c7",
      color: "white",
      border: 'none',
      cursor: 'default'
    },
  },
  inro: {
    height: 200,
    backgroundColor: '#854CE6',
    textAlign: 'center',
    padding: '35px 0',
    "@media (max-width:700px)": {
      height: 250,
    },
  },
  title: {
    marginBottom: 20,
    fontSize: 36,
    fontWeight: 800,
    color: '#FFFFFF',
    "@media (max-width:700px)": {
      fontSize: 25,
    },
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
    color: "#FFFFFF",
  },
  body: {
    position: 'relative',
    textAlign: 'center',
    maxWidth: 852,
    margin: 'auto'
  },
  input: {
    maxWidth: 500,
    position: 'relative',
    top: -30,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: "white",
    border: '1px solid #DCDFE6',
    padding: '18px 15px',
    boxSizing: 'border-box',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
    borderRadius: 8,

    "& input": {
      background: "transparent",
      fontSize: "16px",
      fontWeight: "600",
      color: "black",
      display: "block",
      border: 0,
      outline: "none",
      padding: 0,
      width: '100%',
    },
  },
  instructions: {
    maxWidth: 852,
    margin: '30px auto',
    padding: 32,
    background: '#EFE7FD',
    border: '1px solid #E0CFFC',
    boxSizing: 'border-box',
    borderRadius: 8
  },
  topic: {
    fontSize: 18,
    color: '#601FCD',
    fontWeight: 800,
    marginBottom: 16
  },
  subTopic: {
    fontSize: 16,
    color: '#061024',
    fontWeight: 400
  }
}));

