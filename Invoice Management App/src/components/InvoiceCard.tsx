import { FaGreaterThan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Invoice = {
  id: string;
  due: string;
  name: string;
  amount: string;
  status: "Paid" | "Pending" | "Draft";
};

type Props = {
  invoice: Invoice;
};

export const InvoiceCard = ({ invoice }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/invoices/${invoice.id}`);
  };



  return (
    <div
      className="grid grid-cols-6 items-center bg-white p-4 rounded-lg shadow-sm cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="font-bold">{invoice.id}</h3>

      <p className="text-gray-500">Due {invoice.due}</p>

      <p className="text-gray-700">{invoice.name}</p>

      <h3 className="font-bold">{invoice.amount}</h3>

      <div
        className={`px-3 py-1 rounded text-center text-sm ${
          invoice.status === "Paid"
            ? "bg-green-100 text-green-600"
            : invoice.status === "Pending"
            ? "bg-yellow-100 text-yellow-600"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {invoice.status}
      </div>

      <span className="text-gray-400">
        <FaGreaterThan />
      </span>
    </div>
  );
};