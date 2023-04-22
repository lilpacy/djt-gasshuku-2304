// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import env, { ethers } from "hardhat";
import { HttpNetworkConfig } from "hardhat/types";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // hardhat envのsignerを使う
  // const [signer] = await ethers.getSigners();
  const rpcUrl = (env.network.config as HttpNetworkConfig).url;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(
    "0123456789012345678901234567890123456789012345678901234567890123"
  ).connect(provider);
  // providerの指定
  const Contract = await ethers.getContractFactory("ERC721Receiver");
  const contract = await Contract.connect(signer).deploy();

  await contract.deployed();

  console.log("deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  throw error;
});
