import { Sidebar } from "../components/sidebar"
import { useParams, useNavigate } from "react-router-dom"
import { FaLessThan } from "react-icons/fa6"
import { useInvoices } from "../context/InvoiceContext"

export const InvoiceDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { invoices, deleteInvoice, markAsPaid, openEditForm } = useInvoices()

  if (!id) return <p>No invoice ID found</p>

  const invoice = invoices.find((inv) => inv.id === decodeURIComponent(id))
  if (!invoice) return <p>Invoice not found</p>

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    navigate("/")
  }

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    paid:    { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    pending: { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-500"   },
    draft:   { bg: "bg-slate-100",  text: "text-slate-500",   dot: "bg-slate-400"   },
  }
  const status = statusConfig[invoice.status] ?? statusConfig.draft

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .inv-root * { font-family: 'DM Sans', sans-serif; }
        .inv-root .syne { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.13s; }
        .inv-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 22px; border-radius: 9999px;
          font-size: 13px; font-weight: 600; letter-spacing: 0.01em;
          transition: all 0.18s ease; cursor: pointer; border: none;
        }
        .inv-btn:hover { transform: translateY(-1px); }
        .inv-btn:active { transform: translateY(0); }
        .btn-ghost  { background: #F4F4F8; color: #6E7491; }
        .btn-ghost:hover  { background: #E4E4EF; }
        .btn-danger { background: #FDEAEA; color: #D9534F; }
        .btn-danger:hover { background: #FBCFCF; }
        .btn-primary { background: #7C5DFA; color: #fff; box-shadow: 0 4px 14px rgba(124,93,250,0.35); }
        .btn-primary:hover { background: #9277FF; box-shadow: 0 6px 18px rgba(124,93,250,0.45); }
        .item-row:hover { background: rgba(124,93,250,0.04); border-radius: 8px; }
        .grand-total-card {
          background: linear-gradient(135deg, #1E2139 0%, #252945 100%);
          border-radius: 12px; padding: 20px 24px;
        }
      `}</style>

      <div className="inv-root flex h-screen bg-[#F8F8FB]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-10">
          <div className="max-w-2xl mx-auto">

            {/* Back */}
            <button onClick={() => navigate(-1)}
              className="fade-up flex items-center gap-2.5 mb-8 text-sm font-semibold text-[#0C0E16] hover:text-[#7C5DFA] transition-colors syne">
              <FaLessThan size={10} /> Go back
            </button>

            {/* Status Bar */}
            <div className="fade-up fade-up-1 flex justify-between items-center bg-white rounded-2xl px-6 py-5 shadow-sm mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#888EB0]">Status</span>
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.text}`}>
                  <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="inv-btn btn-ghost" onClick={() => openEditForm(invoice)}>Edit</button>
                <button className="inv-btn btn-danger" onClick={handleDelete}>Delete</button>
                {invoice.status !== "paid" && (
                  <button className="inv-btn btn-primary" onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
                )}
              </div>
            </div>

            {/* Main Card */}
            <div className="fade-up fade-up-2 bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-lg font-bold text-[#0C0E16] syne tracking-tight">
                    <span className="text-[#7C5DFA]">#</span>{invoice.id}
                  </p>
                  <p className="text-sm text-[#888EB0] mt-1">{invoice.projectDescription}</p>
                </div>
                <div className="text-right text-sm text-[#7E88C3] leading-6">
                  <p>{invoice.senderAddress.street}</p>
                  <p>{invoice.senderAddress.city}</p>
                  <p>{invoice.senderAddress.postcode}</p>
                  <p>{invoice.senderAddress.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 mb-10">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#888EB0] mb-2">Invoice Date</p>
                  <p className="font-semibold text-[#0C0E16] syne">{invoice.invoiceDate}</p>
                  <p className="text-xs uppercase tracking-widest text-[#888EB0] mt-6 mb-2">Payment Due</p>
                  <p className="font-semibold text-[#0C0E16] syne">{invoice.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#888EB0] mb-2">Bill To</p>
                  <p className="font-semibold text-[#0C0E16] syne mb-1">{invoice.client.name}</p>
                  <p className="text-sm text-[#7E88C3] leading-6">
                    {invoice.client.address.street}<br />
                    {invoice.client.address.city}<br />
                    {invoice.client.address.postcode}<br />
                    {invoice.client.address.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#888EB0] mb-2">Sent To</p>
                  <p className="font-semibold text-[#0C0E16] syne break-all">{invoice.client.email}</p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-[#F9FAFE] rounded-2xl overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <div className="grid text-xs uppercase tracking-widest text-[#888EB0] mb-4 px-2"
                    style={{ gridTemplateColumns: "1fr 60px 100px 100px" }}>
                    <span>Item Name</span>
                    <span className="text-center">Qty.</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Total</span>
                  </div>
                  <div className="space-y-1">
                    {invoice.items.map((item, i) => (
                      <div key={i} className="item-row grid items-center py-3 px-2 transition-colors"
                        style={{ gridTemplateColumns: "1fr 60px 100px 100px" }}>
                        <span className="font-semibold text-sm text-[#0C0E16] syne">{item.itemName}</span>
                        <span className="text-center text-sm text-[#888EB0] font-medium">{item.quantity}</span>
                        <span className="text-right text-sm text-[#888EB0]">£ {Number(item.price).toFixed(2)}</span>
                        <span className="text-right text-sm font-bold text-[#0C0E16]">£ {Number(item.total).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grand-total-card flex justify-between items-center">
                  <span className="text-sm text-[#DFE3FA]">Amount Due</span>
                  <span className="text-2xl font-bold text-white syne tracking-tight">
                    £ {Number(invoice.grandTotal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
