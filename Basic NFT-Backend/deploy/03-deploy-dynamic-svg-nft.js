const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains, networkConfig } = require("../helper-hardhat.config")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address

    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const lowSvg = await fs.readFileSync("./images/dynamicNFT/nasa.svg", { encoding: "utf-8" })
    const hignSvg = await fs.readFileSync("./images/dynamicNFT/morning.svg", { encoding: "utf-8" })
    args = [ethUsdPriceFeedAddress, lowSvg, hignSvg]
    log("--------------------------------------")
    const dynamicNFT = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(dynamicNFT.address, args)
    }
}

module.exports.tags = ["all", "dynamicsvg", "main"]