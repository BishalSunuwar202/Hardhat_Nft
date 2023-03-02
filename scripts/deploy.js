const { deployments } = require("hardhat")

async function main() {
    await deployments.fixture(["all"])
    const BasicNft = await deployments.get("BasicNft")
    console.log("Successfully deployed BasicNft", BasicNft.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
