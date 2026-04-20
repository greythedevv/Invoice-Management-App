import { InvoiceCard } from "./InvoiceCard";

const invoices = [
  {
    id: "#RT3080",
    due: "19 Aug 2021",
    name: "Jensen Huang",
    amount: "£ 1,800.90",
    status: "Paid",
  },
  {
    id: "#RT3081",
    due: "20 Aug 2021",
    name: "Sarah Doe",
    amount: "£ 1,200.00",
    status: "Pending",
  },
  {
    id: "#RT3082",
    due: "01 Sep 2021",
    name: "Elon Musk",
    amount: "£ 3,450.50",
    status: "Draft",
  },
] as const;

export function InvoiceList() {
  return (
    <div className="mt-6 space-y-4">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}