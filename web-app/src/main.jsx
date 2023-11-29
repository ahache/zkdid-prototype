import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { clientId } from "./thirdWebClient.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain="mumbai" 
      clientId={clientId}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
)
