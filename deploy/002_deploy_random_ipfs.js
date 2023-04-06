const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToNFTstorage")
const { verify } = require("../utils/verify")

const imagesLocation = "./images/random"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness Overloaded",
            value: 100,
        },
    ],
}

let tokenUris  = [
    "ipfs://QmRyvdcYVLFaYv52C7wVSCeXhFdsUuTH4qQxQPbwpjt4yG",
    "ipfs://QmV53kdGpKSV6nYZvokNPvRWbVL4PGqohtawXoEcutwDDZ",
    "ipfs://QmTdHe8bmqraUGuuAo7etdBcvK7UuPcpWN6RB6v9k4zbZ2",
]

fund_amount = "1000000000000000000000" // 10 Link ethers.parseUnit 

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //IPFS hashes of the images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }
    // 1. with our own ipfs node (https://docs.ipfs.io) here we can use command line or from some scripts
    // 2. Pinata (pinata.cloud)
    // 3. nft.storage

    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
        //we need to fund the subscription 
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, fund_amount)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("--------------------------------------------")

    //await storeImages(imagesLocation)

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenUris,
        networkConfig[chainId].mintFee,
    ]

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    await vrfCoordinatorV2Mock.addConsumer(
        subscriptionId,
        randomIpfsNft.address
    )
    
    log("------------------------------------------")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying......")
        await verify(randomIpfsNft.address, args)
    }
}

async function handleTokenUris() {
    
    //store image and metadata in ipfs
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        //create metadata
        //upload metadata

        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace("png", "")
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!!!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)

        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token Uri uploaded successfully")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
