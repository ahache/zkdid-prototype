// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IVerifier {
    struct G1Point {
        uint X;
        uint Y;
    }

    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }

    struct Proof {
        G1Point a;
        G2Point b;
        G1Point c;
    }

    function verifyTx(Proof memory proof, uint[1] memory input) external view returns (bool r);
}

/// @title ZKDID Domain Registry and Resolution
contract ZKDID is ERC721 {
    struct DomainInfo {
        uint256 tokenId;
        string ionDid;
        string recordId;
    }

    uint256 private _tokenIdCounter;
    mapping (string => DomainInfo) private _domainToIds;
    mapping (uint256 => string) private _tokenIdToDomain;

    IVerifier Verifier;

    event DomainCreated(string indexed domain, uint256 tokenId, string ionDid, string recordId);

    constructor(address _verifier) ERC721("ZKDID Domain Registry", "ZKDID") {
        Verifier = IVerifier(_verifier);
    }

    function getDomainCount() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getDomainFromTokenId(uint256 tokenId) external view returns (string memory) {
        return _tokenIdToDomain[tokenId];
    }

    function resolveAll(string memory domain) external view returns (DomainInfo memory) {
        return _domainToIds[domain];
    }

    function resolveTokenId(string memory domain) external view returns (uint256) {
        return _domainToIds[domain].tokenId;
    }

    function resolveIonDid(string memory domain) external view returns (string memory) {
        return _domainToIds[domain].ionDid;
    }

    function resolveRecordId(string memory domain) external view returns (string memory) {
        return _domainToIds[domain].recordId;
    }

    /**
     * @notice Registers a new domain with a provided proof and record ID
     * @param domain The domain to be registered.
     * @param proof The proof to be verified.
     * @param input The input to prove.
     * @param recordId The DWN record ID.
     * @return tokenId The ID of the token associated with the domain.
     */
    function registerDomain(
        string memory domain, 
        IVerifier.Proof memory proof, 
        uint[1] memory input, 
        string memory ionDid,
        string memory recordId
    ) external returns (uint256 tokenId) {
        require(_domainToIds[domain].tokenId == 0, "Domain already registered");
        require(Verifier.verifyTx(proof, input), "Invalid proof");

        _tokenIdCounter += 1;
        _mint(msg.sender, _tokenIdCounter);
        
        _domainToIds[domain] = DomainInfo(_tokenIdCounter, ionDid, recordId);
        _tokenIdToDomain[_tokenIdCounter] = domain;

        emit DomainCreated(domain, _tokenIdCounter, ionDid, recordId);

        return _tokenIdCounter;
    }

}
