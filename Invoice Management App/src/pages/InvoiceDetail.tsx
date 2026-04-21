import { Sidebar } from "../components/sidebar"
import { useParams, useNavigate } from "react-router-dom"
import { invoices as initialInvoices } from "../data/data"
import { FaLessThan } from "react-icons/fa6"
import { useState } from "react"

export const InvoiceDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // ✅ Local state (so we can edit/delete)
  const [invoiceList, setInvoiceList] = useState(initialInvoices)

  if (!id) {
    return <p>No invoice ID found</p>
  }

  const cleanId = decodeURIComponent(id)

  const invoice = invoiceList.find((inv) => inv.id === cleanId)

  // ✅ Guard
  if (!invoice) {
    return <p>Invoice not found</p>
  }

  // ✅ Actions
  const handleDelete = () => {
    const updated = invoiceList.filter((inv) => inv.id !== invoice.id)
    setInvoiceList(updated)

    // go back after delete
    navigate("/")
  }

  const handleMarkAsPaid = () => {
    const updated = invoiceList.map((inv) =>
      inv.id === invoice.id ? { ...inv, status: "paid" } : inv
    )
    setInvoiceList(updated)
  }

  const handleEdit = () => {
    navigate(`/edit/${encodeURIComponent(invoice.id)}`)
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 bg-[#f8f8fb] p-6 flex justify-center">
        <div className="w-full max-w-4xl">

          {/* Go back */}
          <button
            className="flex items-center gap-2 mb-4 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <FaLessThan />
            <span>Go back</span>
          </button>

          {/* Status Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg">
            <div className="flex items-center">
              <p className="text-gray-500">Status</p>

              <span
                className={`px-5 py-1 text-sm capitalize ml-2.5 rounded-full ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-600"
                    : invoice.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="bg-[#F9FAFE] rounded-full px-4 py-2 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="bg-[#EC5757] rounded-full px-4 py-2 text-white cursor-pointer"
              >
                Delete
              </button>

              <button
                onClick={handleMarkAsPaid}
                className="bg-[#7C5DFA] rounded-full px-4 py-2 text-white cursor-pointer"
              >
                Mark as paid
              </button>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="mt-6 bg-white p-6 rounded-lg">

            {/* Top */}
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">#{invoice.id}</h3>
                <p>{invoice.projectDescription}</p>
              </div>

              <div className="text-right">
                <p>{invoice.senderAddress.street}</p>
                <p>{invoice.senderAddress.city}</p>
                <p>{invoice.senderAddress.postcode}</p>
                <p>{invoice.senderAddress.country}</p>
              </div>
            </div>

            {/* Billing */}
            <div className="grid grid-cols-3 mt-8">
              <div>
                <p>Invoice Date</p>
                <p className="font-bold mt-2.5">{invoice.invoiceDate}</p>

                <p className="mt-4">Payment Due</p>
                <p className="font-bold mt-2.5">{invoice.paymentTerms}</p>
              </div>

              <div>
                <p>Bill To</p>
                <p className="mt-2.5 font-bold">{invoice.client.name}</p>
                <p>{invoice.client.address.street}</p>
                <p>{invoice.client.address.city}</p>
                <p>{invoice.client.address.postcode}</p>
                <p>{invoice.client.address.country}</p>
              </div>

              <div>
                <p>Sent to</p>
                <p className="mt-2.5 font-bold">{invoice.client.email}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-9 bg-[#F9FAFE] p-6 rounded-lg">

              {/* Header */}
              <div className="flex justify-between text-gray-500 mb-4">
                <p>Item Name</p>
                <div className="flex gap-10">
                  <p>QTY.</p>
                  <p>Price</p>
                  <p>Total</p>
                </div>
              </div>

              {/* List */}
              {invoice.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-none"
                >
                  <p className="font-bold">{item.itemName}</p>

                  <div className="flex gap-10 text-gray-600">
                    <p>{item.quantity}</p>
                    <p>£ {item.price}</p>
                    <p className="font-bold text-black">£ {item.total}</p>
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="flex justify-between mt-6 bg-[#373B53] text-white p-4 rounded-lg">
                <p>Amount Due</p>
                <p className="font-bold text-lg">£ {invoice.grandTotal}</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}