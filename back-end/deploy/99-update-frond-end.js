const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

const frontEndContractsFile = "../front-end/constants/networkMapping.json";
const frontEndAbiFile = "../front-end/constants/";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front-end...");
    await updateContractAddress();
    await updateAbi();
  }
};

async function updateAbi() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  fs.writeFileSync(
    `${frontEndAbiFile}NftMarketplace.json`,
    nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
  );

  const nftRngIpfs = await ethers.getContract("NftRngIpfs");
  fs.writeFileSync(
    `${frontEndAbiFile}NftRngIpfs.json`,
    nftRngIpfs.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddress() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const nftRngIpfs = await ethers.getContract("NftRngIpfs");
  const chainId = network.config.chainId.toString();

  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftMarketplace"].includes(
        nftMarketplace.address
      )
    ) {
      contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
    }
  } else {
    contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] };
  }

  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["NftRngIpfs"].includes(nftRngIpfs.address)
    ) {
      contractAddresses[chainId]["NftRngIpfs"].push(nftRngIpfs.address);
    }
  } else {
    contractAddresses[chainId] = { NftRngIpfs: [nftRngIpfs.address] };
  }

  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
