import { useNavigate } from "react-router-dom";
import type { Invoice } from "../data/data";
import { FaChevronRight } from "react-icons/fa";
import { useInvoices } from "../context/InvoiceContext";

// Import the illustration — place Group.png in src/assets/
import EmptyIllustration from "../assets/Group.png";

interface Props {
  invoices: Invoice[];
}

export const InvoiceList = ({ invoices }: Props) => {
  const navigate = useNavigate();
  const { isDark } = useInvoices();

  const txtPrim = isDark ? "var(--text-primary)"   : "#0C0E16";
  const txtSec  = isDark ? "var(--text-secondary)"  : "#888EB0";
  const cardBg  = isDark ? "var(--bg-card)"         : "#fff";

  /* ── Empty state ─────────────────────────────────────────────── */
  if (invoices.length === 0) {
    return (
      <>
        <style>{`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 24px;
            text-align: center;
            min-height: 50vh;
          }
          .empty-state img {
            width: 100%;
            max-width: 240px;
            margin-bottom: 40px;
          }
          .empty-state h2 {
            font-family: 'Syne', sans-serif;
            font-size: 20px;
            font-weight: 800;
            margin: 0 0 16px;
          }
          .empty-state p {
            font-size: 13px;
            line-height: 1.7;
            max-width: 220px;
            margin: 0;
          }
          .empty-state p strong {
            font-weight: 700;
          }
          @media (min-width: 640px) {
            .empty-state img  { max-width: 280px; }
            .empty-state h2   { font-size: 24px; }
            .empty-state p    { font-size: 14px; max-width: 240px; }
          }
        `}</style>

        <div className="empty-state" role="status" aria-live="polite">
          <img src={EmptyIllustration} alt="No invoices illustration" />
          <h2 style={{ color: txtPrim }}>There is nothing here</h2>
          <p style={{ color: txtSec }}>
            Create an invoice by clicking the{" "}
            <strong style={{ color: txtPrim }}>New Invoice</strong> button and get started
          </p>
        </div>
      </>
    );
  }

  /* ── Status badge colours ────────────────────────────────────── */
  const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
    paid: {
      bg:   isDark ? "rgba(51,214,159,0.1)"   : "#EAFAF4",
      text: "#33D69F",
      dot:  "#33D69F",
    },
    pending: {
      bg:   isDark ? "rgba(255,143,0,0.1)"    : "#FFF4E5",
      text: "#FF8F00",
      dot:  "#FF8F00",
    },
    draft: {
      bg:   isDark ? "rgba(223,227,250,0.05)" : "#F4F4F8",
      text: isDark ? "#DFE3FA" : "#373B53",
      dot:  isDark ? "#DFE3FA" : "#373B53",
    },
  };

  /* ── List ────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        .inv-card {
          border-radius: 16px;
          padding: 20px 24px;
          display: grid;
          align-items: center;
          cursor: pointer;
          margin-bottom: 12px;
          border: 1px solid transparent;
          transition: all 0.18s ease;
          /* Desktop columns: id | due | client | amount | badge | arrow */
          grid-template-columns: 80px 1fr auto auto 110px 14px;
          gap: 16px;
        }
        .inv-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          border-color: rgba(124,93,250,0.3) !important;
        }
        .inv-card:focus-visible {
          outline: 2px solid #7C5DFA;
          outline-offset: 3px;
          border-radius: 16px;
        }

        /* Tablet: hide due date column */
        @media (max-width: 640px) {
          .inv-card {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            gap: 8px 12px;
            padding: 16px 20px;
          }
          .inv-card-due    { display: none; }
          .inv-card-arrow  { display: none; }
          /* ID top-left, amount top-right */
          .inv-card-id     { grid-column: 1; grid-row: 1; }
          .inv-card-amount { grid-column: 2; grid-row: 1; text-align: right; }
          /* Client bottom-left, badge bottom-right */
          .inv-card-client { grid-column: 1; grid-row: 2; }
          .inv-card-badge  { grid-column: 2; grid-row: 2; justify-self: end; }
        }
      `}</style>

      <div role="list" aria-label="Invoice list">
        {invoices.map((inv) => {
          const st = statusStyle[inv.status] ?? statusStyle.draft;
          return (
            <div
              key={inv.id}
              className="inv-card"
              role="listitem"
              tabIndex={0}
              aria-label={`Invoice ${inv.id}, ${inv.client.name}, £${Number(inv.grandTotal).toFixed(2)}, ${inv.status}`}
              style={{
                background: cardBg,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              onClick={() => navigate(`/invoice/${encodeURIComponent(inv.id)}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/invoice/${encodeURIComponent(inv.id)}`);
                }
              }}
            >
              {/* ID */}
              <span
                className="inv-card-id"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: txtPrim,
                }}
              >
                <span style={{ color: "#7C5DFA" }} aria-hidden="true">#</span>
                {inv.id}
              </span>

              {/* Due */}
              <span
                className="inv-card-due"
                style={{ fontSize: 12, color: txtSec }}
              >
                Due {inv.paymentTerms}
              </span>

              {/* Client */}
              <span
                className="inv-card-client"
                style={{ fontSize: 13, color: txtSec }}
              >
                {inv.client.name}
              </span>

              {/* Amount */}
              <span
                className="inv-card-amount"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: txtPrim,
                }}
              >
                £ {Number(inv.grandTotal).toFixed(2)}
              </span>

              {/* Status badge */}
              <span
                className="inv-card-badge"
                role="status"
                aria-label={`Status: ${inv.status}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  background: st.bg,
                  color: st.text,
                  justifyContent: "center",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: st.dot,
                    flexShrink: 0,
                  }}
                />
                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
              </span>

              {/* Arrow */}
              <span  className="inv-card-arrow"
                color="#7C5DFA"
                aria-hidden="true">
                    <FaChevronRight
              />
              </span>
            
            </div>
          );
        })}
      </div>
    </>
  );
};
