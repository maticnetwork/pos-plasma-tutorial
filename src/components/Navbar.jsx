import React from "react";
import { NavLink } from "react-router-dom";

// material ui
import { AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// components
import ConnectWallet from "./ConnectWallet";

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <div className={classes.flexContainer}>
        <div style={{ display: 'flex', margin: 'auto' }}>
          <NavLink to="/" style={{ display: "flex", margin: 'auto' }}>
            <img src="logo.svg" alt="logo" className={classes.logo} />
          </NavLink>
          <h3 className={classes.headline}>Withdraw</h3>
        </div>

        <div style={{ display: 'flex', margin: 'auto' }}>
          <a href="https://wallet.polygon.technology/" target="blank"
            className={classes.link}>Go to Polygon Wallet</a>
          <ConnectWallet />
        </div>
      </div>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  nav: {
    color: 'black',
    boxShadow: "none",
    background: 'inherit',
    borderBottom: "0.5px solid",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "30px",
    margin: 'auto',
    marginRight: 20
  },
  headline: {
    fontWeight: 400,
    fontSize: 20,
    color: '#3B465C'
  },
  link: {
    margin: 'auto',
    marginRight: 15,
    color: '#3828E0',
    fontSize: 16,
    "@media (max-width:599px)": {
      display: 'none',
    },
  }
}));

export default Navbar;