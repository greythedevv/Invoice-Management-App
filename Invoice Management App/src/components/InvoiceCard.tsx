import { FaGreaterThan } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import type { Invoice } from "../data/data"

type Props = {
  invoice: Invoice
}

export const InvoiceCard = ({ invoice }: Props) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/invoice/${encodeURIComponent(invoice.id)}`)
  }

  return (
    <div
      className="grid grid-cols-5 items-center bg-white p-4 rounded-lg shadow-sm cursor-pointer"
      onClick={handleClick}
    >
      {/* ID */}
      <h3 className="font-bold">{invoice.id}</h3>

      {/* Date */}
      <p className="text-gray-500">
        Due {invoice.invoiceDate}
      </p>

      {/* Client */}
      <p className="text-gray-700">
        {invoice.client.name}
      </p>

      {/* Amount */}
      <h3 className="font-bold">
        £ {invoice.grandTotal}
      </h3>

      {/* Status + Arrow */}
      <div className="flex items-center justify-between">
        <div
          className={`px-3 py-1 rounded text-sm capitalize ${
            invoice.status === "paid"
              ? "bg-green-100 text-green-600"
              : invoice.status === "pending"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {invoice.status}
        </div>
          <span className="text-gray-400">
          <FaGreaterThan  />
          </span>
        
      </div>
    </div>
  )
}