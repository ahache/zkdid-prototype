## ZKDID Domain Registry Contract
- Registering domains, minting NFT
- Resolving domain to DWN DID containing proof

### TODO
- When registering, require verification of associated proof
    - Verification contract is associated with current key in app
    - Will need to regen if program is changed
- Resolving needs to resolve a domain to a DWN DID
    - Token holder needs to be able to set and update DID
- Need some way to enforce correct hash being provided as domain
- Security and basic checks added
