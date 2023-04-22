//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract ERC721Receiver is Context, IERC721Receiver, Ownable {
    using Address for address;

    // contract addressとtoken idのリストのmappingを定義
    mapping(address => uint256[]) public tokenList;

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // 受け取ったerc721トークンのcontract addressとtoken idを保存
        tokenList[_msgSender()].push(tokenId);

        //        // 送られてきたerc721のトークンを送り返す
        //        IERC721(_msgSender()).safeTransferFrom(address(this), from, tokenId);

        // 送られてきたerc721のトークンをtokenListに保存する
        tokenList[_msgSender()].push(tokenId);

        // deployerからのtransferの場合、早期リターン
        if (from == owner()) {
            return this.onERC721Received.selector;
        }

        // 送られてきたerc721のトークンと同じコントラクトアドレスの別のtoken idのnftを送り返す
        uint256 randomIndex = block.number % tokenList[_msgSender()].length;
        console.log(from);
        console.log(block.number);
        console.log(randomIndex);
        console.log(tokenList[_msgSender()][randomIndex]);
        IERC721(_msgSender()).safeTransferFrom(
            address(this),
            from,
            tokenList[_msgSender()][randomIndex]
        );

        // 送り返したtoken idをtokenListから削除
        delete tokenList[_msgSender()][randomIndex];

        return this.onERC721Received.selector;
    }
}
