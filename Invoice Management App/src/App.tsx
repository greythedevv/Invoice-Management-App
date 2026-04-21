import { Route, Routes } from 'react-router-dom'
import {InvoiceListPage} from "../src/pages/InvoiceList"
import './App.css'
import { InvoiceDetail } from './pages/InvoiceDetail'
import {InvoiceForm} from "./pages/InvoiceForm"


function App() {


  return (
    <>
    <Routes>
        <Route path="/" element={<InvoiceListPage/>} />
       <Route path="/invoice/:id" element={<InvoiceDetail />} />
       <Route path='/InvoiceForm' element={<InvoiceForm/>}/>

      </Routes>
    </>
  )
}

export default App
