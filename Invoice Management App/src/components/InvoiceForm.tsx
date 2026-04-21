import { useState } from "react";
import type { CSSProperties } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Item = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

const SIDEBAR_WIDTH = 80;

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "flex-start",
    zIndex: 1000,
  },
  drawer: {
    width: "616px",
    height: "100%",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    marginLeft: `${SIDEBAR_WIDTH}px`,
  },
  scrollArea: {
    flex: 1,
    overflowY: "auto",
    padding: "56px 56px 0 56px",
  },
  stickyFooter: {
    flexShrink: 0,
    background: "#fff",
    padding: "20px 56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
  },
};

const inputClass =
  "w-full border border-[#DFE3FA] rounded px-4 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] focus:ring-1 focus:ring-[#7C5DFA] mt-1.5 font-medium";

const labelClass = "block text-xs text-[#7E88C3] font-medium";

export const InvoiceForm = ({ isOpen, onClose }: Props) => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "", qty: 1, price: 0 },
  ]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", qty: 1, price: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        {/* Scrollable content */}
        <div style={styles.scrollArea}>
          <h2 className="text-2xl font-bold text-[#0C0E16] mb-10">New Invoice</h2>

          {/* Bill From */}
          <section className="mb-10">
            <p className="text-xs font-bold text-[#7C5DFA] mb-6 tracking-wide">Bill From</p>
            <div className="mb-4">
              <label className={labelClass}>
                Street Address
                <input type="text" className={inputClass} />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className={labelClass}>
                City
                <input type="text" className={inputClass} />
              </label>
              <label className={labelClass}>
                Post Code
                <input type="text" className={inputClass} />
              </label>
              <label className={labelClass}>
                Country
                <input type="text" className={inputClass} />
              </label>
            </div>
          </section>

          {/* Bill To */}
          <section className="mb-10">
            <p className="text-xs font-bold text-[#7C5DFA] mb-6 tracking-wide">Bill To</p>
            <div className="mb-4">
              <label className={labelClass}>
                Client's Name
                <input type="text" className={inputClass} />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelClass}>
                Client's Email
                <input
                  type="email"
                  className={inputClass}
                  placeholder="e.g. email@example.com"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className={labelClass}>
                Street Address
                <input type="text" className={inputClass} />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <label className={labelClass}>
                City
                <input type="text" className={inputClass} />
              </label>
              <label className={labelClass}>
                Post Code
                <input type="text" className={inputClass} />
              </label>
              <label className={labelClass}>
                Country
                <input type="text" className={inputClass} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <label className={labelClass}>
                Invoice Date
                <input type="date" className={inputClass} />
              </label>
              <label className={labelClass}>
                Payment Terms
                <select className={inputClass}>
                  <option>Net 1 Day</option>
                  <option>Net 7 Days</option>
                  <option>Net 14 Days</option>
                  <option selected>Net 30 Days</option>
                </select>
              </label>
            </div>
            <div>
              <label className={labelClass}>
                Project Description
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Graphic Design Service"
                />
              </label>
            </div>
          </section>

          {/* Item List */}
          <section className="mb-6">
            <p className="text-lg font-bold text-[#777F98] mb-6">Item List</p>

            {/* Header row */}
            <div className="grid gap-4 mb-3" style={{ gridTemplateColumns: "1fr 60px 100px 70px 20px" }}>
              <span className="text-xs text-[#7E88C3] font-medium">Item Name</span>
              <span className="text-xs text-[#7E88C3] font-medium">Qty.</span>
              <span className="text-xs text-[#7E88C3] font-medium">Price</span>
              <span className="text-xs text-[#7E88C3] font-medium">Total</span>
              <span />
            </div>

            {/* Item rows */}
            {items.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 mb-4 items-center"
                style={{ gridTemplateColumns: "1fr 60px 100px 70px 20px" }}
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="border border-[#DFE3FA] rounded px-3 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] font-medium"
                />
                <input
                  type="number"
                  value={item.qty}
                  min={1}
                  onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))}
                  className="border border-[#DFE3FA] rounded px-3 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] font-medium text-center"
                />
                <input
                  type="number"
                  value={item.price}
                  min={0}
                  onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                  className="border border-[#DFE3FA] rounded px-3 py-3 text-sm text-[#0C0E16] outline-none focus:border-[#7C5DFA] font-medium"
                />
                <span className="text-sm font-bold text-[#888EB0]">
                  {(item.qty * item.price).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#888EB0] hover:text-[#EC5757] transition-colors flex items-center justify-center"
                  title="Remove item"
                >
                  {/* Trash icon */}
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                    <path
                      d="M11.583 3H9.5V2.25A2.253 2.253 0 007.25 0h-1.5A2.253 2.253 0 003.5 2.25V3H1.417A1.417 1.417 0 000 4.417v.583c0 .322.261.583.583.583H.792l.767 8.823A1.416 1.416 0 002.97 15.5h7.062a1.415 1.415 0 001.41-1.094L12.208 5.583h.209A.583.583 0 0013 5v-.583A1.417 1.417 0 0011.583 3zM4.667 2.25A1.085 1.085 0 015.75 1.167h1.5A1.085 1.085 0 018.333 2.25V3H4.667V2.25zm6.122 12.082a.25.25 0 01-.247.251H2.97a.25.25 0 01-.248-.251L1.96 5.583h9.08l-.25 8.749z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {/* Add New Item */}
            <button
              onClick={addItem}
              className="w-full mt-2 py-4 rounded-full bg-[#F9FAFE] text-[#7E88C3] text-sm font-bold hover:bg-[#DFE3FA] transition-colors"
            >
              + Add New Item
            </button>
          </section>

          {/* Spacer so content doesn't sit right against footer */}
          <div className="h-6" />
        </div>

        {/* Sticky footer */}
        <div style={styles.stickyFooter}>
          <button
            onClick={onClose}
            className="px-6 py-4 rounded-full bg-[#F9FAFE] text-[#7E88C3] text-sm font-bold hover:bg-[#DFE3FA] transition-colors"
          >
            Discard
          </button>
          <button className="px-6 py-4 rounded-full bg-[#373B53] text-[#888EB0] text-sm font-bold hover:bg-[#0C0E16] transition-colors">
            Save as Draft
          </button>
          <button className="px-6 py-4 rounded-full bg-[#7C5DFA] text-white text-sm font-bold hover:bg-[#9277FF] transition-colors">
            Save &amp; Send
          </button>
        </div>
      </div>
    </div>
  );
};
