import './App.css'
import { useState } from 'react';
import styled from 'styled-components';
import { createHash } from 'crypto';
import { ConnectWallet } from '@thirdweb-dev/react';
import { useContractWrite, useContract, Web3Button } from "@thirdweb-dev/react";
import { writeProofToDWN, getProofFromDWN, queryProofFromDWN } from './web5';
import { verifierContractAddress, zkdidContractAddress } from './constants/addresses';
import zkdidContractABI from './abis/ZKDID.json';
import verifierContractABI from './abis/Verifier.json';
import getProof from './zk/getProof';
import zkdidLogo from '/zkdid-brain.jpg'

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

const buttonGrey = "#ededef";

const Container = styled.div`
    position: relative;

    .info-text {
        width: 50%;
        margin: 20px auto;

        .subtitle {
            font-size: 1.3em;
            font-weight: 500;
            padding-bottom: 5px;
        }

        .brief {

        }
    }

    .input-group {
        .entry-label {
            font-weight: 500;
            font-size: 1.1em;
            padding-bottom: 5px;
        }

        input {
            padding: 5px;
            font-size: 1em;
            border-radius: 5px;
            border: ${buttonGrey} solid;
            background-color: white;
            color: black;
            width: 300px;
        }
    }

    .register-button {
        margin-top: 10px;
        margin-bottom: 30px;
    }

    .results {
        border: ${buttonGrey} solid 1px;
        width: max-content;
        margin: auto;
        padding: 15px;
        margin-top: 30px;
        border-radius: 7px;

        .domain-registered {
            .success-label {
                font-weight: 600;
                font-size: 1.5em;
                padding-bottom: 10px;
            }

            .domain-string {
                font-weight: 600;
            }
        }
    }

    .divider {
        border: 1px ${buttonGrey} solid;
        margin: 20px auto;
        width: 40%;
    }

    .wallet-connect {
        position: absolute;
        top: 0;
        right: 0;
    }
`;

function App() {
    const [inputNumber, setInputNumber] = useState("");
    const [inputDomain, setInputDomain] = useState("");
    const [domainStringRegistering, setDomainStringRegistering] = useState("");
    const [showRegistrationResults, setShowRegistrationResults] = useState(false);
    const [verificationStatement, setVerificationStatement] = useState("");

    const { contract: zkdidContract } = useContract(zkdidContractAddress, zkdidContractABI);

    const { contract: verifierContract } = useContract(verifierContractAddress, verifierContractABI);

    const { mutateAsync } = useContractWrite(zkdidContract, "registerDomain");

    return (
        <Container>
            <div>
                <img src={zkdidLogo} className="logo" alt="logo" />
            </div>
            <h1>ZKDID</h1>
            <div className='divider'></div>
            {/* Registry */}
            <div className='info-text'>
                <div className='subtitle'>Registry</div>
                <div className='brief'>Generate and publish (DWN) proof of squaring a number. Register domain (NFT) that resolves to this proof.</div>
            </div>
            <div className='input-group'>
                <div className='entry-label'>Enter a Number:</div>
                <div>
                    <input 
                        type="text" 
                        onChange={e => setInputNumber(e.target.value)} 
                        value={inputNumber}
                    />
                </div>
            </div>
            <div>
                <div className='register-button'>
                    <Web3Button
                        contractAddress={zkdidContractAddress}
                        contractAbi={zkdidContractABI}
                        onSuccess={() => {
                            setShowRegistrationResults(true);
                        }}
                        onError={() => {
                            alert("Error!");
                        }}
                        action={async () => {
                            if (!inputNumber || isNaN(Number(inputNumber))) return;
                            setShowRegistrationResults(false);
                            const proof = await getProof(inputNumber);
                            const eccPoints = proof[0];
                            const outputSquare = proof[1];
                            const { record, did: ionDid } = await writeProofToDWN(proof);
                            const storedString = await getProofFromDWN(record._recordId);
                            const stringHash = hash(JSON.stringify(storedString));
                            setDomainStringRegistering(stringHash);
                            await mutateAsync({ args: [stringHash, eccPoints, outputSquare, ionDid, record._recordId] });
                            setInputNumber("");
                        }}
                    >
                        Register Domain
                    </Web3Button>
                </div>
                {showRegistrationResults && <div className='results'>
                    {showRegistrationResults && 
                        <div className='domain-registered'>
                            <div className='success-label'>Successfully Registered</div>
                            <div className='domain-string'>{domainStringRegistering}.zkdid</div>
                        </div>
                    }
                    {/* Error case here */}
                </div>}
            </div>
            <div className='divider'></div>
            {/* Resolution */}
            <div className='info-text'>
                <div className='subtitle'>Resolver</div>
                <div className='brief'>Domain will resolve to associated proof and assertion is verified on chain.</div>
            </div>
            <div className='input-group'>
                <div className='entry-label'>Enter Domain:</div>
                <div>
                    <input 
                        type="text" 
                        className='domain-input'
                        onChange={e => setInputDomain(e.target.value)} 
                        value={inputDomain}
                    />
                </div>
            </div>
            <div>
                <div className='register-button'>
                    <Web3Button
                        contractAddress={zkdidContractAddress}
                        contractAbi={zkdidContractABI}
                        onError={() => {
                            alert("Error!");
                        }}
                        action={async () => {
                            if (!inputDomain) return;
                            const domainString = inputDomain.split('.')[0];
                            const [, ionDid, recordId] = await zkdidContract.call("resolveAll", [domainString]);
                            const storedString = await queryProofFromDWN(ionDid, recordId);
                            const proof = JSON.parse(storedString);
                            const eccPoints = proof[0];
                            const outputSquare = proof[1];
                            const verifierResult = await verifierContract.call("verifyTx", [eccPoints, outputSquare]);
                            if (verifierResult) {
                                setVerificationStatement(`Owner must know the root of ${parseInt(outputSquare[0], 16)}`);
                            } else {
                                console.log("Proof can not be verified");
                            }
                        }}
                    >
                        Resolve
                    </Web3Button>
                </div>
                {verificationStatement && <div className='results'>
                    {verificationStatement && 
                        <div className='domain-registered'>
                            <div className='domain-string'>{verificationStatement}</div>
                        </div>
                    }
                </div>}
            </div>
            <div className='wallet-connect'>
                <ConnectWallet theme="light" />
            </div>
        </Container>
    )
}

export default App;
