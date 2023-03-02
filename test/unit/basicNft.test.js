const { assert } = require("chai")
const { ethers, deployments, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("unit test for basicnft", () => {
          let basicNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["basicnft"])
              basicNft = await ethers.getContract("BasicNft")
          })
          describe("constructor", () => {
              it("initialize the NFT", async () => {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(name, "Doggy")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter, 0)
              })
          })
      })
