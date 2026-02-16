/**
 * Deploy OnChainScholarship to Conflux eSpace (EVM-compatible).
 * Run: npx hardhat run scripts/deploy-conflux.js --network confluxEspaceTestnet
 * Requires: .env with PRIVATE_KEY (deployer wallet, no 0x prefix or with 0x both work)
 */
require('dotenv').config();

async function main() {
  console.log('Deploying OnChainScholarship to Conflux eSpace Testnet...\n');

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error('No deployer account. Set PRIVATE_KEY in .env');
  }
  console.log('Deployer address:', deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Deployer balance:', ethers.formatEther(balance), 'CFX\n');

  const OnChainScholarship = await ethers.getContractFactory('OnChainScholarship');
  const contract = await OnChainScholarship.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log('\n✅ OnChainScholarship deployed successfully');
  console.log('Contract address:', contractAddress);
  console.log('\n📝 Add to your .env:');
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Deployment failed:', err.message);
    process.exit(1);
  });
