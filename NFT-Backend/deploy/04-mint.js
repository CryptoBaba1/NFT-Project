const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

module.exports = async function ({ getNamedAccounts }) {
    const { deployer } = await getNamedAccounts()

    //Basic NFT
    const basicNFT = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicNFT.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicNFT.tokenURI(0)}`)

    //Random IPFS NFT
    const randomIpfsNFT = await ethers.getContract("RandomipfsNft", deployer)
    const mintFee = await randomIpfsNFT.getMintFee()
    await new Promise(async (resolve, reject) => {
        setTimeout(resolve, 30000000)
        randomIpfsNFT.once("NftMinted", async function () {
            resolve()
        })
        const randomipfsMintTx = await randomIpfsNFT.requestNft({ value: mintFee.toString() })
        const randomIpfsNftMintTxReceipt = await randomipfsMintTx.wait(1)
        const chainId = network.config.chainId
        if (chainId == 31337) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNFT.address)
        }
    })
    console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNFT.tokenURI(0)}`)

    // Dynamic SVG NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicNFT = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicNFTMinttx = await dynamicNFT.mintNft(highValue.toString())
    await dynamicNFTMinttx.wait(1)
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicNFT.tokenURI(0)}`)

}
module.exports.tags = ["all", "mint"]