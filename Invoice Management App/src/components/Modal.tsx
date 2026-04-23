import { useEffect, useRef } from "react";
import { useInvoices } from "../context/InvoiceContext";

interface Props {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({ invoiceId, onConfirm, onCancel }: Props) => {
  const { isDark } = useInvoices();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus cancel button on mount
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // ESC key closes modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      // Focus trap: Tab cycles between cancel and confirm only
      if (e.key === "Tab") {
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLButtonElement[];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const bg      = isDark ? "#1E2139" : "#fff";
  const txtPrim = isDark ? "#fff"    : "#0C0E16";
  const txtSec  = isDark ? "#DFE3FA" : "#888EB0";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2000, padding: "0 24px",
      }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.94) translateY(12px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        .del-modal { animation: modalIn 0.22s cubic-bezier(.22,.68,0,1.2) both; }
        .del-btn {
          padding: 14px 24px; border-radius: 9999px; border: none;
          cursor: pointer; font-size: 13px; font-weight: 700;
          transition: all 0.18s ease; font-family: 'Syne', sans-serif;
        }
        .del-btn:hover  { transform: translateY(-1px); opacity: 0.9; }
        .del-btn:active { transform: translateY(0); }
        .del-btn:focus-visible { outline: 2px solid #7C5DFA; outline-offset: 3px; }
      `}</style>

      <div
        className="del-modal"
        style={{
          background: bg, borderRadius: 16, padding: "48px",
          maxWidth: 480, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h2 id="modal-title" style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24,
          color: txtPrim, margin: "0 0 16px",
        }}>
          Confirm Deletion
        </h2>
        <p id="modal-desc" style={{ fontSize: 13, color: txtSec, lineHeight: 1.7, margin: "0 0 32px" }}>
          Are you sure you want to delete invoice <strong style={{ color: txtPrim }}>#{invoiceId}</strong>?
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            ref={cancelRef}
            className="del-btn"
            onClick={onCancel}
            style={{
              background: isDark ? "#252945" : "#F4F4F8",
              color: isDark ? "#DFE3FA" : "#6E7491",
            }}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            className="del-btn"
            onClick={onConfirm}
            style={{ background: "#EC5757", color: "#fff" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
