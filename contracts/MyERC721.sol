// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC721 is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(address to) ERC721("MyNFT", "MNFT") {
        for (uint256 i = 0; i < 3; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(to, newItemId);
        }
    }

    function mint(address to, uint256 amount)
        public
        onlyOwner
        returns (uint256)
    {
        for (uint256 i = 0; i < amount; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(to, newItemId);
        }
        return _tokenIds.current();
    }
}
