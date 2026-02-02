import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying CompanyToken with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Example deployment
  const CompanyToken = await ethers.getContractFactory("CompanyToken");
  const token = await CompanyToken.deploy(
    "Example Company",
    "EXCMP",
    deployer.address,
    deployer.address // Fee collector (can be changed later)
  );

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("CompanyToken deployed to:", tokenAddress);
  console.log("Initial supply:", await token.totalSupply());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
