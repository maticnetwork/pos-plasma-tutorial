## POS - Plasma Tutorial

run `npm install` to install all the required packages
run `npm start` from root directory to start the react project

### Config

Replace the token addresses in src/config.json with your corresponding token addresses

- posRootERC20 : ERC20 root token address on pos bridge
- posChildERC20 : ERC20 child token address on pos bridge
- posWETH : PoS Weth
- rootChainWETH: WETH deployed on root chain
- plasmaWETH : Plasma WETH
- plasmaRootERC20 : ERC20 root token deployed on plasma
- plasmaChildERC20 : ERC20 child token deployed on plasma
- MATIC_RPC": RPC for child chain,
- "ETHEREUM_RPC": RPC for root chain, 
- "VERSION": network version, 
- "NETWORK": "testnet" or "mainnet"
- "MATIC_CHAINID": Chain ID of child chain, 
- "ETHEREUM_CHAINID": Chain ID of root chain

- The corresponding configuration and key values for matic mainnet and mumbai testnet can be found here 
  https://static.matic.network/network/testnet/mumbai/index.json
  https://static.matic.network/network/mainnet/v1/index.json
