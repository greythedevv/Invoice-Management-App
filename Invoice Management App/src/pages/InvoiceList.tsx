import { FaAngleDown } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { Sidebar } from "../components/sidebar";
import { useState, useRef, useEffect } from "react";
import { InvoiceList } from "../components/InvoiceList";
import { useInvoices } from "../context/InvoiceContext";

export const InvoiceListPage = () => {
  const { invoices, openNewForm, isDark } = useInvoices();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const allFilters = ["Draft", "Pending", "Paid"];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const toggleFilter = (f: string) =>
    setActiveFilters((p) =>
      p.includes(f) ? p.filter((x) => x !== f) : [...p, f]
    );

  const filteredInvoices =
    activeFilters.length > 0
      ? invoices.filter((inv) =>
          activeFilters.map((f) => f.toLowerCase()).includes(inv.status)
        )
      : invoices;

  const txtPrim  = isDark ? "var(--text-primary)"  : "#0C0E16";
  const txtSec   = isDark ? "var(--text-secondary)" : "#888EB0";
  const filterBg = isDark ? "var(--filter-bg)"      : "#fff";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .ilp * { font-family: 'DM Sans', sans-serif; }
        .ilp .syne { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .fade-up   { animation: fadeUp  0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .drop-in   { animation: dropIn 0.2s  cubic-bezier(.22,.68,0,1.2) both; }

        /* ── Page shell ─────────────────────────────────── */
        .ilp-layout {
          display: flex;
          min-height: 100vh;
          overflow-x: hidden;
        }
        @media (max-width: 767px) { .ilp-layout { flex-direction: column; } }

        .ilp-main {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
          padding: 32px 24px;
          transition: background 0.25s;
        }
        @media (min-width: 768px) { .ilp-main { padding: 56px 48px; } }

        .ilp-inner { max-width: 680px; margin: 0 auto; width: 100%; }

        /* ─────────────────────────────────────────────────
           HEADER
           Desktop  → single row: [Title+count]  [Filter] [New Invoice]
           Mobile   → two rows:
                       row 1: [Title+count]       [New Invoice button]
                       row 2: [Filter button]
           ───────────────────────────────────────────────── */
        .ilp-header {
          display: grid;
          /* Two columns: title takes leftover, controls are auto-width */
          grid-template-columns: 1fr auto;
          grid-template-rows: auto;
          align-items: center;
          gap: 12px 16px;
          margin-bottom: 40px;
          position: relative;
          z-index: 10;
          isolation: isolate;
          width: 100%;
        }

        /* On mobile switch to a 2-row layout */
        @media (max-width: 600px) {
          .ilp-header {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
          }
          /* Title: row 1 col 1 */
          .ilp-title   { grid-column: 1; grid-row: 1; }
          /* New Invoice button: row 1 col 2 */
          .new-btn-wrap { grid-column: 2; grid-row: 1; }
          /* Filter: row 2, spans both columns, aligned left */
          .filter-wrap { grid-column: 1 / -1; grid-row: 2; justify-self: start; }
        }

        /* On desktop keep everything in one row */
        @media (min-width: 601px) {
          .ilp-header   { grid-template-columns: 1fr auto auto; grid-template-rows: auto; }
          .ilp-title    { grid-column: 1; grid-row: 1; }
          .filter-wrap  { grid-column: 2; grid-row: 1; }
          .new-btn-wrap { grid-column: 3; grid-row: 1; }
        }

        /* ── Title ──────────────────────────────────────── */
        .ilp-title h1 { margin: 0; font-weight: 800; }
        .ilp-title p  { margin: 6px 0 0; }

        /* ── Filter button ──────────────────────────────── */
        .filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 700;
          padding: 8px 4px;
          border-radius: 8px;
          transition: background 0.15s;
          white-space: nowrap;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
        }
        .filter-btn:hover { background: rgba(124,93,250,0.07); }
        .filter-btn:focus-visible { outline: 2px solid #7C5DFA; outline-offset: 3px; border-radius: 8px; }

        .filter-chevron { transition: transform 0.2s ease; color: #7C5DFA; }
        .filter-chevron.open { transform: rotate(180deg); }

        /* Dropdown anchored to the filter wrapper */
        .filter-wrap { position: relative; }
        .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;          /* anchors left on mobile so it doesn't clip right edge */
          border-radius: 12px;
          padding: 16px;
          min-width: 160px;
          z-index: 300;
          box-shadow: 0 12px 40px rgba(0,0,0,0.16);
        }
        @media (min-width: 601px) {
          /* On desktop anchor right so it doesn't overflow right edge */
          .filter-dropdown { left: auto; right: 0; }
        }

        .filter-opt {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: background 0.12s;
          user-select: none;
        }
        .filter-opt:focus-visible { outline: 2px solid #7C5DFA; outline-offset: 2px; border-radius: 6px; }
        .filter-check {
          width: 14px; height: 14px;
          border-radius: 3px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }

        /* ── New Invoice button ─────────────────────────── */
        .new-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #7C5DFA;
          color: #fff;
          padding: 8px 20px 8px 8px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(124,93,250,0.38);
          transition: all 0.18s ease;
          white-space: nowrap;
          font-family: 'Syne', sans-serif;
        }
        .new-btn:hover  { background: #9277FF; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,93,250,0.48); }
        .new-btn:active { transform: translateY(0); }
        .new-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

        .new-btn-icon {
          background: #fff;
          border-radius: 9999px;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          color: #7C5DFA;
          flex-shrink: 0;
        }

        /* On mobile hide "New Invoice" text — show icon only to save space */
        @media (max-width: 600px) {
          .new-btn { padding: 8px; gap: 0; }
          .new-btn-label { display: none; }
        }

        /* ── List ───────────────────────────────────────── */
        .ilp-list { position: relative; z-index: 1; }
      `}</style>

      <div className="ilp ilp-layout" style={{ background: "var(--bg-page)" }}>
        <Sidebar />

        <main className="ilp-main" id="main-content">
          <div className="ilp-inner">

            {/* ── Header ──────────────────────────────────── */}
            <div className="ilp-header fade-up fade-up-1">

              {/* Title + count */}
              <div className="ilp-title">
                <h1
                  className="syne"
                  style={{ color: txtPrim, fontSize: "clamp(22px, 5vw, 32px)" }}
                >
                  Invoices
                </h1>
                <p style={{ color: txtSec, fontSize: 13 }}>
                  {filteredInvoices.length === 0
                    ? "No invoices"
                    : `${filteredInvoices.length} invoice${
                        filteredInvoices.length !== 1 ? "s" : ""
                      }${
                        activeFilters.length > 0
                          ? ` · ${activeFilters.join(", ")}`
                          : ""
                      }`}
                </p>
              </div>

              {/* Filter */}
              <div className="filter-wrap" ref={filterRef}>
                <button
                  className="filter-btn"
                  style={{ color: txtPrim }}
                  onClick={() => setFilterOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={filterOpen}
                  aria-label="Filter invoices by status"
                >
                  <span className="syne">
                    Filter
                    {activeFilters.length > 0 ? ` (${activeFilters.length})` : ""}
                  </span>
                  <span className={`filter-chevron ${filterOpen ? "open" : ""}`}
                    aria-hidden="true">
                        <FaAngleDown/>
                  </span>
                  
                </button>

                {filterOpen && (
                  <div
                    className="filter-dropdown drop-in"
                    role="listbox"
                    aria-multiselectable="true"
                    aria-label="Filter by status"
                    style={{ background: filterBg }}
                  >
                    {allFilters.map((f) => {
                      const checked = activeFilters.includes(f);
                      return (
                        <div
                          key={f}
                          className="filter-opt"
                          role="option"
                          aria-selected={checked}
                          tabIndex={0}
                          style={{ color: txtPrim }}
                          onClick={() => toggleFilter(f)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleFilter(f);
                            }
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = isDark
                              ? "rgba(255,255,255,0.05)"
                              : "#F9FAFE")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div
                            className="filter-check"
                            aria-hidden="true"
                            style={{
                              border: `2px solid ${checked ? "#7C5DFA" : "#DFE3FA"}`,
                              background: checked ? "#7C5DFA" : "transparent",
                            }}
                          >
                            {checked && (
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <path
                                  d="M1 3L3 5L7 1"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          {f}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* New Invoice button */}
              <div className="new-btn-wrap">
                <button
                  className="new-btn"
                  onClick={openNewForm}
                  aria-label="Create new invoice"
                >
                  <span className="new-btn-icon" aria-hidden="true">
                    <FaCirclePlus size={14} />
                  </span>
                  <span className="new-btn-label syne">New Invoice</span>
                </button>
              </div>
            </div>

            {/* ── Invoice list ─────────────────────────────── */}
            <div className="ilp-list fade-up fade-up-2">
              <InvoiceList invoices={filteredInvoices} />
            </div>

          </div>
        </main>
      </div>
    </>
  );
};
