import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
        .then(reg => console.log("Service Worker Registered", reg))
        .catch(err => console.log("Service Worker Error", err));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
