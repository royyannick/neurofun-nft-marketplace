// Using the logic from AAVE to handle multiple chain deployment.
const { ethers } = require("hardhat");
const { TASK_ETHERSCAN_VERIFY } = require("hardhat-deploy");

const networkConfig = {
  4: {
    name: "rinkeby",
    vrfCoodinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: "21719",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000", // 0.01 ETH
    interval: "30",
  },
  5: {
    name: "goerli",
    vrfCoodinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "1555",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000", // 0.01 ETH
    interval: "30",
  },
  31337: {
    name: "hardhat",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: "0",
    callbackGasLimit: "500000",
    mintFee: "10000000000000000", // 0.01 ETH
    interval: "30",
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = { networkConfig, developmentChains }; //, DECIMALS, INITIAL_ANSWER };
