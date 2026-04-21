import { InvoiceCard } from "./InvoiceCard";
import {invoices} from "../data/data"


export function InvoiceList() {
  return (
    <div className="mt-6 space-y-4">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
}