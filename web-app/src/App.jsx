import './App.css'
import { useState } from 'react';
import styled from 'styled-components';
import { createHash } from 'crypto';
import { ConnectWallet } from '@thirdweb-dev/react';
import { useContractWrite, useContract, Web3Button } from "@thirdweb-dev/react";
import { writeProofToDWN, getRecordFromDWN } from './web5';
import { zkdidContractAddress } from './constants/addresses';
import zkdidContractABI from './abis/ZKDID.json';
import getProof from './zk/getProof';
import zkdidLogo from '/zkdid-brain.jpg'

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

const Container = styled.div`
    position: relative;

    .input-group {
        .entry-label {
            font-weight: 500;
            font-size: 1.1em;
        }

        input {
            padding: 5px;
            font-size: 1em;
            border-radius: 5px;
            border: #ededef solid;
        }
    }

    .register-button {
        margin-top: 30px;
    }

    .results {
        border: #ededef solid 1px;
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

    .wallet-connect {
        position: absolute;
        top: 0;
        right: 0;
    }
`;

function App() {
    const [inputNumber, setInputNumber] = useState("");
    const [domainString, setDomainString] = useState("");
    const [showSuccessResults, setShowSuccessResults] = useState(false);

    const { contract } = useContract(
        zkdidContractAddress,
        zkdidContractABI,
    );

    const { mutateAsync, isLoading, error } = useContractWrite(
        contract,
        "registerDomain",
    );

    return (
        <Container>
            <div>
                <img src={zkdidLogo} className="logo" alt="logo" />
            </div>
            <h1>ZKDID</h1>
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
                            setShowSuccessResults(true);
                        }}
                        onError={() => {
                            alert("Error!");
                        }}
                        action={async () => {
                            if (!inputNumber || isNaN(Number(inputNumber))) return;
                            setShowSuccessResults(false);
                            const proof = await getProof(inputNumber);
                            const eccPoints = proof[0];
                            const outputSquare = proof[1];
                            const record = await writeProofToDWN(proof);
                            const storedString = await getRecordFromDWN(record._recordId);
                            const stringHash = hash(JSON.stringify(storedString));
                            setDomainString(stringHash);
                            await mutateAsync({ args: [stringHash, eccPoints, outputSquare, record._recordId] });
                            setInputNumber("");
                        }}
                    >
                        Register Domain
                    </Web3Button>
                </div>
                {showSuccessResults && <div className='results'>
                    {showSuccessResults && 
                        <div className='domain-registered'>
                            <div className='success-label'>Successfully Registered</div>
                            <div className='domain-string'>{domainString}.zkdid</div>
                        </div>
                    }
                    {/* Error case here */}
                </div>}
            </div>
            <div className='wallet-connect'>
                <ConnectWallet theme="light" />
            </div>
        </Container>
    )
}

export default App;
