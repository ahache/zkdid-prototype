import { useState } from 'react';
import zkdidLogo from '/zkdid-brain.jpg'
import './App.css'

import getProof from './zk/getProof';

function App() {
  const [input, setInput] = useState(null);

  return (
    <>
      <div>
        <img src={zkdidLogo} className="logo" alt="logo" />
      </div>
      <h1>ZKDID</h1>
      <div>Enter a Number:</div>
      <input type="text" onChange={e => setInput(e.target.value)} />
      <input 
        type="button" 
        value="Get Proof" 
        onClick={async () => {
          const temp = await getProof(input);
          console.log(temp);
        }} 
      />
    </>
  )
}

export default App
