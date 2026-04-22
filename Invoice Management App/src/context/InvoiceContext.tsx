import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { invoices as initialInvoices } from "../data/data";
import type { Invoice } from "../data/data";

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  isFormOpen: boolean;
  editingInvoice: Invoice | null;
  openNewForm: () => void;
  openEditForm: (invoice: Invoice) => void;
  closeForm: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | null>(null);

const STORAGE_KEY = "invoice-app-invoices";
const THEME_KEY = "invoice-app-theme";

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  // Load invoices from localStorage, fall back to hardcoded data
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialInvoices;
    } catch {
      return initialInvoices;
    }
  });

  // Load theme preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem(THEME_KEY) === "dark";
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Persist invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  const addInvoice = (invoice: Invoice) => setInvoices((prev) => [invoice, ...prev]);

  const updateInvoice = (updated: Invoice) =>
    setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));

  const deleteInvoice = (id: string) =>
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));

  const markAsPaid = (id: string) =>
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );

  const openNewForm = () => { setEditingInvoice(null); setIsFormOpen(true); };
  const openEditForm = (invoice: Invoice) => { setEditingInvoice(invoice); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingInvoice(null); };
  const toggleDark = () => setIsDark((v) => !v);

  return (
    <InvoiceContext.Provider value={{
      invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid,
      isFormOpen, editingInvoice, openNewForm, openEditForm, closeForm,
      isDark, toggleDark,
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error("useInvoices must be used inside InvoiceProvider");
  return ctx;
};
