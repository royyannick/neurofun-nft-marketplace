// Author: Yannick Roy
// Date: Sept. 2022
// Description: Pet project to learn more avout NTFs and building an
//              NFT Marketplace using a random number generator, IPFS storage
//              and decentralized indexer such as The Graph.

const { ethers, network } = require('hardhat')
const { moveBlocks } = require('../utils/move-blocks')

const TOKEN_ID = 1

async function buyItem() {
    const nftMarketplace = await ethers.getContract('NftMarketplace')
    const basicNft = await ethers.getContract('BasicNFT')
    const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
    const price = listing.price.toString()
    const tx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
        value: price,
    })
    await tx.wait(1)
    console.log('NFT Bought!')
    if ((network.config.chainId = '31337')) {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

buyItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
