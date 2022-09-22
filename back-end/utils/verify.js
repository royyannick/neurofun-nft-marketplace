// Author: Yannick Roy
// Date: Sept. 2022
// Description: Pet project to learn more avout NTFs and building an
//              NFT Marketplace using a random number generator, IPFS storage
//              and decentralized indexer such as The Graph.

// we can't have these functions in our `helper-hardhat-config`
// since these use the hardhat library
// and it would be a circular dependency
const { run } = require('hardhat')

const verify = async (contractAddress, args) => {
    console.log('Verifying contract...')
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('Already verified!')
        } else {
            console.log(e)
        }
    }
    console.log('Contract verified!')
}

module.exports = {
    verify,
}
