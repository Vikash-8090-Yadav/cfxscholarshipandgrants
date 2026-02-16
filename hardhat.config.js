require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    confluxEspaceTestnet: {
      url: process.env.CONFLUX_ESPACE_RPC_URL || "https://evmtestnet.confluxrpc.com",
      chainId: parseInt(process.env.CONFLUX_ESPACE_CHAIN_ID || "71", 10),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    confluxEspaceMainnet: {
      url: process.env.CONFLUX_ESPACE_MAINNET_RPC_URL || "https://evm.confluxrpc.com",
      chainId: parseInt(process.env.CONFLUX_ESPACE_MAINNET_CHAIN_ID || "1030", 10),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};



