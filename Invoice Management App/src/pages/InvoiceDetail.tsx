import { useState } from "react"
import { Sidebar } from "../components/sidebar"
import { useParams, useNavigate } from "react-router-dom"
import { FaChevronLeft } from "react-icons/fa"
import { useInvoices } from "../context/InvoiceContext"
import { DeleteModal } from "../components/Modal"

export const InvoiceDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { invoices, deleteInvoice, markAsPaid, openEditForm, isDark } = useInvoices()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  if (!id) return <p>No invoice ID found</p>
  const invoice = invoices.find(inv => inv.id === decodeURIComponent(id))
  if (!invoice) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh",
      fontFamily:"Syne,sans-serif", fontSize:18, color:"#888EB0" }}>
      Invoice not found. <button onClick={() => navigate("/")}
        style={{ marginLeft:12, color:"#7C5DFA", background:"none", border:"none",
          cursor:"pointer", fontWeight:700, fontSize:18 }}>Go back</button>
    </div>
  )

  const handleConfirmDelete = () => {
    deleteInvoice(invoice.id)
    navigate("/")
  }

  const txtPrim = isDark ? "var(--text-primary)"   : "#0C0E16"
  const txtSec  = isDark ? "var(--text-secondary)"  : "#7E88C3"
  const cardBg  = isDark ? "var(--bg-card)"         : "#fff"
  const itemBg  = isDark ? "var(--bg-item-row)"     : "#F9FAFE"

  const statusConfig: Record<string, { bg:string; text:string; dot:string }> = {
    paid:    { bg: isDark ? "rgba(51,214,159,0.1)"  : "#EAFAF4", text:"#33D69F",  dot:"#33D69F"  },
    pending: { bg: isDark ? "rgba(255,143,0,0.1)"   : "#FFF4E5", text:"#FF8F00",  dot:"#FF8F00"  },
    draft:   { bg: isDark ? "rgba(223,227,250,0.05)": "#F4F4F8",
               text: isDark ? "#DFE3FA" : "#373B53", dot: isDark ? "#DFE3FA" : "#373B53" },
  }
  const s = statusConfig[invoice.status] ?? statusConfig.draft

  const btnGhost   = { background: isDark ? "#252945" : "#F4F4F8", color: isDark ? "#DFE3FA" : "#6E7491" }
  const btnDanger  = { background: isDark ? "rgba(236,87,87,0.15)" : "#FDEAEA", color:"#EC5757" }
  const btnPrimary = { background:"#7C5DFA", color:"#fff", boxShadow:"0 4px 14px rgba(124,93,250,0.35)" }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .inv-det * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
        .inv-det .syne { font-family:'Syne',sans-serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up   { animation:fadeUp 0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-1 { animation-delay:0.05s; }
        .fade-up-2 { animation-delay:0.13s; }

        /* Layout */
        .inv-det-layout {
          display:flex; min-height:100vh; overflow-x:hidden;
        }
        @media (max-width:767px) {
          .inv-det-layout { flex-direction:column; }
        }

        .inv-det-main {
          flex:1; overflow-y:auto; overflow-x:hidden;
          padding:40px 24px;
          transition:background 0.25s;
        }
        @media (min-width:640px) { .inv-det-main { padding:56px 48px; } }

        .inv-det-inner { max-width:680px; margin:0 auto; width:100%; }

        /* Buttons */
        .inv-det-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:12px 20px; border-radius:9999px; font-size:13px; font-weight:600;
          border:none; cursor:pointer; transition:all 0.18s ease;
          font-family:'Syne',sans-serif;
        }
        .inv-det-btn:hover  { transform:translateY(-1px); opacity:0.88; }
        .inv-det-btn:active { transform:translateY(0); }
        .inv-det-btn:focus-visible { outline:2px solid #7C5DFA; outline-offset:3px; }

        /* Status bar */
        .status-bar {
          display:flex; justify-content:space-between; align-items:center;
          border-radius:16px; padding:20px 24px; margin-bottom:16px;
          flex-wrap:wrap; gap:16px;
        }
        .status-actions { display:flex; gap:8px; flex-wrap:wrap; }

        /* Meta grid */
        .meta-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:24px; margin-bottom:40px; }
        @media (max-width:500px) { .meta-grid { grid-template-columns:1fr 1fr; } }

        /* Items table */
        .items-tbl-head { display:grid; grid-template-columns:1fr 52px 100px 100px; gap:12px; padding:0 8px; margin-bottom:12px; }
        .items-tbl-row  { display:grid; grid-template-columns:1fr 52px 100px 100px; gap:12px; padding:8px; border-radius:8px; transition:background 0.15s; }
        .items-tbl-row:hover { background:rgba(124,93,250,0.05); }
        @media (max-width:460px) {
          .items-tbl-head { grid-template-columns:1fr 36px 80px 80px; gap:8px; }
          .items-tbl-row  { grid-template-columns:1fr 36px 80px 80px; gap:8px; }
        }
      `}</style>

      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="inv-det inv-det-layout" style={{ background:"var(--bg-page)" }}>
        <Sidebar />

        <main className="inv-det-main" id="main-content">
          <div className="inv-det-inner">

            {/* Back */}
            <button
              className="fade-up"
              onClick={() => navigate(-1)}
              aria-label="Go back to invoice list"
              style={{
                display:"flex", alignItems:"center", gap:10, marginBottom:32,
                background:"none", border:"none", cursor:"pointer",
                fontSize:14, fontWeight:700, color:txtPrim,
                fontFamily:"Syne,sans-serif", padding:0,
              }}
            >
              <FaChevronLeft size={10} color="#7C5DFA" aria-hidden="true" />
              Go back
            </button>

            {/* Status bar */}
            <div className="status-bar fade-up fade-up-1"
              style={{ background:cardBg, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ fontSize:13, color:txtSec }}>Status</span>
                <span
                  role="status"
                  aria-label={`Invoice status: ${invoice.status}`}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    padding:"6px 16px", borderRadius:9999, fontSize:13, fontWeight:700,
                    background:s.bg, color:s.text,
                  }}
                >
                  <span aria-hidden="true" style={{ width:8, height:8, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>

              <div className="status-actions">
                <button className="inv-det-btn" style={btnGhost}
                  onClick={() => openEditForm(invoice)}
                  aria-label={`Edit invoice ${invoice.id}`}>
                  Edit
                </button>
                <button className="inv-det-btn" style={btnDanger}
                  onClick={() => setShowDeleteModal(true)}
                  aria-label={`Delete invoice ${invoice.id}`}>
                  Delete
                </button>
                {invoice.status !== "paid" && (
                  <button className="inv-det-btn" style={btnPrimary}
                    onClick={() => markAsPaid(invoice.id)}
                    aria-label={`Mark invoice ${invoice.id} as paid`}>
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>

            {/* Main card */}
            <article className="fade-up fade-up-2"
              aria-label={`Invoice ${invoice.id} details`}
              style={{
                background:cardBg, borderRadius:16,
                padding:"32px 24px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
              }}>

              {/* ID + sender */}
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:32 }}>
                <div>
                  <p className="syne" style={{ fontWeight:800, fontSize:16, color:txtPrim, margin:0 }}>
                    <span style={{ color:"#7C5DFA" }} aria-hidden="true">#</span>
                    <span aria-label={`Invoice ID: ${invoice.id}`}>{invoice.id}</span>
                  </p>
                  <p style={{ fontSize:13, color:txtSec, marginTop:4, margin:"4px 0 0" }}>{invoice.projectDescription}</p>
                </div>
                <address style={{ textAlign:"right", fontSize:13, color:txtSec, lineHeight:1.8, fontStyle:"normal" }}>
                  <p style={{margin:0}}>{invoice.senderAddress.street}</p>
                  <p style={{margin:0}}>{invoice.senderAddress.city}</p>
                  <p style={{margin:0}}>{invoice.senderAddress.postcode}</p>
                  <p style={{margin:0}}>{invoice.senderAddress.country}</p>
                </address>
              </div>

              {/* Meta */}
              <div className="meta-grid">
                <div>
                  <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:txtSec, margin:"0 0 8px" }}>Invoice Date</p>
                  <p className="syne" style={{ fontWeight:700, color:txtPrim, margin:0 }}>{invoice.invoiceDate}</p>
                  <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:txtSec, margin:"20px 0 8px" }}>Payment Due</p>
                  <p className="syne" style={{ fontWeight:700, color:txtPrim, margin:0 }}>{invoice.paymentTerms}</p>
                </div>
                <div>
                  <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:txtSec, margin:"0 0 8px" }}>Bill To</p>
                  <p className="syne" style={{ fontWeight:700, color:txtPrim, margin:"0 0 6px" }}>{invoice.client.name}</p>
                  <address style={{ fontSize:13, color:txtSec, lineHeight:1.8, fontStyle:"normal", margin:0 }}>
                    {invoice.client.address.street}<br/>
                    {invoice.client.address.city}<br/>
                    {invoice.client.address.postcode}<br/>
                    {invoice.client.address.country}
                  </address>
                </div>
                <div>
                  <p style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:txtSec, margin:"0 0 8px" }}>Sent To</p>
                  <a href={`mailto:${invoice.client.email}`} className="syne"
                    style={{ fontWeight:700, color:txtPrim, wordBreak:"break-all", textDecoration:"none" }}>
                    {invoice.client.email}
                  </a>
                </div>
              </div>

              {/* Items table */}
              <section aria-label="Invoice items">
                <div style={{ background:itemBg, borderRadius:16, overflow:"hidden" }}>
                  <div style={{ padding:"24px 24px 16px" }}>
                    <div className="items-tbl-head" role="row">
                      {["Item Name","Qty.","Price","Total"].map(h => (
                        <span key={h} role="columnheader"
                          style={{ fontSize:11, textTransform:"uppercase", letterSpacing:1, color:txtSec, fontWeight:500 }}>
                          {h}
                        </span>
                      ))}
                    </div>
                    {invoice.items.map((item, i) => (
                      <div key={i} className="items-tbl-row" role="row">
                        <span className="syne" role="cell" style={{ fontWeight:700, fontSize:13, color:txtPrim }}>{item.itemName}</span>
                        <span role="cell" style={{ fontSize:13, color:txtSec, textAlign:"center" }}>{item.quantity}</span>
                        <span role="cell" style={{ fontSize:13, color:txtSec, textAlign:"right" }}>£ {Number(item.price).toFixed(2)}</span>
                        <span className="syne" role="cell" style={{ fontWeight:700, fontSize:13, color:txtPrim, textAlign:"right" }}>
                          £ {Number(item.total).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    background:`linear-gradient(135deg, var(--total-bg1) 0%, var(--total-bg2) 100%)`,
                    padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center",
                  }}>
                    <span style={{ fontSize:13, color:"#DFE3FA" }}>Amount Due</span>
                    <span className="syne" style={{ fontWeight:800, fontSize:24, color:"#fff" }}>
                      £ {Number(invoice.grandTotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              </section>
            </article>

          </div>
        </main>
      </div>
    </>
  )
}
