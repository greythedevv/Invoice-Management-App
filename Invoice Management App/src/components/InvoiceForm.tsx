import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import type { Invoice, InvoiceStatus } from "../data/data";
import { useInvoices } from "../context/InvoiceContext";

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "flex-start", zIndex: 1000,
  },
  drawer: {
    width: "616px", height: "100%", background: "#fff",
    display: "flex", flexDirection: "column", marginLeft: "72px",
  },
  scrollArea: { flex: 1, overflowY: "auto", padding: "56px 56px 0 56px" },
  stickyFooter: {
    flexShrink: 0, background: "#fff", padding: "20px 56px",
    display: "flex", alignItems: "center", justifyContent: "flex-end",
    gap: "8px", boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
  },
};

const inputClass =
  "w-full border border-[#DFE3FA] rounded px-4 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] focus:ring-1 focus:ring-[#7C5DFA] mt-1.5 font-medium";
const labelClass = "block text-xs text-[#7E88C3] font-medium";

const generateId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l1 = letters[Math.floor(Math.random() * 26)];
  const l2 = letters[Math.floor(Math.random() * 26)];
  return `${l1}${l2}${Math.floor(1000 + Math.random() * 9000)}`;
};

type Item = { id: string; name: string; qty: number; price: number };

export const InvoiceForm = () => {
  const { isFormOpen, editingInvoice, closeForm, addInvoice, updateInvoice } = useInvoices();

  const [fromStreet, setFromStreet] = useState("");
  const [fromCity, setFromCity]     = useState("");
  const [fromPost, setFromPost]     = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [clientName, setClientName]   = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [toStreet, setToStreet]     = useState("");
  const [toCity, setToCity]         = useState("");
  const [toPost, setToPost]         = useState("");
  const [toCountry, setToCountry]   = useState("");
  const [invoiceDate, setInvoiceDate]   = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days");
  const [description, setDescription]   = useState("");
  const [items, setItems] = useState<Item[]>([{ id: "1", name: "", qty: 1, price: 0 }]);

  // Pre-populate or reset whenever the form opens
  useEffect(() => {
    if (!isFormOpen) return;
    if (editingInvoice) {
      const inv = editingInvoice;
      setFromStreet(inv.senderAddress.street);
      setFromCity(inv.senderAddress.city);
      setFromPost(inv.senderAddress.postcode);
      setFromCountry(inv.senderAddress.country);
      setClientName(inv.client.name);
      setClientEmail(inv.client.email);
      setToStreet(inv.client.address.street);
      setToCity(inv.client.address.city);
      setToPost(inv.client.address.postcode);
      setToCountry(inv.client.address.country);
      setInvoiceDate(inv.invoiceDate);
      setPaymentTerms(inv.paymentTerms);
      setDescription(inv.projectDescription);
      setItems(inv.items.map((it, i) => ({
        id: String(i), name: it.itemName, qty: it.quantity, price: it.price,
      })));
    } else {
      setFromStreet(""); setFromCity(""); setFromPost(""); setFromCountry("");
      setClientName(""); setClientEmail("");
      setToStreet(""); setToCity(""); setToPost(""); setToCountry("");
      setInvoiceDate(""); setPaymentTerms("Net 30 Days"); setDescription("");
      setItems([{ id: "1", name: "", qty: 1, price: 0 }]);
    }
  }, [isFormOpen, editingInvoice]);

  if (!isFormOpen) return null;

  const isEditing = !!editingInvoice;

  const addItem = () =>
    setItems((prev) => [...prev, { id: Date.now().toString(), name: "", qty: 1, price: 0 }]);

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const updateItem = (id: string, field: keyof Item, value: string | number) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));

  const buildInvoice = (status: InvoiceStatus): Invoice => {
    const invoiceItems = items.map((item) => ({
      itemName: item.name, quantity: item.qty, price: item.price,
      total: item.qty * item.price,
    }));
    return {
      id: editingInvoice?.id ?? generateId(),
      status: editingInvoice?.status ?? status,
      senderAddress: { street: fromStreet, city: fromCity, postcode: fromPost, country: fromCountry },
      client: {
        name: clientName, email: clientEmail,
        address: { street: toStreet, city: toCity, postcode: toPost, country: toCountry },
      },
      invoiceDate, paymentTerms, projectDescription: description,
      items: invoiceItems,
      grandTotal: invoiceItems.reduce((sum, i) => sum + i.total, 0),
    };
  };

  const handleSave = (asDraft = false) => {
    if (isEditing) {
      updateInvoice(buildInvoice(editingInvoice.status));
    } else {
      addInvoice(buildInvoice(asDraft ? "draft" : "pending"));
    }
    closeForm();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        <div style={styles.scrollArea}>
          <h2 className="text-2xl font-bold text-[#0C0E16] mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
            {isEditing ? <><span className="text-[#888EB0]">Edit </span><span className="text-[#7C5DFA]">#</span>{editingInvoice.id}</> : "New Invoice"}
          </h2>
          <div className="mb-8" />

          {/* Bill From */}
          <section className="mb-10">
            <p className="text-xs font-bold text-[#7C5DFA] mb-6 tracking-wide">Bill From</p>
            <div className="mb-4">
              <label className={labelClass}>Street Address
                <input type="text" className={inputClass} value={fromStreet} onChange={(e) => setFromStreet(e.target.value)} />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className={labelClass}>City<input type="text" className={inputClass} value={fromCity} onChange={(e) => setFromCity(e.target.value)} /></label>
              <label className={labelClass}>Post Code<input type="text" className={inputClass} value={fromPost} onChange={(e) => setFromPost(e.target.value)} /></label>
              <label className={labelClass}>Country<input type="text" className={inputClass} value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} /></label>
            </div>
          </section>

          {/* Bill To */}
          <section className="mb-10">
            <p className="text-xs font-bold text-[#7C5DFA] mb-6 tracking-wide">Bill To</p>
            <div className="mb-4">
              <label className={labelClass}>Client's Name<input type="text" className={inputClass} value={clientName} onChange={(e) => setClientName(e.target.value)} /></label>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Client's Email
                <input type="email" className={inputClass} placeholder="e.g. email@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Street Address<input type="text" className={inputClass} value={toStreet} onChange={(e) => setToStreet(e.target.value)} /></label>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <label className={labelClass}>City<input type="text" className={inputClass} value={toCity} onChange={(e) => setToCity(e.target.value)} /></label>
              <label className={labelClass}>Post Code<input type="text" className={inputClass} value={toPost} onChange={(e) => setToPost(e.target.value)} /></label>
              <label className={labelClass}>Country<input type="text" className={inputClass} value={toCountry} onChange={(e) => setToCountry(e.target.value)} /></label>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <label className={labelClass}>Invoice Date
                <input type="date" className={inputClass} value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </label>
              <label className={labelClass}>Payment Terms
                <select className={inputClass} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                  <option>Net 1 Day</option>
                  <option>Net 7 Days</option>
                  <option>Net 14 Days</option>
                  <option>Net 30 Days</option>
                </select>
              </label>
            </div>
            <div>
              <label className={labelClass}>Project Description
                <input type="text" className={inputClass} placeholder="e.g. Graphic Design Service" value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
            </div>
          </section>

          {/* Item List */}
          <section className="mb-6">
            <p className="text-lg font-bold text-[#777F98] mb-6">Item List</p>
            <div className="grid gap-4 mb-3 px-1" style={{ gridTemplateColumns: "1fr 60px 100px 70px 20px" }}>
              <span className="text-xs text-[#7E88C3] font-medium">Item Name</span>
              <span className="text-xs text-[#7E88C3] font-medium">Qty.</span>
              <span className="text-xs text-[#7E88C3] font-medium">Price</span>
              <span className="text-xs text-[#7E88C3] font-medium">Total</span>
              <span />
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid gap-4 mb-4 items-center" style={{ gridTemplateColumns: "1fr 60px 100px 70px 20px" }}>
                <input type="text" value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="border border-[#DFE3FA] rounded px-3 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] font-medium" />
                <input type="number" value={item.qty} min={1}
                  onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                  className="border border-[#DFE3FA] rounded px-3 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] font-medium text-center" />
                <input type="number" value={item.price} min={0}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                  className="border border-[#DFE3FA] rounded px-3 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] font-medium" />
                <span className="text-sm font-bold text-[#888EB0]">{(item.qty * item.price).toFixed(2)}</span>
                <button onClick={() => removeItem(item.id)} className="text-[#888EB0] hover:text-[#EC5757] transition-colors">
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                    <path d="M11.583 3H9.5V2.25A2.253 2.253 0 007.25 0h-1.5A2.253 2.253 0 003.5 2.25V3H1.417A1.417 1.417 0 000 4.417v.583c0 .322.261.583.583.583H.792l.767 8.823A1.416 1.416 0 002.97 15.5h7.062a1.415 1.415 0 001.41-1.094L12.208 5.583h.209A.583.583 0 0013 5v-.583A1.417 1.417 0 0011.583 3zM4.667 2.25A1.085 1.085 0 015.75 1.167h1.5A1.085 1.085 0 018.333 2.25V3H4.667V2.25zm6.122 12.082a.25.25 0 01-.247.251H2.97a.25.25 0 01-.248-.251L1.96 5.583h9.08l-.25 8.749z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            ))}
            <button onClick={addItem} className="w-full mt-2 py-4 rounded-full bg-[#F9FAFE] text-[#7E88C3] text-sm font-bold hover:bg-[#DFE3FA] transition-colors">
              + Add New Item
            </button>
          </section>
          <div className="h-6" />
        </div>

        {/* Sticky footer */}
        <div style={styles.stickyFooter}>
          {isEditing ? (
            <>
              <button onClick={closeForm} className="px-6 py-4 rounded-full bg-[#F9FAFE] text-[#7E88C3] text-sm font-bold hover:bg-[#DFE3FA] transition-colors">Cancel</button>
              <button onClick={() => handleSave(false)} className="px-6 py-4 rounded-full bg-[#7C5DFA] text-white text-sm font-bold hover:bg-[#9277FF] transition-colors">Save Changes</button>
            </>
          ) : (
            <>
              <button onClick={closeForm} className="px-6 py-4 rounded-full bg-[#F9FAFE] text-[#7E88C3] text-sm font-bold hover:bg-[#DFE3FA] transition-colors">Discard</button>
              <button onClick={() => handleSave(true)} className="px-6 py-4 rounded-full bg-[#373B53] text-[#888EB0] text-sm font-bold hover:bg-[#0C0E16] transition-colors">Save as Draft</button>
              <button onClick={() => handleSave(false)} className="px-6 py-4 rounded-full bg-[#7C5DFA] text-white text-sm font-bold hover:bg-[#9277FF] transition-colors">Save &amp; Send</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
