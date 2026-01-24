// "use client";

// import { useEffect, useRef, useState } from "react";

// type Conversation = {
//   id: string;
//   title: string;
//   createdAt: string;
// };

// type Message = {
//   id: string;
//   conversationId: string;
//   from: "buyer" | "artisan" | string;
//   text: string;
//   createdAt: string;
// };

// type CustomRequest = {
//   id: string;
//   conversationId: string;
//   title: string;
//   note: string;
//   imageUrl?: string | null;
//   status: "SENT" | "IN_DISCUSSION" | "COMPLETED";
//   createdAt: string;
// };

// type Negotiation = {
//   id: string;
//   conversationId: string;
//   productName: string;
//   buyerName: string;
//   offerAmount: number;
//   counterAmount?: number | null;
//   status: "PENDING" | "ACCEPTED" | "REJECTED";
//   createdAt: string;
// };

// type RightTab = "CUSTOM" | "NEGOTIATION";

// async function api<T>(url: string, options?: RequestInit) {
//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || res.statusText);
//   }
//   return res.json() as Promise<T>;
// }

// export default function ChatPage() {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [role, setRole] = useState<"buyer" | "artisan">("buyer");

//   const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
//   const [crTitle, setCrTitle] = useState("");
//   const [crNote, setCrNote] = useState("");
//   const [crImageUrl, setCrImageUrl] = useState("");

//   const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
//   const [negProduct, setNegProduct] = useState("");
//   const [negBuyerName, setNegBuyerName] = useState("You (buyer)");
//   const [negOffer, setNegOffer] = useState("");
//   const [counterDraft, setCounterDraft] = useState<Record<string, string>>({});

//   const [loadingCR, setLoadingCR] = useState(false);
//   const [loadingNeg, setLoadingNeg] = useState(false);
//   const [rightTab, setRightTab] = useState<RightTab>("CUSTOM");

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   // Load conversations once
//   useEffect(() => {
//     (async () => {
//       try {
//         const list = await api<Conversation[]>("/api/conversations");
//         if (list.length === 0) {
//           const created = await api<Conversation>("/api/conversations", {
//             method: "POST",
//             body: JSON.stringify({ title: "Buyer ↔ Artisan Chat" }),
//           });
//           setConversations([created]);
//           setActiveId(created.id);
//         } else {
//           setConversations(list);
//           setActiveId(list[0].id);
//         }
//       } catch (e) {
//         console.error("Error loading conversations", e);
//       }
//     })();
//   }, []);

//   // Poll messages
//   useEffect(() => {
//     if (!activeId) return;

//     let stopped = false;

//     const load = async () => {
//       try {
//         const msgs = await api<Message[]>(
//           `/api/messages?conversationId=${activeId}`
//         );
//         if (!stopped) setMessages(msgs);
//       } catch (e) {
//         console.error("Failed to load messages", e);
//       }
//     };

//     load();
//     const timer = setInterval(load, 2000);
//     return () => {
//       stopped = true;
//       clearInterval(timer);
//     };
//   }, [activeId]);

//   // Load customization requests
//   useEffect(() => {
//     if (!activeId) return;

//     let stopped = false;
//     const loadCR = async () => {
//       try {
//         setLoadingCR(true);
//         const reqs = await api<CustomRequest[]>(
//           `/api/custom-requests?conversationId=${activeId}`
//         );
//         if (!stopped) setCustomRequests(reqs);
//       } catch (e) {
//         console.error("Failed to load custom requests", e);
//       } finally {
//         if (!stopped) setLoadingCR(false);
//       }
//     };

//     loadCR();
//     const timer = setInterval(loadCR, 5000);
//     return () => {
//       stopped = true;
//       clearInterval(timer);
//     };
//   }, [activeId]);

//   // Load negotiations
//   useEffect(() => {
//     if (!activeId) return;

//     let stopped = false;
//     const loadNeg = async () => {
//       try {
//         setLoadingNeg(true);
//         const data = await api<Negotiation[]>(
//           `/api/negotiations?conversationId=${activeId}`
//         );
//         if (!stopped) setNegotiations(data);
//       } catch (e) {
//         console.error("Failed to load negotiations", e);
//       } finally {
//         if (!stopped) setLoadingNeg(false);
//       }
//     };

//     loadNeg();
//     const timer = setInterval(loadNeg, 5000);
//     return () => {
//       stopped = true;
//       clearInterval(timer);
//     };
//   }, [activeId]);

//   // Auto scroll chat
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages.length]);

//   const activeConversation =
//     conversations.find((c) => c.id === activeId) || null;

//   const sendMessage = async () => {
//     if (!input.trim() || !activeId) return;

//     const optimistic: Message = {
//       id: "temp-" + Date.now(),
//       conversationId: activeId,
//       from: role,
//       text: input.trim(),
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, optimistic]);
//     const textToSend = input;
//     setInput("");

//     try {
//       const saved = await api<Message>("/api/messages", {
//         method: "POST",
//         body: JSON.stringify({
//           conversationId: activeId,
//           from: role,
//           text: textToSend,
//         }),
//       });
//       setMessages((prev) =>
//         prev.map((m) => (m.id === optimistic.id ? saved : m))
//       );
//     } catch (e) {
//       console.error("Failed to send message", e);
//       setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
//       setInput(textToSend);
//     }
//   };

//   const handleCreateCustomRequest = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!activeId || !crTitle.trim() || !crNote.trim()) return;

//     try {
//       const created = await api<CustomRequest>("/api/custom-requests", {
//         method: "POST",
//         body: JSON.stringify({
//           conversationId: activeId,
//           title: crTitle.trim(),
//           note: crNote.trim(),
//           imageUrl: crImageUrl.trim() || undefined,
//         }),
//       });
//       setCustomRequests((prev) => [created, ...prev]);
//       setCrTitle("");
//       setCrNote("");
//       setCrImageUrl("");
//     } catch (e) {
//       console.error("Failed to create custom request", e);
//     }
//   };

//   const handleUpdateCRStatus = async (
//     id: string,
//     status: CustomRequest["status"]
//   ) => {
//     try {
//       const updated = await api<CustomRequest>("/api/custom-requests", {
//         method: "PATCH",
//         body: JSON.stringify({ id, status }),
//       });
//       setCustomRequests((prev) =>
//         prev.map((r) => (r.id === id ? updated : r))
//       );
//     } catch (e) {
//       console.error("Failed to update status", e);
//     }
//   };

//   const handleCreateNegotiation = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!activeId || !negProduct.trim() || !negOffer.trim()) return;

//     const offerValue = Number(negOffer);
//     if (!offerValue || offerValue <= 0) return;

//     try {
//       const created = await api<Negotiation>("/api/negotiations", {
//         method: "POST",
//         body: JSON.stringify({
//           conversationId: activeId,
//           productName: negProduct.trim(),
//           buyerName: negBuyerName.trim() || "Buyer",
//           offerAmount: offerValue,
//         }),
//       });
//       setNegotiations((prev) => [created, ...prev]);
//       setNegProduct("");
//       setNegOffer("");
//     } catch (e) {
//       console.error("Failed to create negotiation", e);
//     }
//   };

//   const handleUpdateNegotiation = async (id: string, payload: {
//     status?: Negotiation["status"];
//     counterAmount?: number;
//   }) => {
//     try {
//       const updated = await api<Negotiation>("/api/negotiations", {
//         method: "PATCH",
//         body: JSON.stringify({ id, ...payload }),
//       });
//       setNegotiations((prev) =>
//         prev.map((n) => (n.id === id ? updated : n))
//       );
//     } catch (e) {
//       console.error("Failed to update negotiation", e);
//     }
//   };

//   const crStatusLabel = (status: CustomRequest["status"]) => {
//     switch (status) {
//       case "SENT":
//         return "Sent";
//       case "IN_DISCUSSION":
//         return "In discussion";
//       case "COMPLETED":
//         return "Completed";
//     }
//   };

//   const crStatusClass = (status: CustomRequest["status"]) => {
//     if (status === "COMPLETED")
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     if (status === "IN_DISCUSSION")
//       return "bg-amber-50 text-amber-700 border-amber-200";
//     return "bg-gray-50 text-gray-600 border-gray-200";
//   };

//   const negStatusClass = (status: Negotiation["status"]) => {
//     if (status === "ACCEPTED")
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     if (status === "REJECTED")
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     return "bg-gray-50 text-gray-600 border-gray-200";
//   };

//   const negStatusLabel = (status: Negotiation["status"]) => {
//     switch (status) {
//       case "PENDING":
//         return "Pending";
//       case "ACCEPTED":
//         return "Accepted";
//       case "REJECTED":
//         return "Rejected";
//     }
//   };

//   return (
//     <main className="max-w-7xl mx-auto px-4 py-4 h-screen">
//       <div className="flex items-center justify-between mb-3">
//         <div>
//           <h1 className="text-xl font-semibold text-emerald-700">
//             Chat, Customization & Negotiation
//           </h1>
//           <p className="text-xs text-gray-500">
//             All saved in a real database · no dummy data.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 text-xs">
//           <span className="text-gray-500">You are:</span>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value as "buyer" | "artisan")}
//             className="border border-gray-200 rounded-full px-2 py-1 text-xs"
//           >
//             <option value="buyer">Buyer</option>
//             <option value="artisan">Artisan</option>
//           </select>
//         </div>
//       </div>

//       <section className="grid lg:grid-cols-[230px,minmax(0,1.6fr),minmax(0,1.2fr)] gap-4 h-[calc(100vh-5rem)]">
//         {/* LEFT: conversations */}
//         <aside className="border border-gray-100 rounded-3xl bg-white shadow-sm flex flex-col">
//           <h2 className="px-4 py-3 text-xs font-semibold text-gray-700 border-b">
//             Conversations
//           </h2>
//           <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
//             {conversations.map((c) => (
//               <button
//                 key={c.id}
//                 onClick={() => setActiveId(c.id)}
//                 className={`w-full text-left px-3 py-2 rounded-2xl border text-xs ${
//                   c.id === activeId
//                     ? "border-emerald-500 bg-emerald-50"
//                     : "border-gray-100 bg-gray-50 hover:bg-gray-100"
//                 }`}
//               >
//                 <p className="font-medium text-gray-900 line-clamp-1">
//                   {c.title}
//                 </p>
//                 <p className="text-[11px] text-gray-500">
//                   {new Date(c.createdAt).toLocaleString()}
//                 </p>
//               </button>
//             ))}
//           </div>
//         </aside>

//         {/* MIDDLE: chat */}
//         <section className="border border-gray-100 rounded-3xl bg-white shadow-sm flex flex-col">
//           <div className="px-4 py-3 border-b flex items-center justify-between">
//             <div className="flex flex-col">
//               <span className="text-xs text-gray-500">Chat</span>
//               <span className="text-sm font-semibold text-gray-900">
//                 {activeConversation?.title ?? "Loading..."}
//               </span>
//             </div>
//             <span className="text-[11px] text-gray-500">
//               Messages auto-refresh
//             </span>
//           </div>

//           <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-50">
//             {messages.map((m) => (
//               <div
//                 key={m.id}
//                 className={`flex ${
//                   m.from === role ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${
//                     m.from === role
//                       ? "bg-emerald-600 text-white rounded-br-sm"
//                       : "bg-white text-black border border-gray-100 rounded-bl-sm"

//                   }`}
//                 >
//                   <p className="text-[10px] mb-0.5 text-black">

//                     {m.from === "buyer" ? "Buyer" : "Artisan"}
//                   </p>
//                   <p>{m.text}</p>
//                   <p
//                     className={`mt-1 text-[10px] ${
//                       m.from === role ? "text-emerald-100" : "text-gray-500"
//                     }`}
//                   >
//                     {new Date(m.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
//             <div ref={bottomRef} />
//           </div>

//           <div className="border-t px-3 py-2 flex items-center gap-2 bg-white">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//               placeholder="Type a message..."
//               className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-black placeholder-black"

//             />
//             <button
//               onClick={sendMessage}
//               className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
//             >
//               Send
//             </button>
//           </div>
//         </section>

//         {/* RIGHT: tabs: customization / negotiations */}
//         <aside className="border border-gray-100 rounded-3xl bg-white shadow-sm flex flex-col">
//           {/* Tabs */}
//           <div className="px-4 pt-3 pb-2 border-b flex items-center gap-2 text-xs">
//             <button
//               type="button"
//               onClick={() => setRightTab("CUSTOM")}
//               className={`px-3 py-1.5 rounded-full border ${
//                 rightTab === "CUSTOM"
//                   ? "bg-emerald-600 text-white border-emerald-600"
//                   : "bg-gray-100 text-gray-700 border-gray-200"
//               }`}
//             >
//               Customization
//             </button>
//             <button
//               type="button"
//               onClick={() => setRightTab("NEGOTIATION")}
//               className={`px-3 py-1.5 rounded-full border ${
//                 rightTab === "NEGOTIATION"
//                   ? "bg-emerald-600 text-white border-emerald-600"
//                   : "bg-gray-100 text-gray-700 border-gray-200"
//               }`}
//             >
//               Negotiations
//             </button>
//           </div>

//           {rightTab === "CUSTOM" ? (
//             <>
//               {/* Customization form */}
//               <div className="px-4 py-3 border-b">
//                 <form
//                   onSubmit={handleCreateCustomRequest}
//                   className="space-y-2 text-xs"
//                 >
//                   <input
//                     value={crTitle}
//                     onChange={(e) => setCrTitle(e.target.value)}
//                     placeholder="Title (e.g. Diwali gift set)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <textarea
//                     value={crNote}
//                     onChange={(e) => setCrNote(e.target.value)}
//                     rows={3}
//                     placeholder="Describe colours, names, quantities, packaging, event date…"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <input
//                     value={crImageUrl}
//                     onChange={(e) => setCrImageUrl(e.target.value)}
//                     placeholder="Reference image URL (optional)"
//                     className="w-full border border-black rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
//                   />
//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-medium hover:bg-emerald-800"
//                       disabled={!activeId}
//                     >
//                       Send request
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {/* Customization list */}
//               <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-xs">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-[11px] text-gray-600 font-medium">
//                     Recent requests
//                   </span>
//                   {loadingCR && (
//                     <span className="text-[10px] text-gray-400">
//                       Refreshing…
//                     </span>
//                   )}
//                 </div>
//                 {customRequests.length === 0 ? (
//                   <p className="text-[11px] text-gray-500">
//                     No customization requests yet for this conversation.
//                   </p>
//                 ) : (
//                   customRequests.map((r) => (
//                     <div
//                       key={r.id}
//                       className="border border-gray-100 rounded-2xl bg-gray-50 px-3 py-2 space-y-1"
//                     >
//                       <div className="flex items-center justify-between gap-2">
//                         <p className="font-medium text-gray-800 line-clamp-1">
//                           {r.title}
//                         </p>
//                         <span
//                           className={
//                             "px-2 py-0.5 rounded-full border text-[10px] " +
//                             crStatusClass(r.status)
//                           }
//                         >
//                           {crStatusLabel(r.status)}
//                         </span>
//                       </div>
//                       <p className="text-[11px] text-gray-600 line-clamp-3">
//                         {r.note}
//                       </p>
//                       {r.imageUrl && (
//                         <a
//                           href={r.imageUrl}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-[10px] text-emerald-700 underline"
//                         >
//                           View reference
//                         </a>
//                       )}
//                       <div className="flex items-center gap-1 justify-end pt-1">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleUpdateCRStatus(r.id, "SENT")
//                           }
//                           className="px-2 py-0.5 rounded-full border border-gray-200 text-[10px] text-gray-600 hover:bg-gray-100"
//                         >
//                           Sent
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleUpdateCRStatus(r.id, "IN_DISCUSSION")
//                           }
//                           className="px-2 py-0.5 rounded-full border border-amber-300 text-[10px] text-amber-700 hover:bg-amber-50"
//                         >
//                           In discussion
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() =>
//                             handleUpdateCRStatus(r.id, "COMPLETED")
//                           }
//                           className="px-2 py-0.5 rounded-full border border-emerald-500 text-[10px] text-emerald-700 hover:bg-emerald-50"
//                         >
//                           Done
//                         </button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Negotiation form */}
//               <div className="px-4 py-3 border-b">
//                 <form
//                   onSubmit={handleCreateNegotiation}
//                   className="space-y-2 text-xs"
//                 >
//                   <p className="text-[11px] text-gray-600 mb-1">
//                     {role === "buyer"
//                       ? "Create a new offer to negotiate with the artisan."
//                       : "Review buyer’s offer and respond from below list."}
//                   </p>
//                   <input
//                     value={negProduct}
//                     onChange={(e) => setNegProduct(e.target.value)}
//                     placeholder="Product name (e.g. Crochet dolls)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   {role === "buyer" && (
//                     <input
//                       value={negBuyerName}
//                       onChange={(e) => setNegBuyerName(e.target.value)}
//                       placeholder="Your name (buyer)"
//                       className="w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
//                     />
//                   )}
//                   <input
//                     value={negOffer}
//                     onChange={(e) => setNegOffer(e.target.value)}
//                     placeholder="Offer amount (₹)"
//                     type="number"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-medium hover:bg-emerald-800"
//                       disabled={!activeId || role !== "buyer"}
//                     >
//                       Create offer
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {/* Negotiation list */}
//               <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-xs">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-[11px] text-gray-600 font-medium">
//                     Offers & counter-offers
//                   </span>
//                   {loadingNeg && (
//                     <span className="text-[10px] text-gray-400">
//                       Refreshing…
//                     </span>
//                   )}
//                 </div>
//                 {negotiations.length === 0 ? (
//                   <p className="text-[11px] text-gray-500">
//                     No negotiations yet for this conversation.
//                   </p>
//                 ) : (
//                   negotiations.map((n) => (
//                     <div
//                       key={n.id}
//                       className="border border-gray-100 rounded-2xl bg-gray-50 px-3 py-2 space-y-1"
//                     >
//                       <div className="flex items-center justify-between gap-2">
//                         <p className="font-medium text-gray-800 line-clamp-1">
//                           {n.productName}
//                         </p>
//                         <span
//                           className={
//                             "px-2 py-0.5 rounded-full border text-[10px] " +
//                             negStatusClass(n.status)
//                           }
//                         >
//                           {negStatusLabel(n.status)}
//                         </span>
//                       </div>
//                       <p className="text-[11px] text-gray-600">
//                         Buyer: <span className="font-medium">{n.buyerName}</span>
//                       </p>
//                       <p className="text-[11px] text-gray-700">
//                         Offer:{" "}
//                         <span className="font-semibold">
//                           ₹{n.offerAmount.toLocaleString("en-IN")}
//                         </span>
//                       </p>
//                       {n.counterAmount != null && (
//                         <p className="text-[11px] text-gray-700">
//                           Counter:{" "}
//                           <span className="font-semibold">
//                             ₹{n.counterAmount.toLocaleString("en-IN")}
//                           </span>
//                         </p>
//                       )}
//                       <p className="text-[10px] text-gray-400">
//                         {new Date(n.createdAt).toLocaleString()}
//                       </p>

//                       {/* Artisan controls */}
//                       <div className="flex items-center gap-2 justify-between pt-1">
//                         <div className="flex items-center gap-1">
//                           <input
//                             type="number"
//                             placeholder="Counter ₹"
//                             className="w-24 border border-gray-900 rounded-xl px-2 py-1 text-[10px] text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"

//                             value={counterDraft[n.id] ?? ""}
//                             onChange={(e) =>
//                               setCounterDraft((prev) => ({
//                                 ...prev,
//                                 [n.id]: e.target.value,
//                               }))
//                             }
//                             disabled={role !== "artisan"}
//                           />
//                           <button
//                             type="button"
//                             onClick={() => {
//                               const raw = counterDraft[n.id];
//                               if (!raw) return;
//                               const value = Number(raw);
//                               if (!value || value <= 0) return;
//                               handleUpdateNegotiation(n.id, {
//                                 counterAmount: value,
//                               });
//                             }}
//                             className="px-2 py-1 rounded-full border border-emerald-500 text-[10px] text-emerald-700 bg-white hover:bg-emerald-50"
//                             disabled={role !== "artisan"}
//                           >
//                             Set counter
//                           </button>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleUpdateNegotiation(n.id, {
//                                 status: "ACCEPTED",
//                               })
//                             }
//                             className="px-2 py-1 rounded-full bg-emerald-600 text-white text-[10px] hover:bg-emerald-700"
//                             disabled={role !== "artisan"}
//                           >
//                             Accept
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleUpdateNegotiation(n.id, {
//                                 status: "REJECTED",
//                               })
//                             }
//                             className="px-2 py-1 rounded-full bg-white border border-gray-300 text-[10px] text-gray-700 hover:bg-gray-100"
//                             disabled={role !== "artisan"}
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </>
//           )}
//         </aside>
//       </section>
//     </main>
//   );
// }
