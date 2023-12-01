import { useState } from 'react';
import styled from 'styled-components';
import { ConnectWallet } from '@thirdweb-dev/react';
import { writeProofToDWN, getRecordFromDWN } from './web5';
import getProof from './zk/getProof';
import zkdidLogo from '/zkdid-brain.jpg'
import './App.css'

import { createHash } from 'crypto';

import zkdidContractABI from './abis/ZKDID.json';

import { useContractWrite, useContract, Web3Button } from "@thirdweb-dev/react";
import { zkdidContractAddress } from './constants/addresses';

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

const Container = styled.div`
    position: relative;

    .entry-label {
        font-weight: 500;
    }

    .register-button {
        margin-top: 15px;
    }

    .wallet-connect {
        position: absolute;
        top: 0;
        right: 0;
    }
`;

function App() {
    const [input, setInput] = useState("");
    // const [recordIdInput, setRecordIdInput] = useState("");

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
            <div className='entry-label'>Enter a Number:</div>
            <div>
                <div>
                    <input type="text" onChange={e => setInput(e.target.value)} />
                </div>
                <div className='register-button'>
                    <Web3Button
                        contractAddress={zkdidContractAddress}
                        contractAbi={zkdidContractABI}
                        action={async () => {
                            if (!input || isNaN(Number(input))) return;
                            const proof = await getProof(input);
                            const eccPoint = proof[0];
                            const output = proof[1];
                            const pointHash = hash(JSON.stringify(eccPoint));
                            const record = await writeProofToDWN(proof);
                            mutateAsync({ args: [pointHash, eccPoint, output, record._recordId] })
                        }}
                    >
                        Register Domain
                    </Web3Button>
                </div>
            </div>
            {/* <div>Enter Record ID:</div> */}
            {/* <div>
                <input type="text" onChange={e => setRecordIdInput(e.target.value)} />
                <input 
                    type="button" 
                    value="Get Record" 
                    onClick={async () => {
                        const proof = await getRecordFromDWN(recordIdInput);
                        console.log(proof);
                    }} 
                />
            </div> */}
            <div className='wallet-connect'>
                <ConnectWallet theme="light" />
            </div>
        </Container>
    )
}

export default App;
