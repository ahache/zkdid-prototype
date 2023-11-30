import { useState } from 'react';
import styled from 'styled-components';
import { ConnectWallet } from '@thirdweb-dev/react';
import { writeProofToDWN, getRecordFromDWN } from './web5';
import getProof from './zk/getProof';
import zkdidLogo from '/zkdid-brain.jpg'
import './App.css'

const Container = styled.div`
    position: relative;

    .entry-label {
        font-weight: 500;
    }

    .register-button {
        margin-top: 5px;
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

    const registerDomain = async () => {
        if (!input || Number(input) == NaN) return;
        const proof = await getProof(input);
        console.log(proof);
        // Need to separate out proof verify input value
        // hash proof
        const record = await writeProofToDWN(proof);
        console.log(record._recordId);
    }

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
                    <input 
                        type="button" 
                        value="Register Domain" 
                        onClick={() => registerDomain()} 
                    />
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
