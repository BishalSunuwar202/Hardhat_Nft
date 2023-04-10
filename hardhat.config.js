require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
require("hardhat-deploy")
    
GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https/eth-goerli/example"
SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https/eth-sepolia/example"
PRIVATE_KEY = process.env.PRIVATE_KEY || "3fg"
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "68fg"
COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "3fgg"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
        },
        goerli: {
            chainId: 5,
            blockConfirmations: 6,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        sepolia: {
            chainId: 11155111,
            blockConfirmations: 6,
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            
            
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            goerli: process.env.ETHERSCAN_API_KEY,
            // polygon: POLYGONSCAN_API_KEY,
            sepolia:process.env.ETHERSCAN_API_KEY
        },
        // customChains: [
        //     {
        //         network: "goerli",
        //         chainId: 5,
        //         urls: {
        //             apiURL: "https://api-goerli.etherscan.io/api",
        //             browserURL: "https://goerli.etherscan.io",
        //         },
        //     },
        // ],
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        //coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
    },
    mocha: {
        timeout: 200000, //200s max
    },
}
