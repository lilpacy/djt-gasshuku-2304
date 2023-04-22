import { expect } from "chai";
// @ts-ignore
import { ethers } from "hardhat";

describe("ERC721Receiver", function () {
  it("success; receive erc721", async function () {
    // MyERC721をデプロイして、signerにミントする
    const [deployer, consumer] = await ethers.getSigners();
    const MyERC721 = await ethers.getContractFactory("MyERC721");
    const myERC721 = await MyERC721.deploy(deployer.address);
    const Receiver = await ethers.getContractFactory("ERC721Receiver");
    const receiver = await Receiver.deploy();

    console.log("deployer", deployer.address);
    console.log("receiver", receiver.address);
    console.log("consumer", consumer.address);

    console.log(1, await myERC721.ownerOf(1));
    console.log(2, await myERC721.ownerOf(2));
    console.log(3, await myERC721.ownerOf(3));

    // deployerからconsumerに1枚送る
    await myERC721
      .connect(deployer)
      ["safeTransferFrom(address,address,uint256)"](
        deployer.address,
        consumer.address,
        1
      );
    // deployerからerc721receiverに2枚送る
    await myERC721
      .connect(deployer)
      ["safeTransferFrom(address,address,uint256)"](
        deployer.address,
        receiver.address,
        2
      );
    await myERC721
      .connect(deployer)
      ["safeTransferFrom(address,address,uint256)"](
        deployer.address,
        receiver.address,
        3
      );
    // consumerからerc721receiverに1枚送る
    await myERC721
      .connect(consumer)
      ["safeTransferFrom(address,address,uint256)"](
        consumer.address,
        receiver.address,
        1
      );

    console.log(1, await myERC721.ownerOf(1));
    console.log(2, await myERC721.ownerOf(2));
    console.log(3, await myERC721.ownerOf(3));

    // 枚数は変わらずtokenIdが入れ替わってることを確認
    expect(await myERC721.balanceOf(deployer.address)).to.equal(0);
    expect(await myERC721.balanceOf(consumer.address)).to.equal(1);
    expect(await myERC721.balanceOf(receiver.address)).to.equal(2);
  });
});
