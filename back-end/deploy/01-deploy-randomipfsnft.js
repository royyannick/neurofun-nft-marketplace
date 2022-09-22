const { network, ethers } = require("hardhat");
const { TASK_ETHERSCAN_VERIFY } = require("hardhat-deploy");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");

const imagesLocation = "./NFTs-Images/";

const metaDataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Invasiveness",
      value: 0,
    },
  ],
};

const NFTs = [
  {
    name: "DBS",
    description: "Deep Brain Stimulation",
    rareness: 5,
    invasiness: 10,
  },
  {
    name: "TMS",
    description: "Transcranial Magnetic Stimulation",
    rareness: 20,
    invasiness: 3,
  },
  {
    name: "tDCS",
    description: "Transcranial Direct Current Stimulation",
    rareness: 30,
    invasiness: 2,
  },
  {
    name: "EEG",
    description: "Electroencephalography",
    rareness: 45,
    invasiness: 1,
  },
];

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoodinatorV2Address, subscriptionId;

  let neuroTokenUris;
  if (process.env.PINATA_UPLOAD_TO == "true") {
    neuroTokenUris = await handleTokenURIs();
  } else {
    neuroTokenUris = [
      "ipfs://QmWDsYNDfddYMeQUjGk9wh9j2ndpKGjai9pX9ZHKmPrqRq",
      "ipfs://QmPFJo4NBcRqDvLAndNbgdxLSXmvan9e7yPtWhvsc2U9et",
      "ipfs://QmdcnbNvcxpsWgLN1ywYtT7L2XowjzbXLzVXsy2GTbLMui",
      "ipfs://QmYZFLviu8k7UYNWWX9G1apk1gWK7F3BXvzCTSL72UJ62c",
    ];
  }

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoodinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoodinatorV2Address = networkConfig[chainId].vrfCoodinatorV2;
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const args = [
    vrfCoodinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    neuroTokenUris,
    networkConfig[chainId].mintFee,
  ];
  log("Deploying...");
  log("--------- args ----------");
  log(args);
  log("--------- /args ----------");
  const rin = await deploy("NftRngIpfs", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmation: network.config.blockConfirmations || 1,
  });
  log("Deployed!");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(rin.address, args);
  }

  console.log("------------- Done! -------------------");
};

async function handleTokenURIs() {
  tokenURIs = [];

  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocation
  );
  console.log(files);

  for (imageUploadResponseIndex in imageUploadResponses) {
    // Metadata info.
    let tokenUriMetadata = { ...metaDataTemplate };
    let curNFT;
    for (ntfIdx in NFTs) {
      if (
        NFTs[ntfIdx].name.toLowerCase() ==
        files[imageUploadResponseIndex].replace(".png", "").toLowerCase()
      )
        curNFT = NFTs[ntfIdx];
    }
    if (curNFT) {
      tokenUriMetadata.name = curNFT.name;
      tokenUriMetadata.description = curNFT.description;
      tokenUriMetadata.attributes[0].value = curNFT.invasiness;
      tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
      console.log(`Uploading ${tokenUriMetadata.name}...`);
      // store the JSON on Pinata.
      const metadataUploadResponse = await storeTokenUriMetadata(
        tokenUriMetadata
      );

      tokenURIs.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    } else {
      console.log(
        `Skipping ${files[imageUploadResponseIndex]}: Unrecognized NFT.`
      );
    }
  }
  console.log("Token URIs Uploaded! Here they are: ");
  console.log(tokenURIs);

  return tokenURIs;
}

module.exports.tags = ["all", "ipfs", "main"];
