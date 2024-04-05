const hre = require("hardhat");

async function main() {
  const NAME = 'Dapp University'
  const SYMBOL = 'DAPP'
  const MAX_SUPPLY = '1000000'
  const PRICE = ethers.utils.parseUnits('0.025', 'ether')

  const openDate = Math.floor(new Date('2024-03-29T00:00:00Z').getTime() / 1000)
  const closeDate = Math.floor(new Date('2024-11-30T23:59:59Z').getTime() / 1000)

  // Converts Unix timestamps back to Date objects
  const openDateObject = new Date(openDate * 1000)
  const closeDateObject = new Date(closeDate * 1000)

  // Format dates in human readable format
  const openDateString = openDateObject.toLocaleString()
  const closeDateString = closeDateObject.toLocaleString()

  console.log(`\nOpen date: ${openDateString}`)
  console.log(`Close date: ${closeDateString}`)

  const Token = await hre.ethers.getContractFactory('Token')
  let token = await Token.deploy(NAME, SYMBOL, MAX_SUPPLY)
  
  await token.deployed()
  console.log(`\nToken deployed to: ${token.address}\n`)

  const Crowdsale = await hre.ethers.getContractFactory('Crowdsale')
  const crowdsale = await Crowdsale.deploy(
    token.address,
    PRICE,
    ethers.utils.parseUnits(MAX_SUPPLY, 'ether'),
    openDate,
    closeDate
  )

  await crowdsale.deployed()
  console.log(`Crowdsale deployed to: ${crowdsale.address}\n`)

  const transaction = await token.transfer(crowdsale.address, ethers.utils.parseUnits(MAX_SUPPLY, 'ether'))
  await transaction.wait()

  console.log('Tokens transferred to crowdsale\n')
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
