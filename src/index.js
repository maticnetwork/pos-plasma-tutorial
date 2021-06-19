import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import { Web3Provider } from "./contexts/Web3Context";
import App from "./App";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Web3Provider>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3Provider>
  </ThemeProvider>,
  document.querySelector("#root")
);
