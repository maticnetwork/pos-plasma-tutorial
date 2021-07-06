import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useWeb3Context } from '../contexts/Web3Context';

const Instructions = () => {
  const classes = useStyles();
  const { account } = useWeb3Context();

  return (
    <React.Fragment>
      <section className={classes.instructions}>
        <Typography variant="h1" className={classes.topic}>
          What it does?
        </Typography>
        <Typography variant="h1" className={classes.subTopic}>
          You can use this interface to complete your withdraw process which you started on Polygon Wallet.
          In case you have initiated your withdraw on the Polygon chain and you are not able to complete the final step of withdraw on
          Ethereum, then you can use this interface.
          <br />
          <br />
          To find your burn transaction hash go to {'→'} <a target="_blank" style={{ color: '#0d6efd', textDecoration: 'underline' }}
            href={`https://polygonscan.com/address/${account}#tokentxns`} rel="noreferrer">this link</a>
          {' '} and look for the transaction with which you initiated the first step of withdraw process on Polygon chain.
        </Typography>
      </section>

      <section className={classes.instructions}>
        <Typography variant="h1" className={classes.topic}>
          Instructions
        </Typography>
        <ul style={{ textAlign: 'left' }} className={classes.subTopic}>
          <li>You can complete the withdraw process for all ERC20 tokens using this interface.</li>
          <li><b>In the case of Plasma tokens, once you complete the transaction, the 7 day challenge period will begin and you can complete the Final Withdraw step from the Polygon Wallet</b>.</li>
          <li>This application can be only used from MetaMask wallet and Wallet Connect.</li>
          <li>Ensure that you are on Ethereum Network before going ahead with the steps below.</li>

          <li>In the input box, paste the transaction hash of the transaction you did on Polygon chain to initiate the withdraw.</li>
          <li>Click on Complete Withdraw and wait for the Transaction sigining interface to popup.</li>
          <li>Now, confirm the transaction. It is recommended not to lower the gas fees or the gas limit.</li>
          <li>Once the transaction gets completed, you will see a link to the transaction details on Ethereum Network. Do not refresh the screen.</li>
          <li>Thats it. Your tokens will be safely withdrawn to your account on Ethereum Network.</li>
          <li>In case of any issues, please raise a ticket <a target="_blank" style={{ color: '#0d6efd', textDecoration: 'underline' }}
            href={`https://wallet-support.matic.network/portal/en/home`} rel="noreferrer">here</a>.</li>
        </ul>
      </section>
    </React.Fragment>
  )
}

export default Instructions;

const useStyles = makeStyles(() => ({
  instructions: {
    maxWidth: 852,
    margin: '30px auto',
    padding: 32,
    background: '#EFE7FD',
    border: '1px solid #E0CFFC',
    boxSizing: 'border-box',
    borderRadius: 8,
    "@media (max-width:599px)": {
      padding: 20,
      margin: 10
    },
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
