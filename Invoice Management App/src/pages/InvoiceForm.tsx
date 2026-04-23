// import { useState, useEffect } from "react";
// import type { CSSProperties } from "react";
// import type { Invoice, InvoiceStatus } from "../data/data";
// import { useInvoices } from "../context/InvoiceContext";

// const generateId = () => {
//   const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   return `${L[Math.floor(Math.random()*26)]}${L[Math.floor(Math.random()*26)]}${Math.floor(1000+Math.random()*9000)}`;
// };

// type Item = { id: string; name: string; qty: number; price: number };
// type Errors = Partial<Record<string, string>>;
// const REQUIRED = "can't be empty";

// export const InvoiceForm = () => {
//   const { isFormOpen, editingInvoice, closeForm, addInvoice, updateInvoice, isDark } = useInvoices();

//   const [fromStreet,   setFromStreet]   = useState("");
//   const [fromCity,     setFromCity]     = useState("");
//   const [fromPost,     setFromPost]     = useState("");
//   const [fromCountry,  setFromCountry]  = useState("");
//   const [clientName,   setClientName]   = useState("");
//   const [clientEmail,  setClientEmail]  = useState("");
//   const [toStreet,     setToStreet]     = useState("");
//   const [toCity,       setToCity]       = useState("");
//   const [toPost,       setToPost]       = useState("");
//   const [toCountry,    setToCountry]    = useState("");
//   const [invoiceDate,  setInvoiceDate]  = useState("");
//   const [paymentTerms, setPaymentTerms] = useState("Net 30 Days");
//   const [description,  setDescription]  = useState("");
//   const [items,        setItems]        = useState<Item[]>([{ id:"1", name:"", qty:1, price:0 }]);
//   const [errors,       setErrors]       = useState<Errors>({});
//   const [itemsError,   setItemsError]   = useState("");

//   useEffect(() => {
//     if (!isFormOpen) return;
//     if (editingInvoice) {
//       const inv = editingInvoice;
//       setFromStreet(inv.senderAddress.street);     setFromCity(inv.senderAddress.city);
//       setFromPost(inv.senderAddress.postcode);     setFromCountry(inv.senderAddress.country);
//       setClientName(inv.client.name);              setClientEmail(inv.client.email);
//       setToStreet(inv.client.address.street);      setToCity(inv.client.address.city);
//       setToPost(inv.client.address.postcode);      setToCountry(inv.client.address.country);
//       setInvoiceDate(inv.invoiceDate);             setPaymentTerms(inv.paymentTerms);
//       setDescription(inv.projectDescription);
//       setItems(inv.items.map((it, i) => ({ id: String(i), name: it.itemName, qty: it.quantity, price: it.price })));
//     } else {
//       setFromStreet(""); setFromCity(""); setFromPost(""); setFromCountry("");
//       setClientName(""); setClientEmail("");
//       setToStreet(""); setToCity(""); setToPost(""); setToCountry("");
//       setInvoiceDate(""); setPaymentTerms("Net 30 Days"); setDescription("");
//       setItems([{ id:"1", name:"", qty:1, price:0 }]);
//     }
//     setErrors({}); setItemsError("");
//   }, [isFormOpen, editingInvoice]);

//   // Close on ESC
//   useEffect(() => {
//     if (!isFormOpen) return;
//     const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeForm(); };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [isFormOpen, closeForm]);

//   if (!isFormOpen) return null;

//   const isEditing = !!editingInvoice;

//   const validate = (asDraft: boolean): boolean => {
//     if (asDraft) return true;
//     const e: Errors = {};
//     if (!fromStreet.trim())  e.fromStreet  = REQUIRED;
//     if (!fromCity.trim())    e.fromCity    = REQUIRED;
//     if (!fromPost.trim())    e.fromPost    = REQUIRED;
//     if (!fromCountry.trim()) e.fromCountry = REQUIRED;
//     if (!clientName.trim())  e.clientName  = REQUIRED;
//     if (!clientEmail.trim()) e.clientEmail = REQUIRED;
//     else if (!/\S+@\S+\.\S+/.test(clientEmail)) e.clientEmail = "must be a valid email";
//     if (!toStreet.trim())    e.toStreet    = REQUIRED;
//     if (!toCity.trim())      e.toCity      = REQUIRED;
//     if (!toPost.trim())      e.toPost      = REQUIRED;
//     if (!toCountry.trim())   e.toCountry   = REQUIRED;
//     if (!invoiceDate)        e.invoiceDate = REQUIRED;
//     if (!description.trim()) e.description = REQUIRED;

//     let iErr = "";
//     if (items.length === 0) {
//       iErr = "Add at least one item";
//     } else {
//       items.forEach(item => {
//         if (!item.name.trim())   e[`item-name-${item.id}`]  = REQUIRED;
//         if (item.qty < 1)        e[`item-qty-${item.id}`]   = "must be ≥ 1";
//         if (item.price <= 0)     e[`item-price-${item.id}`] = "must be > 0";
//       });
//     }

//     setErrors(e); setItemsError(iErr);
//     return Object.keys(e).length === 0 && !iErr;
//   };

//   const buildInvoice = (status: InvoiceStatus): Invoice => {
//     const invoiceItems = items.map(item => ({
//       itemName: item.name, quantity: item.qty, price: item.price, total: item.qty * item.price,
//     }));
//     return {
//       id: editingInvoice?.id ?? generateId(),
//       status: editingInvoice?.status ?? status,
//       senderAddress: { street:fromStreet, city:fromCity, postcode:fromPost, country:fromCountry },
//       client: { name:clientName, email:clientEmail,
//         address: { street:toStreet, city:toCity, postcode:toPost, country:toCountry } },
//       invoiceDate, paymentTerms, projectDescription:description,
//       items: invoiceItems,
//       grandTotal: invoiceItems.reduce((s, i) => s + i.total, 0),
//     };
//   };

//   const handleSave = (asDraft = false) => {
//     if (!validate(asDraft)) return;
//     if (isEditing) updateInvoice(buildInvoice(editingInvoice!.status));
//     else           addInvoice(buildInvoice(asDraft ? "draft" : "pending"));
//     closeForm();
//   };

//   const addItem    = () => setItems(p => [...p, { id:Date.now().toString(), name:"", qty:1, price:0 }]);
//   const removeItem = (id: string) => setItems(p => p.filter(i => i.id !== id));
//   const updateItem = (id: string, field: keyof Item, value: string | number) =>
//     setItems(p => p.map(i => i.id === id ? {...i, [field]:value} : i));
//   const clearErr   = (key: string) => setErrors(p => { const n={...p}; delete n[key]; return n; });

//   // ── Theme-aware values ──────────────────────────────────
//   const bg       = isDark ? "var(--bg-page)"  : "#fff";
//   const cardBg   = isDark ? "var(--bg-card)"  : "#fff";
//   const txtPrim  = isDark ? "var(--text-primary)"  : "#0C0E16";
//   const txtLabel = isDark ? "var(--text-label)"    : "#7E88C3";
//   const border   = isDark ? "var(--border-input)"  : "#DFE3FA";
//   const inputBg  = isDark ? "var(--bg-input)"      : "#fff";

//   const inputStyle = (hasErr: boolean): CSSProperties => ({
//     width:"100%", background:inputBg,
//     border:`1px solid ${hasErr ? "#EC5757" : border}`,
//     borderRadius:4, padding:"12px 16px", fontSize:13,
//     color:txtPrim, outline:"none", marginTop:6,
//     fontWeight:500, boxSizing:"border-box",
//     transition:"border-color 0.15s",
//   });

//   const labelStyle: CSSProperties = { display:"block", fontSize:12, fontWeight:500 };
//   const errTxt:    CSSProperties = { fontSize:11, color:"#EC5757", marginTop:4, display:"block" };

//   // Reusable field with label + error
//   const Field = ({
//     id, label, value, onChange, type="text", placeholder="", errKey,
//   }: {
//     id:string; label:string; value:string; onChange:(v:string)=>void;
//     type?:string; placeholder?:string; errKey:string;
//   }) => (
//     <div style={{width:"100%"}}>
//       <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
//         <label htmlFor={id} style={{ ...labelStyle, color: errors[errKey] ? "#EC5757" : txtLabel }}>
//           {label}
//         </label>
//         {errors[errKey] && <span style={errTxt} role="alert" aria-live="polite">{errors[errKey]}</span>}
//       </div>
//       <input
//         id={id} type={type} placeholder={placeholder} value={value}
//         aria-invalid={!!errors[errKey]}
//         aria-describedby={errors[errKey] ? `${id}-err` : undefined}
//         onChange={e => { onChange(e.target.value); clearErr(errKey); }}
//         style={inputStyle(!!errors[errKey])}
//         onFocus={e => { e.target.style.borderColor = errors[errKey] ? "#EC5757" : "#7C5DFA"; }}
//         onBlur={e  => { e.target.style.borderColor = errors[errKey] ? "#EC5757" : border; }}
//       />
//     </div>
//   );

//   return (
//     <>
//       <style>{`
//         .inv-form-overlay {
//           position:fixed; inset:0;
//           background:rgba(0,0,0,0.55);
//           display:flex; justify-content:flex-start;
//           z-index:1000;
//           /* Prevent body scroll when form open */
//           overflow:hidden;
//         }
//         /* Drawer */
//         .inv-drawer {
//           height:100%; display:flex; flex-direction:column;
//           overflow-x:hidden; overflow-y:hidden;
//           max-width:616px; width:100%;
//         }
//         /* Desktop: offset by sidebar width */
//         @media (min-width:768px) {
//           .inv-drawer { margin-left:72px; }
//         }
//         /* Mobile: offset by top bar height, full width */
//         @media (max-width:767px) {
//           .inv-drawer {
//             margin-top:72px;
//             max-width:100%;
//             border-radius:0 0 20px 20px;
//             /* Take remaining height below top bar */
//             height:calc(100% - 72px);
//           }
//         }

//         /* Scroll area */
//         .inv-scroll {
//           flex:1; overflow-y:auto; overflow-x:hidden;
//           padding:40px 24px 0;
//         }
//         @media (min-width:640px) { .inv-scroll { padding:56px 56px 0; } }

//         /* Footer */
//         .inv-footer {
//           flex-shrink:0;
//           padding:16px 24px;
//           display:flex; align-items:center; justify-content:flex-end;
//           gap:8px; flex-wrap:wrap;
//         }
//         @media (min-width:640px) { .inv-footer { padding:20px 56px; } }

//         /* Grid helpers */
//         .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
//         .g2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
//         @media (max-width:460px) {
//           .g3 { grid-template-columns:1fr 1fr; }
//           .g2 { grid-template-columns:1fr; }
//         }

//         /* Item row */
//         .item-grid { display:grid; gap:12px; align-items:start; grid-template-columns:1fr 52px 88px 56px 20px; }
//         .item-hdr  { display:grid; gap:12px; grid-template-columns:1fr 52px 88px 56px 20px; padding:0 2px; }
//         @media (max-width:520px) {
//           .item-grid { grid-template-columns:1fr 44px 76px 50px 20px; gap:8px; }
//           .item-hdr  { grid-template-columns:1fr 44px 76px 50px 20px; gap:8px; }
//         }
//         @media (max-width:400px) {
//           .item-grid, .item-hdr { grid-template-columns:1fr; }
//           .item-hdr  { display:none; }
//         }

//         /* Buttons */
//         .inv-btn {
//           padding:12px 20px; border-radius:9999px; border:none; cursor:pointer;
//           font-size:13px; font-weight:700; transition:all 0.18s ease;
//           white-space:nowrap; font-family:'Syne',sans-serif;
//         }
//         .inv-btn:hover  { transform:translateY(-1px); opacity:0.9; }
//         .inv-btn:active { transform:translateY(0); }
//         .inv-btn:focus-visible { outline:2px solid #7C5DFA; outline-offset:3px; }

//         /* Section title */
//         .section-title { font-size:12px; font-weight:700; color:#7C5DFA; letter-spacing:1px; margin:0 0 20px; }

//         /* Select */
//         .inv-select {
//           width:100%; padding:12px 16px; font-size:13px; font-weight:500;
//           border-radius:4px; outline:none; margin-top:6px;
//           box-sizing:border-box; cursor:pointer; transition:border-color 0.15s;
//           appearance:none; -webkit-appearance:none;
//           background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6' fill='none' stroke='%237C5DFA' stroke-width='1.5'/%3E%3C/svg%3E");
//           background-repeat:no-repeat;
//           background-position:right 16px center;
//           padding-right:40px;
//         }
//         .inv-select:focus { border-color:#7C5DFA !important; }
//       `}</style>

//       <div
//         className="inv-form-overlay"
//         role="dialog"
//         aria-modal="true"
//         aria-label={isEditing ? `Edit invoice ${editingInvoice?.id}` : "New invoice"}
//         onClick={e => { if (e.target === e.currentTarget) closeForm(); }}
//       >
//         <div className="inv-drawer" style={{ background:bg }}>

//           {/* ── Scrollable content ──────────────────────── */}
//           <div className="inv-scroll">
//             <h2 style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:24, color:txtPrim, margin:"0 0 32px" }}>
//               {isEditing
//                 ? <><span style={{color:"#888EB0"}}>Edit </span><span style={{color:"#7C5DFA"}}>#</span>{editingInvoice!.id}</>
//                 : "New Invoice"}
//             </h2>

//             {/* ── Bill From ─────────────────────────────── */}
//             <fieldset style={{ border:"none", padding:0, margin:"0 0 40px" }}>
//               <legend><p className="section-title">Bill From</p></legend>
//               <div style={{marginBottom:16}}>
//                 <Field id="fromStreet" label="Street Address" value={fromStreet} onChange={setFromStreet} errKey="fromStreet" />
//               </div>
//               <div className="g3">
//                 <Field id="fromCity"    label="City"      value={fromCity}    onChange={setFromCity}    errKey="fromCity" />
//                 <Field id="fromPost"    label="Post Code" value={fromPost}    onChange={setFromPost}    errKey="fromPost" />
//                 <Field id="fromCountry" label="Country"   value={fromCountry} onChange={setFromCountry} errKey="fromCountry" />
//               </div>
//             </fieldset>

//             {/* ── Bill To ───────────────────────────────── */}
//             <fieldset style={{ border:"none", padding:0, margin:"0 0 40px" }}>
//               <legend><p className="section-title">Bill To</p></legend>
//               <div style={{marginBottom:16}}>
//                 <Field id="clientName"  label="Client's Name"  value={clientName}  onChange={setClientName}  errKey="clientName" />
//               </div>
//               <div style={{marginBottom:16}}>
//                 <Field id="clientEmail" label="Client's Email" value={clientEmail} onChange={setClientEmail}
//                   type="email" placeholder="e.g. email@example.com" errKey="clientEmail" />
//               </div>
//               <div style={{marginBottom:16}}>
//                 <Field id="toStreet" label="Street Address" value={toStreet} onChange={setToStreet} errKey="toStreet" />
//               </div>
//               <div className="g3" style={{marginBottom:16}}>
//                 <Field id="toCity"    label="City"      value={toCity}    onChange={setToCity}    errKey="toCity" />
//                 <Field id="toPost"    label="Post Code" value={toPost}    onChange={setToPost}    errKey="toPost" />
//                 <Field id="toCountry" label="Country"   value={toCountry} onChange={setToCountry} errKey="toCountry" />
//               </div>
//               <div className="g2" style={{marginBottom:16}}>
//                 <div>
//                   <div style={{display:"flex", justifyContent:"space-between"}}>
//                     <label htmlFor="invDate" style={{ ...labelStyle, color: errors.invoiceDate ? "#EC5757" : txtLabel }}>
//                       Invoice Date
//                     </label>
//                     {errors.invoiceDate && <span style={errTxt} role="alert">{errors.invoiceDate}</span>}
//                   </div>
//                   <input id="invDate" type="date" value={invoiceDate}
//                     aria-invalid={!!errors.invoiceDate}
//                     onChange={e => { setInvoiceDate(e.target.value); clearErr("invoiceDate"); }}
//                     style={inputStyle(!!errors.invoiceDate)} />
//                 </div>
//                 <div>
//                   <label htmlFor="payTerms" style={{...labelStyle, color:txtLabel}}>Payment Terms</label>
//                   <select id="payTerms" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
//                     className="inv-select"
//                     style={{ background:inputBg, border:`1px solid ${border}`, color:txtPrim }}>
//                     <option>Net 1 Day</option>
//                     <option>Net 7 Days</option>
//                     <option>Net 14 Days</option>
//                     <option>Net 30 Days</option>
//                   </select>
//                 </div>
//               </div>
//               <Field id="description" label="Project Description" value={description} onChange={setDescription}
//                 placeholder="e.g. Graphic Design Service" errKey="description" />
//             </fieldset>

//             {/* ── Item List ─────────────────────────────── */}
//             <section aria-label="Invoice items" style={{marginBottom:24}}>
//               <p className="section-title" style={{fontSize:18, color:"#777F98"}}>Item List</p>

//               <div className="item-hdr" style={{marginBottom:8}}>
//                 {["Item Name","Qty.","Price","Total",""].map(h => (
//                   <span key={h} style={{fontSize:11, color:txtLabel, fontWeight:500}}>{h}</span>
//                 ))}
//               </div>

//               {items.map(item => (
//                 <div key={item.id} style={{marginBottom:16}}>
//                   <div className="item-grid">
//                     {/* Name */}
//                     <div>
//                       <label htmlFor={`iname-${item.id}`} className="sr-only">Item name</label>
//                       <input id={`iname-${item.id}`} value={item.name} placeholder="Item name"
//                         aria-invalid={!!errors[`item-name-${item.id}`]}
//                         onChange={e => { updateItem(item.id,"name",e.target.value); clearErr(`item-name-${item.id}`); }}
//                         style={inputStyle(!!errors[`item-name-${item.id}`])} />
//                     </div>
//                     {/* Qty */}
//                     <div>
//                       <label htmlFor={`iqty-${item.id}`} className="sr-only">Quantity</label>
//                       <input id={`iqty-${item.id}`} type="number" value={item.qty} min={1}
//                         aria-invalid={!!errors[`item-qty-${item.id}`]}
//                         onChange={e => { updateItem(item.id,"qty",Number(e.target.value)); clearErr(`item-qty-${item.id}`); }}
//                         style={{...inputStyle(!!errors[`item-qty-${item.id}`]), textAlign:"center"}} />
//                     </div>
//                     {/* Price */}
//                     <div>
//                       <label htmlFor={`iprice-${item.id}`} className="sr-only">Price</label>
//                       <input id={`iprice-${item.id}`} type="number" value={item.price} min={0} step="0.01"
//                         aria-invalid={!!errors[`item-price-${item.id}`]}
//                         onChange={e => { updateItem(item.id,"price",Number(e.target.value)); clearErr(`item-price-${item.id}`); }}
//                         style={inputStyle(!!errors[`item-price-${item.id}`])} />
//                     </div>
//                     {/* Total */}
//                     <span style={{fontSize:13, fontWeight:700, color:"#888EB0", paddingTop:18, display:"block"}}>
//                       {(item.qty * item.price).toFixed(2)}
//                     </span>
//                     {/* Delete */}
//                     <button
//                       onClick={() => removeItem(item.id)}
//                       aria-label={`Remove item ${item.name || "unnamed"}`}
//                       style={{background:"none", border:"none", cursor:"pointer", color:"#888EB0", paddingTop:14, transition:"color 0.15s"}}
//                       onMouseEnter={e => (e.currentTarget.style.color="#EC5757")}
//                       onMouseLeave={e => (e.currentTarget.style.color="#888EB0")}
//                     >
//                       <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
//                         <path d="M11.583 3H9.5V2.25A2.253 2.253 0 007.25 0h-1.5A2.253 2.253 0 003.5 2.25V3H1.417A1.417 1.417 0 000 4.417v.583c0 .322.261.583.583.583H.792l.767 8.823A1.416 1.416 0 002.97 15.5h7.062a1.415 1.415 0 001.41-1.094L12.208 5.583h.209A.583.583 0 0013 5v-.583A1.417 1.417 0 0011.583 3zM4.667 2.25A1.085 1.085 0 015.75 1.167h1.5A1.085 1.085 0 018.333 2.25V3H4.667V2.25zm6.122 12.082a.25.25 0 01-.247.251H2.97a.25.25 0 01-.248-.251L1.96 5.583h9.08l-.25 8.749z" fill="currentColor"/>
//                       </svg>
//                     </button>
//                   </div>
//                   {/* Per-item errors below the row */}
//                   {(errors[`item-name-${item.id}`] || errors[`item-qty-${item.id}`] || errors[`item-price-${item.id}`]) && (
//                     <div style={{display:"flex", gap:8, marginTop:4, flexWrap:"wrap"}} role="alert" aria-live="polite">
//                       {errors[`item-name-${item.id}`]  && <span style={errTxt}>Name {errors[`item-name-${item.id}`]}</span>}
//                       {errors[`item-qty-${item.id}`]   && <span style={errTxt}>Qty {errors[`item-qty-${item.id}`]}</span>}
//                       {errors[`item-price-${item.id}`] && <span style={errTxt}>Price {errors[`item-price-${item.id}`]}</span>}
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {itemsError && (
//                 <p style={{color:"#EC5757", fontSize:12, marginBottom:8, fontWeight:600}} role="alert">{itemsError}</p>
//               )}

//               <button
//                 onClick={addItem}
//                 style={{
//                   width:"100%", padding:"14px", borderRadius:9999,
//                   background: isDark ? "#252945" : "#F9FAFE",
//                   color:txtLabel, fontSize:13, fontWeight:700,
//                   border:"none", cursor:"pointer", marginTop:8, transition:"background 0.15s",
//                   fontFamily:"'DM Sans',sans-serif",
//                 }}
//                 onMouseEnter={e => (e.currentTarget.style.background = isDark ? "#373B53" : "#DFE3FA")}
//                 onMouseLeave={e => (e.currentTarget.style.background = isDark ? "#252945" : "#F9FAFE")}
//               >
//                 + Add New Item
//               </button>
//             </section>

//             {/* sr-only helper */}
//             <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`}</style>
//             <div style={{height:24}} />
//           </div>

//           {/* ── Sticky footer ────────────────────────────── */}
//           <div className="inv-footer"
//             style={{ background: isDark ? "var(--bg-card)" : "#fff", boxShadow:"0 -4px 12px rgba(0,0,0,0.10)" }}>
//             {isEditing ? (
//               <>
//                 <button className="inv-btn" onClick={closeForm}
//                   style={{ background: isDark ? "#252945" : "#F4F4F8", color: isDark ? "#DFE3FA" : "#6E7491" }}>
//                   Cancel
//                 </button>
//                 <button className="inv-btn" onClick={() => handleSave(false)}
//                   style={{ background:"#7C5DFA", color:"#fff", boxShadow:"0 4px 14px rgba(124,93,250,0.35)" }}>
//                   Save Changes
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button className="inv-btn" onClick={closeForm}
//                   style={{ background: isDark ? "#252945" : "#F4F4F8", color: isDark ? "#DFE3FA" : "#6E7491" }}>
//                   Discard
//                 </button>
//                 <button className="inv-btn" onClick={() => handleSave(true)}
//                   style={{ background:"#373B53", color:"#888EB0" }}>
//                   Save as Draft
//                 </button>
//                 <button className="inv-btn" onClick={() => handleSave(false)}
//                   style={{ background:"#7C5DFA", color:"#fff", boxShadow:"0 4px 14px rgba(124,93,250,0.35)" }}>
//                   Save &amp; Send
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
