import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { InvoiceProvider } from "./context/InvoiceContext"



createRoot(document.getElementById('root')!).render(

  <StrictMode>
      <InvoiceProvider>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </InvoiceProvider>
  </StrictMode>
  
)
