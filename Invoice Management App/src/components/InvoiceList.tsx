import { useNavigate } from "react-router-dom";
import type { Invoice } from "../data/data";
import { FaChevronRight } from "react-icons/fa";

interface Props {
  invoices: Invoice[];
}

export const InvoiceList = ({ invoices }: Props) => {
  const navigate = useNavigate();

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-6">📭</div>
        <h3 className="text-lg font-bold text-[#0C0E16] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
          No invoices here
        </h3>
        <p className="text-sm text-[#888EB0] max-w-xs">
          Create a new invoice by clicking the <strong>New Invoice</strong> button.
        </p>
      </div>
    );
  }

  const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
    paid:    { bg: "bg-emerald-50",  text: "text-emerald-600", dot: "bg-emerald-500" },
    pending: { bg: "bg-amber-50",    text: "text-amber-600",   dot: "bg-amber-500"   },
    draft:   { bg: "bg-slate-100",   text: "text-slate-500",   dot: "bg-slate-400"   },
  };

  return (
    <div className="flex flex-col gap-3">
      {invoices.map((inv) => {
        const s = statusStyle[inv.status] ?? statusStyle.draft;
        return (
          <div
            key={inv.id}
            onClick={() => navigate(`/invoice/${encodeURIComponent(inv.id)}`)}
            className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-transparent hover:border-[#7C5DFA]/20"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {/* ID */}
            <span className="text-sm font-bold text-[#0C0E16] w-20" style={{ fontFamily: "Syne, sans-serif" }}>
              <span className="text-[#7C5DFA]">#</span>{inv.id}
            </span>

            {/* Due */}
            <span className="text-xs text-[#888EB0] w-32 hidden sm:block">
              Due {inv.paymentTerms}
            </span>

            {/* Client */}
            <span className="text-sm text-[#858BB2] flex-1 text-center hidden md:block">
              {inv.client.name}
            </span>

            {/* Amount */}
            <span className="text-sm font-bold text-[#0C0E16] w-24 text-right" style={{ fontFamily: "Syne, sans-serif" }}>
              £ {Number(inv.grandTotal).toFixed(2)}
            </span>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold ml-4 w-28 justify-center ${s.bg} ${s.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
            </div>
            <span className="text-[#7C5DFA] ml-4">
                <FaChevronRight size={10}  />
            </span>
            
          </div>
        );
      })}
    </div>
  );
};
