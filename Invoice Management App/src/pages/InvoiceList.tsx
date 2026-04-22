import { FaAngleDown } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { Sidebar } from "../components/sidebar";
import { useState } from "react";
import { InvoiceList } from "../components/InvoiceList";
import { useInvoices } from "../context/InvoiceContext";

export const InvoiceListPage = () => {
  const { invoices, openNewForm } = useInvoices();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = ["Draft", "Pending", "Paid"];

  const filteredInvoices = activeFilter
    ? invoices.filter((inv) => inv.status === activeFilter.toLowerCase())
    : invoices;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .ilp-root * { font-family: 'DM Sans', sans-serif; }
        .ilp-root .syne { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .drop-in { animation: dropIn 0.2s cubic-bezier(.22,.68,0,1.2) both; }
        .new-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #7C5DFA; color: #fff;
          padding: 10px 16px 10px 10px;
          border-radius: 9999px; border: none; cursor: pointer;
          font-size: 14px; font-weight: 700;
          box-shadow: 0 6px 20px rgba(124,93,250,0.38);
          transition: all 0.18s ease; font-family: 'Syne', sans-serif;
        }
        .new-btn:hover { background: #9277FF; transform: translateY(-1px); }
        .new-btn:active { transform: translateY(0); }
        .new-btn-icon {
          background: #fff; border-radius: 9999px; width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          color: #7C5DFA; flex-shrink: 0;
        }
        .filter-btn {
          display: inline-flex; align-items: center;
          background: transparent; border: none; cursor: pointer;
          font-size: 14px; font-weight: 700; color: #0C0E16;
          gap: 8px; padding: 8px 12px; border-radius: 8px;
          transition: background 0.15s ease; font-family: 'Syne', sans-serif;
        }
        .filter-btn:hover { background: rgba(124,93,250,0.07); }
        .filter-chevron { transition: transform 0.2s ease; color: #7C5DFA; }
        .filter-chevron.open { transform: rotate(180deg); }
        .filter-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.16);
          padding: 16px;
          min-width: 160px;
          /* Key fix: high z-index so it floats above the invoice list */
          z-index: 200;
        }
        .filter-option {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 6px; cursor: pointer;
          font-size: 13px; font-weight: 600; color: #0C0E16;
          transition: background 0.12s ease;
        }
        .filter-option:hover { background: #F9FAFE; }
        .filter-checkbox {
          width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0;
          border: 2px solid #DFE3FA; background: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s ease;
        }
        .filter-checkbox.checked { background: #7C5DFA; border-color: #7C5DFA; }
      `}</style>

      <div className="ilp-root flex h-screen overflow-hidden bg-[#F8F8FB]">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-6 py-10">
          <div className="w-full max-w-2xl mx-auto">

            {/* Header row — isolation: isolate creates a new stacking context
                so the dropdown (z-index:200) sits on top of the list below */}
            <div
              className="fade-up fade-up-1 flex justify-between items-center mb-10"
              style={{ position: "relative", zIndex: 10, isolation: "isolate" }}
            >
              <div>
                <h1 className="text-3xl text-[#0C0E16] syne" style={{ fontWeight: 800 }}>
                  Invoices
                </h1>
                <p className="text-sm text-[#888EB0] mt-1">
                  {filteredInvoices.length === 0
                    ? "No invoices"
                    : `${filteredInvoices.length} invoice${filteredInvoices.length !== 1 ? "s" : ""}${activeFilter ? ` · ${activeFilter}` : ""}`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Filter wrapper — relative so dropdown anchors to it */}
                <div style={{ position: "relative" }}>
                  <button className="filter-btn" onClick={() => setFilterOpen((v) => !v)}>
                    Filter
                    <span className={`filter-chevron ${filterOpen ? "open" : ""}`} >
                      <FaAngleDown />
                    </span>
                    
                  </button>

                  {filterOpen && (
                    <div className="filter-dropdown drop-in">
                      {filters.map((f) => (
                        <div
                          key={f}
                          className="filter-option"
                          onClick={() => {
                            setActiveFilter(activeFilter === f ? null : f);
                            setFilterOpen(false);
                          }}
                        >
                          <div className={`filter-checkbox ${activeFilter === f ? "checked" : ""}`}>
                            {activeFilter === f && (
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className="new-btn" onClick={openNewForm}>
                  <span className="new-btn-icon"><FaCirclePlus size={13} /></span>
                  New Invoice
                </button>
              </div>
            </div>

            {/* Invoice list — sits in normal stacking context below the header */}
            <div className="fade-up fade-up-2" style={{ position: "relative", zIndex: 1 }}>
              <InvoiceList invoices={filteredInvoices} />
            </div>

          </div>
        </main>
      </div>
    </>
  );
};
