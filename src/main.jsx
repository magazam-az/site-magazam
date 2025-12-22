import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import {Provider} from "react-redux"
import {store} from "./redux/store.js"

// Global redirect - vercel.app-dən magazam.az-ə yönləndirir (React yüklənməzdən əvvəl)
if (window.location.hostname.includes('vercel.app')) {
  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  const newUrl = `https://magazam.az${currentPath}`;
  console.log('Global redirect (main.jsx): vercel.app -> magazam.az:', newUrl);
  window.location.replace(newUrl);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
