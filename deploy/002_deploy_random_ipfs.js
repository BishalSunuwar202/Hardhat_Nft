const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeImages } = require("../utils/uploadToPinata")
const { verify } = require("../utils/verify")

const imagesLocation = "./images/random"


module.exports = async function ({ getNamedAccouts, deployments }) {
    const { deployments, logs } = deployments
    const { deployer } = await getNamedAccouts()
    const chainId = network.config.chainId
    let tokenUris
    //IPFS hashes of the images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }
    // 1. with our own ipfs node (https://docs.ipfs.io) here we can use command line or from some scripts
    // 2. Pinata (pinata.cloud)
    // 3. nft.storage

    let vrfCoordinatorV2Address, subscriptionId
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatiorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("--------------------------------------------")

    await storeImages(imagesLocation)

    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].gasLane,
    //     networkConfig[chainId].callbackGasLimit,
    //     //tokenUris
    //     networkConfig[chainId].mintFee,
    // ]
}


async function handleTokenUris() {
    tokenUris = []
    //store image and metadata in ipfs  

    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]