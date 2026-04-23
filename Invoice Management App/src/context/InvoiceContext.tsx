import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { invoices as initialInvoices } from "../data/data";
import type { Invoice } from "../data/data";

// ── Types ──────────────────────────────────────────────────────────────────

interface InvoiceContextType {
  // Data
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;

  // Form overlay
  isFormOpen: boolean;
  editingInvoice: Invoice | null;
  openNewForm: () => void;
  openEditForm: (invoice: Invoice) => void;
  closeForm: () => void;

  // Theme
  isDark: boolean;
  toggleDark: () => void;
}

// ── Storage keys ───────────────────────────────────────────────────────────

const INVOICES_KEY = "invoice-app-invoices";
const THEME_KEY    = "invoice-app-theme";

// ── CSS variables injected into :root for full-site theming ───────────────

const LIGHT = `
  --bg-page:       #F8F8FB;
  --bg-card:       #FFFFFF;
  --bg-input:      #FFFFFF;
  --bg-sidebar:    #1E2139;
  --bg-item-row:   #F9FAFE;
  --text-primary:  #0C0E16;
  --text-secondary:#888EB0;
  --text-label:    #7E88C3;
  --border-input:  #DFE3FA;
  --btn-ghost-bg:  #F4F4F8;
  --btn-ghost-txt: #6E7491;
  --btn-draft-bg:  #373B53;
  --btn-draft-txt: #888EB0;
  --total-bg1:     #1E2139;
  --total-bg2:     #252945;
  --filter-bg:     #FFFFFF;
  --filter-shadow: rgba(0,0,0,0.14);
`;

const DARK = `
  --bg-page:       #141625;
  --bg-card:       #1E2139;
  --bg-input:      #252945;
  --bg-sidebar:    #141625;
  --bg-item-row:   #252945;
  --text-primary:  #FFFFFF;
  --text-secondary:#DFE3FA;
  --text-label:    #888EB0;
  --border-input:  #252945;
  --btn-ghost-bg:  #252945;
  --btn-ghost-txt: #DFE3FA;
  --btn-draft-bg:  #373B53;
  --btn-draft-txt: #DFE3FA;
  --total-bg1:     #0C0E16;
  --total-bg2:     #141625;
  --filter-bg:     #252945;
  --filter-shadow: rgba(0,0,0,0.4);
`;

function applyTheme(dark: boolean) {
  // Inject or update a <style> tag in <head> with CSS custom properties
  let styleEl = document.getElementById("inv-theme") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "inv-theme";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `:root { ${dark ? DARK : LIGHT} }`;
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}

// ── Context ────────────────────────────────────────────────────────────────

const InvoiceContext = createContext<InvoiceContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {

  // Load invoices from localStorage, fall back to seed data
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const stored = localStorage.getItem(INVOICES_KEY);
      return stored ? (JSON.parse(stored) as Invoice[]) : initialInvoices;
    } catch {
      return initialInvoices;
    }
  });

  // Load theme preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(THEME_KEY) === "dark";
  });

  // Form state
  const [isFormOpen, setIsFormOpen]       = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Persist invoices whenever they change
  useEffect(() => {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  }, [invoices]);

  // Apply theme CSS vars whenever isDark changes (and on first mount)
  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  // ── Invoice actions ──────────────────────────────────────────────────────

  const addInvoice = (invoice: Invoice) =>
    setInvoices((prev) => [invoice, ...prev]);

  const updateInvoice = (updated: Invoice) =>
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updated.id ? updated : inv))
    );

  const deleteInvoice = (id: string) =>
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));

  const markAsPaid = (id: string) =>
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );

  // ── Form actions ─────────────────────────────────────────────────────────

  const openNewForm = () => {
    setEditingInvoice(null);
    setIsFormOpen(true);
  };

  const openEditForm = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  // ── Theme action ─────────────────────────────────────────────────────────

  const toggleDark = () => setIsDark((prev) => !prev);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        isFormOpen,
        editingInvoice,
        openNewForm,
        openEditForm,
        closeForm,
        isDark,
        toggleDark,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────

export const useInvoices = (): InvoiceContextType => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) {
    throw new Error("useInvoices must be used inside <InvoiceProvider>");
  }
  return ctx;
};
