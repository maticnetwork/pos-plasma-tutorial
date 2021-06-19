import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "./components/Navbar";
import { CircularProgress, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { useWeb3Context } from './contexts/Web3Context';
import config from "./utils/config.json";

import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
const MaticPoSClient = require("@maticnetwork/maticjs").MaticPOSClient;

const App = () => {
  const classes = useStyles();

  const { account, providerChainId } = useWeb3Context();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [maticProvider, setMaticProvider] = useState();
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const setProvider = async () => {
      // matic provider set
      const maticProvider = await new WalletConnectProvider({
        host: config.MATIC_RPC,
        callbacks: {
          onConnect: console.log("matic connected"),
          onDisconnect: console.log("matic disconnected!"),
        },
      });
      setMaticProvider(maticProvider);
    }
    setProvider();
  }, [])

  // posClientGeneral facilitates the operations like approve, deposit, exit
  const posClientParent = () => {
    const maticPoSClient = new MaticPoSClient({
      network: config.NETWORK,
      version: config.VERSION,
      maticProvider: maticProvider,
      parentProvider: window.web3,
      parentDefaultOptions: { from: account },
      maticDefaultOptions: { from: account },
    });
    return maticPoSClient;
  };
  // POS ERC20 exit function
  const exitERC20 = async () => {
    setError('');
    setHash('');
    try {
      setLoading(true);
      const maticPoSClient = posClientParent();
      const isDone = await maticPoSClient.isERC20ExitProcessed(inputValue);
      console.log(isDone);
      if (isDone) {
        setLoading(false);
        console.log("EXIT ALREADY PROCESSED");
        setError('Withdraw process completed already.');
        return;
      }
      await maticPoSClient
        .exitERC20(inputValue, {
          from: account,
        })
        .then((res) => {
          console.log("Exit transaction hash: ", res);
          setHash(res.transactionHash);
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      if (e.message.substr(0, 28) === `Returned values aren't valid`)
        setError('Seems like you are not on Eth Network, change the network and refresh the page.')

      else if (e.message === `Cannot read property 'blockNumber' of null`)
        setError('Incorrect burn transaction hash')

      else if (e.message.substr(0, 32) === `Returned error: invalid argument`)
        setError('Incorrect burn transaction hash')

      else if (e.message.substr(0, 49) === `Burn transaction has not been checkpointed as yet`)
        setError('Burn transaction has not been checkpointed yet. Please wait for 1-3hrs.')

      else if (e.message.substr(0, 53) === `Invalid parameters: must provide an Ethereum address.`)
        setError('Please refresh the page and try again.')

      else if (e.message === `Log not found in receipt`)
        setError('Please reach out to support team here and mention this error in your ticket.')

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
          Submit your transaction hash
        </Typography>

        <Typography variant="h1" className={classes.text}>
          ➡    first step of your withdraw process on Polygon chain    ⬅
        </Typography>
      </div>

      {/* Input section */}
      <section className={classes.body}>
        <div className={classes.input}>
          <input type="text" placeholder="0xaa30bf8f73dfdaa..." name="inputValue"
            value={inputValue} onChange={(e) => setInputValue(e.target.value)} required
          />
        </div>
        {loading ?
          <CircularProgress />
          :
          <button className={classes.btn} onClick={exitERC20}
            disabled={providerChainId === config.ETHEREUM_CHAINID ? false : true}>
            Complete Withdraw
          </button>
        }
        {hash &&
          <Alert severity="success">This is a success alert — check it out!
            Exit transaction hash: <a target="_blank" href={`https://etherscan.io/tx/${hash}`} rel="noreferrer">{hash}</a>
          </Alert>
        }
        {error &&
          <Alert severity="error">
            {error}
          </Alert>
        }
        {providerChainId !== config.ETHEREUM_CHAINID &&
          <Alert severity="error">This is an error alert — check it out!
            Seems like you are not on Eth Network, change the network and refresh the page.
          </Alert>
        }
      </section>

      {/* Instructions */}
      <section className={classes.instructions}>
        <Typography variant="h1" className={classes.topic}>
          What it does?
        </Typography>
        <Typography variant="h1" className={classes.subTopic}>
          Using this application is a very simple interface that will allow you to complete your withdraw process which you started on Polygon Network.
          In case you have initiated your withdraw on the Polygon chain and you are not able to complete the final step of withdraw on
          Ethereum, then you can use this interface.
          <br />
          <br />
          To find your burn hash go to {'→'} <a target="_blank" style={{ color: '#0d6efd', textDecoration: 'underline' }}
            href={`https://polygonscan.com/address/${account}#tokentxns`} rel="noreferrer">this link</a>
          {' '} and look for the transaction with which you initiated the first step of withdraw process on Polygon chain.
        </Typography>
      </section>

      <section className={classes.instructions}>
        <Typography variant="h1" className={classes.topic}>
          Instructions
        </Typography>
        <ul style={{ textAlign: 'left' }} className={classes.subTopic}>
          <li>This application can be only used by MetaMask broswer extenstion.</li>
          <li>This application can be used to withdraw all ERC20 tokens except MATIC.</li>
          <li>Ensure that you are on Ethereum Network before going ahead with the steps below.</li>

          <li>Paste the transaction hash of that transaction in the input box.</li>
          <li>Click on Complete Withdraw and wait for the Metamask to popup.</li>
          <li>Confirm the transaction. Its reccomended not to lower the gas fees or the gas limit.</li>
          <li>Once the transaction gets completed, you will see a link to the transaction details on Ethereum. Do not refresh the screen.</li>
          <li>Thats it. Your tokens will be safely withdrawn to your account on Ethereum.</li>
        </ul>
      </section>

    </React.Fragment>
  );
};

export default App;

const useStyles = makeStyles((theme) => ({
  btn: {
    height: "44px",
    lineHeight: "44px",
    padding: "0 20px",
    border: "1px solid #8247E5",
    borderRadius: "4px",
    display: "inline-flex",
    textTransform: "capitalize",
    fontWeight: "600",
    fontSize: 16,
    position: "relative",
    backgroundColor: "#061024",
    color: "white",
    cursor: 'pointer',
    marginBottom: 20
  },
  inro: {
    height: 200,
    backgroundColor: '#854CE6',
    textAlign: 'center',
    padding: '35px 0'
  },
  title: {
    marginBottom: 20,
    fontSize: 36,
    fontWeight: 800,
    color: '#FFFFFF',
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

