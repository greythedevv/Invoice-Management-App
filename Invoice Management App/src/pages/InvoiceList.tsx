import { FaAngleDown } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import {Sidebar} from "../components/sidebar"
import { useState } from "react";



import { InvoiceList} from "../components/InvoiceList";
import { InvoiceForm } from "../components/InvoiceForm";



export const InvoiceListPage = () => {

const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
     <Sidebar  />

      {/* Main Content */}
      <main className="flex-1 bg-[#f8f8fb] p-6 flex justify-center">

  <div className="w-full max-w-4xl">
    
    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-500">There are 7 total invoices</p>
      </div>

     <div className="flex items-center gap-7">

  {/* Filter */}
  <button className="text-gray-700 font-bold flex items-center gap-2 cursor-pointer">
    Filter by status
    <FaAngleDown />
  </button>

  {/* Button */}
  <button className="bg-[#7c5dfa] text-white px-3 py-2 rounded-full flex items-center gap-2 cursor-pointer" onClick={() => setIsNewInvoiceOpen(true)}>

    {/* Circle icon container */}
    <span className="bg-white text-[#7c5dfa] rounded-full p-1 flex items-center justify-center">
      <FaCirclePlus size={12} />
    </span>

    New Invoice
  </button>

  </div>
    </div>

 {/* invoices  */}

   <InvoiceList/>
  </div>

 
</main>
<InvoiceForm
  isOpen={isNewInvoiceOpen}
  onClose={() => setIsNewInvoiceOpen(false)}
/>

    </div>
  )
}