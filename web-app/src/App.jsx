import { useState } from 'react';
import zkdidLogo from '/zkdid-brain.jpg'
import './App.css'

import getProof from './zk/getProof';

import {writeProofToDWN, getRecordFromDWN} from './web5';

function App() {
  const [input, setInput] = useState("");
  const [recordIdInput, setRecordIdInput] = useState("");

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
          onClick={async () => {
            const proof = await getProof(input);
            const record = await writeProofToDWN(proof);
            console.log(record._recordId);
          }} 
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
    </>
  )
}

export default App
