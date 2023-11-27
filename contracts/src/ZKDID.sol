// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ZKDID is ERC721 {
    uint256 private _tokenIdCounter;
    mapping (string => uint256) private _domainToId;
    mapping (uint256 => string) private _idToDomain;

    constructor() ERC721("ZKDID Domain Registry", "ZKDID") {}

    function register(string memory domain) public {
        // TODO: Implement domain registration logic
        require(_domainToId[domain] == 0, "Domain already registered");
        _tokenIdCounter += 1;
        _mint(msg.sender, _tokenIdCounter);
        _domainToId[domain] = _tokenIdCounter;
        _idToDomain[_tokenIdCounter] = domain;
    }

    function resolve(string memory domain) public view returns (string memory) {
        // TODO: Implement domain resolution logic
        uint256 tokenId = _domainToId[domain];
        return _idToDomain[tokenId];
    }
}
