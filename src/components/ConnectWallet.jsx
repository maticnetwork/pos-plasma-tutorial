import React from "react";
import { useWeb3Context } from '../contexts/Web3Context';
import { makeStyles } from '@material-ui/core/styles';

const truncateAddress = (address) => {
  return address.slice(0, 5) + "..." + address.slice(-4);
};

const ConnectWallet = () => {
  const classes = useStyles();
  const { connectWeb3, disconnect, account } = useWeb3Context();
  
  return (
    <button
      className={classes.walletBtn}
      onClick={account ? disconnect : connectWeb3}>
      <div>
        {account ? truncateAddress(account) : "Connect Wallet"}
      </div>
    </button>
  );
}

const useStyles = makeStyles(() => ({
  walletBtn: {
    background: '#e3e3e3',
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    borderRadius: 12,
    height: '36px',
    lineHeight: '36px',
    padding: '0 10px 0 10px',
    display: 'flex',
    alignItems:  'center',

    "@media (max-width:599px)": {
      padding: 0,
    },

    '&:hover': {
      backgroundColor: '#000', 
      color: 'white',
    },

    '& div':{
      "@media (max-width:599px)": {
        margin:0,
        display:'none'
      },
    }
  }
}));

export default ConnectWallet;