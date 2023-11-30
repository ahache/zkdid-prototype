import { useState } from 'react';
import { ConnectWallet } from '@thirdweb-dev/react';
import { writeProofToDWN, getRecordFromDWN } from './web5';
import getProof from './zk/getProof';
import zkdidLogo from '/zkdid-brain.jpg'
import './App.css'

function App() {
    const [input, setInput] = useState("");
    const [recordIdInput, setRecordIdInput] = useState("");

    const registerDomain = async () => {
        const proof = await getProof(input);
        console.log(proof);
        // Need to separate out proof verify input value
        // hash proof
        const record = await writeProofToDWN(proof);
        // record._recordId
    }

    return (
        <>
            <div>
                <img src={zkdidLogo} className="logo" alt="logo" />
            </div>
            <h1>ZKDID</h1>
            <div>Enter a Number:</div>
            <div>
                <input type="text" onChange={e => setInput(e.target.value)} />
                <input 
                type="button" 
                value="Get Proof" 
                onClick={() => registerDomain()} 
                />
            </div>
            <div>Enter Record ID:</div>
            <div>
                <input type="text" onChange={e => setRecordIdInput(e.target.value)} />
                <input 
                    type="button" 
                    value="Get Record" 
                    onClick={async () => {
                        const proof = await getRecordFromDWN(recordIdInput);
                        console.log(proof);
                    }} 
                />
            </div>
            <ConnectWallet theme="light" />
        </>
    )
}

export default App
