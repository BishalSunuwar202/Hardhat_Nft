const { assert } = require("chai")
const { ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("unit test for randomNft", () => {
          let randomIpfsNft, vrfCoordinatorMock, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomIpfsNft")
              vrfCoordinatorMock = await ethers.getContract("VRFCoordinatorV2Mock")
          })
          describe("test for constructor", () => {
            it("sets intial values correct", async()=>{
                const dogTokenUriNull = await randomIpfsNft.getDogTokenUris(0)
                const isInitialized = await randomIpfsNft.getInitialized()
                assert(dogTokenUriNull.includes("ipfs://"))
                assert.equal(isInitialized, true)

            })
          })
      })
