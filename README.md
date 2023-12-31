## ZKDID Prototype Application

This application allows a user to input a number and compute the square and a proof of computation

These results are published to a users DWN (Decentralized Web Node) and the resulting DWN Record ID along with the proof + square are submitted for registering a zkdid domain on Polygon Mumbai

The proof + square are submitted to a verifier contract and if successful an NFT is minted to represent ownership of the domain 

The domain string is the sha256 hash of the stringified proof + square result

This domain resolves to the stored proof and the verification of the proof can attest to the owner knowing the original input number (the root of the stored square)

----

### Tech used
- React (Vite)
- Third Web for web3 connection
- TBD Web5 for DWN
- ZoKrates for ZK proof generation and verifying
- Foundry for smart contracts
- Open Zeppelin for ERC721 (NFT)
