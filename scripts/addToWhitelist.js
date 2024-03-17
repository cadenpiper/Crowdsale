const ethers = require('ethers');
require("dotenv").config();

const CROWDSALE_ABI = require('../src/abis/Crowdsale.json');

async function main() {
	const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
	const privateKey = process.env.PRIVATE_KEY_HARDHAT
	const addressToAdd = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

	const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
	const wallet = new ethers.Wallet(privateKey, provider)

	const contractAbi = CROWDSALE_ABI

	const contract = new ethers.Contract(contractAddress, contractAbi, wallet)

	const transaction = await contract.addToWhitelist(addressToAdd)
	await transaction.wait()

	console.log(`User was added to whitelist: ${addressToAdd}\n`)
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});