import { Route, Routes } from 'react-router-dom'
import {InvoiceListPage} from "../src/pages/InvoiceList"
import './App.css'
import { InvoiceDetail } from './pages/InvoiceDetail'


function App() {


  return (
    <>
    <Routes>
        <Route path="/" element={<InvoiceListPage/>} />
       <Route path="/invoices/:id" element={<InvoiceDetail />} />
      </Routes>
    </>
  )
}

export default App
