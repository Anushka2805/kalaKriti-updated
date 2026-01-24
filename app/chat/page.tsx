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
//   buyerName: string | null;
//   productName: string | null;
//   offerAmount: number;
//   counterAmount?: number | null;
//   status: "PENDING" | "ACCEPTED" | "REJECTED";
//   createdAt: string;
// };

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

//   // Customization Requests
//   const [customRequests, setCustomRequests] = useState<CustomRequest[]>([]);
//   const [crTitle, setCrTitle] = useState("");
//   const [crNote, setCrNote] = useState("");
//   const [crImageUrl, setCrImageUrl] = useState("");
//   const [loadingCR, setLoadingCR] = useState(false);

//   // Negotiations
//   const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
//   const [negLoading, setNegLoading] = useState(false);
//   const [negBuyerName, setNegBuyerName] = useState("");
//   const [negProductName, setNegProductName] = useState("");
//   const [negOfferAmount, setNegOfferAmount] = useState<string>("");
//   const [negCounterDraft, setNegCounterDraft] = useState<Record<string, string>>(
//     {}
//   );

//   const [rightTab, setRightTab] = useState<"custom" | "negotiation">("custom");

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   // Load conversations
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
//         console.error(e);
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
//         setNegLoading(true);
//         const list = await api<Negotiation[]>(
//           `/api/negotiations?conversationId=${activeId}`
//         );
//         if (!stopped) setNegotiations(list);
//       } catch (e) {
//         console.error("Failed to load negotiations", e);
//       } finally {
//         if (!stopped) setNegLoading(false);
//       }
//     };

//     loadNeg();
//     const timer = setInterval(loadNeg, 5000);
//     return () => {
//       stopped = true;
//       clearInterval(timer);
//     };
//   }, [activeId]);

//   // Auto scroll chat to bottom
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

//   // Customization create
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

//   const handleUpdateCRStatus = (
//     id: string,
//     status: CustomRequest["status"]
//   ) => {
//     api<CustomRequest>("/api/custom-requests", {
//       method: "PATCH",
//       body: JSON.stringify({ id, status }),
//     })
//       .then((updated) => {
//         setCustomRequests((prev) =>
//           prev.map((r) => (r.id === id ? updated : r))
//         );
//       })
//       .catch((e) => console.error("Failed to update request", e));
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

//   // Negotiation helpers
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

//   const negStatusClass = (status: Negotiation["status"]) => {
//     if (status === "ACCEPTED")
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     if (status === "REJECTED")
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     return "bg-gray-50 text-gray-600 border-gray-200";
//   };

//   const handleCreateNegotiation = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!activeId || !negOfferAmount.trim()) return;

//     const offer = Number(negOfferAmount);
//     if (Number.isNaN(offer) || offer <= 0) return;

//     try {
//       const created = await api<Negotiation>("/api/negotiations", {
//         method: "POST",
//         body: JSON.stringify({
//           conversationId: activeId,
//           buyerName: negBuyerName.trim() || undefined,
//           productName: negProductName.trim() || undefined,
//           offerAmount: offer,
//         }),
//       });
//       setNegotiations((prev) => [created, ...prev]);
//       setNegBuyerName("");
//       setNegProductName("");
//       setNegOfferAmount("");
//     } catch (e) {
//       console.error("Failed to create negotiation", e);
//     }
//   };

//   const handleSetCounter = async (id: string) => {
//     const raw = negCounterDraft[id];
//     if (!raw) return;
//     const value = Number(raw);
//     if (Number.isNaN(value) || value <= 0) return;

//     try {
//       const updated = await api<Negotiation>("/api/negotiations", {
//         method: "PATCH",
//         body: JSON.stringify({ id, counterAmount: value, status: "PENDING" }),
//       });
//       setNegotiations((prev) =>
//         prev.map((n) => (n.id === id ? updated : n))
//       );
//     } catch (e) {
//       console.error("Failed to set counter", e);
//     }
//   };

//   const handleNegStatusChange = async (
//     id: string,
//     status: Negotiation["status"]
//   ) => {
//     try {
//       const updated = await api<Negotiation>("/api/negotiations", {
//         method: "PATCH",
//         body: JSON.stringify({ id, status }),
//       });
//       setNegotiations((prev) =>
//         prev.map((n) => (n.id === id ? updated : n))
//       );
//     } catch (e) {
//       console.error("Failed to update negotiation status", e);
//     }
//   };

//   return (
//     <main className="max-w-7xl mx-auto px-4 py-4 h-screen text-black">
//       <div className="flex items-center justify-between mb-3">
//         <div>
//           <h1 className="text-xl font-semibold text-emerald-700">
//             Chat · Customization · Negotiation
//           </h1>
//           <p className="text-xs text-gray-500">
//             All interaction between buyer & artisan, saved in DB.
//           </p>
//         </div>
//         <div className="flex items-center gap-2 text-xs">
//           <span className="text-gray-500">You are:</span>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value as "buyer" | "artisan")}
//             className="border border-gray-200 rounded-full px-2 py-1 text-xs text-black bg-white"
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
//                 <p className="font-medium text-black line-clamp-1">
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
//               <span className="text-sm font-semibold text-black">
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
//                       : "bg-white text-black border border-gray-200 rounded-bl-sm"
//                   }`}
//                 >
//                   <p
//                     className={`text-[10px] mb-0.5 ${
//                       m.from === role ? "text-emerald-100" : "text-gray-700"
//                     }`}
//                   >
//                     {m.from === "buyer" ? "Buyer" : "Artisan"}
//                   </p>
//                   <p>{m.text}</p>
//                   <p
//                     className={`mt-1 text-[10px] ${
//                       m.from === role ? "text-emerald-100" : "text-gray-600"
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
//               className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//             />
//             <button
//               onClick={sendMessage}
//               className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
//             >
//               Send
//             </button>
//           </div>
//         </section>

//         {/* RIGHT: tabs (Customization / Negotiation) */}
//         <aside className="border border-gray-100 rounded-3xl bg-white shadow-sm flex flex-col">
//           {/* Tabs */}
//           <div className="px-4 pt-3 pb-2 border-b flex items-center gap-2">
//             <button
//               className={`text-xs px-3 py-1.5 rounded-full border ${
//                 rightTab === "custom"
//                   ? "bg-emerald-600 text-white border-emerald-600"
//                   : "bg-gray-50 text-gray-700 border-gray-200"
//               }`}
//               onClick={() => setRightTab("custom")}
//             >
//               Customization
//             </button>
//             <button
//               className={`text-xs px-3 py-1.5 rounded-full border ${
//                 rightTab === "negotiation"
//                   ? "bg-emerald-600 text-white border-emerald-600"
//                   : "bg-gray-50 text-gray-700 border-gray-200"
//               }`}
//               onClick={() => setRightTab("negotiation")}
//             >
//               Negotiations
//             </button>
//           </div>

//           {rightTab === "custom" ? (
//             <>
//               {/* Customization form */}
//               <div className="px-4 py-3 border-b">
//                 <h2 className="text-sm font-semibold text-black mb-1">
//                   Customization requests
//                 </h2>
//                 <p className="text-[11px] text-gray-500 mb-2">
//                   Linked to this conversation
//                 </p>
//                 <form
//                   onSubmit={handleCreateCustomRequest}
//                   className="space-y-2 text-xs"
//                 >
//                   <input
//                     value={crTitle}
//                     onChange={(e) => setCrTitle(e.target.value)}
//                     placeholder="Title (e.g. Diwali hamper)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <textarea
//                     value={crNote}
//                     onChange={(e) => setCrNote(e.target.value)}
//                     rows={3}
//                     placeholder="Describe colours, names, quantity, packaging, event date…"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <input
//                     value={crImageUrl}
//                     onChange={(e) => setCrImageUrl(e.target.value)}
//                     placeholder="Reference image URL (optional)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
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
//                         <p className="font-medium text-black line-clamp-1">
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
//                       <p className="text-[11px] text-gray-700 line-clamp-3">
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
//                           className="px-2 py-0.5 rounded-full border border-gray-200 text-[10px] text-gray-700 hover:bg-gray-100"
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
//               {/* Negotiations form */}
//               <div className="px-4 py-3 border-b">
//                 <h2 className="text-sm font-semibold text-black mb-1">
//                   Negotiations
//                 </h2>
//                 <p className="text-[11px] text-gray-500 mb-2">
//                   Buyer offers · Artisan counters · Status tracking
//                 </p>
//                 <form
//                   onSubmit={handleCreateNegotiation}
//                   className="space-y-2 text-xs"
//                 >
//                   <input
//                     value={negBuyerName}
//                     onChange={(e) => setNegBuyerName(e.target.value)}
//                     placeholder="Buyer name (optional)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <input
//                     value={negProductName}
//                     onChange={(e) => setNegProductName(e.target.value)}
//                     placeholder="Product / item (optional)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <input
//                     value={negOfferAmount}
//                     onChange={(e) => setNegOfferAmount(e.target.value)}
//                     placeholder="Buyer offer amount (₹)"
//                     className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
//                   />
//                   <div className="flex justify-end">
//                     <button
//                       type="submit"
//                       className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-medium hover:bg-emerald-800"
//                       disabled={!activeId}
//                     >
//                       Create negotiation
//                     </button>
//                   </div>
//                 </form>
//               </div>

//               {/* Negotiations list */}
//               <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-xs">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-[11px] text-gray-600 font-medium">
//                     Active negotiations
//                   </span>
//                   {negLoading && (
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
//                         <div className="space-y-0.5">
//                           <p className="font-medium text-black line-clamp-1">
//                             {n.productName || "Negotiation"}
//                           </p>
//                           {n.buyerName && (
//                             <p className="text-[11px] text-gray-600">
//                               Buyer: {n.buyerName}
//                             </p>
//                           )}
//                         </div>
//                         <span
//                           className={
//                             "px-2 py-0.5 rounded-full border text-[10px] " +
//                             negStatusClass(n.status)
//                           }
//                         >
//                           {negStatusLabel(n.status)}
//                         </span>
//                       </div>

//                       <p className="text-[11px] text-gray-700">
//                         Offer:{" "}
//                         <span className="font-semibold">
//                           ₹{n.offerAmount.toLocaleString("en-IN")}
//                         </span>
//                       </p>
//                       {typeof n.counterAmount === "number" && (
//                         <p className="text-[11px] text-gray-700">
//                           Counter:{" "}
//                           <span className="font-semibold">
//                             ₹{n.counterAmount.toLocaleString("en-IN")}
//                           </span>
//                         </p>
//                       )}

//                       {role === "artisan" && (
//                         <div className="mt-1 space-y-1">
//                           <div className="flex items-center gap-1">
//                             <input
//                               value={negCounterDraft[n.id] ?? ""}
//                               onChange={(e) =>
//                                 setNegCounterDraft((prev) => ({
//                                   ...prev,
//                                   [n.id]: e.target.value,
//                                 }))
//                               }
//                               placeholder="Counter amount"
//                               className="w-24 border border-gray-200 rounded-xl px-2 py-1 text-[10px] text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => handleSetCounter(n.id)}
//                               className="px-2 py-1 rounded-full bg-white border border-emerald-500 text-[10px] text-emerald-700 hover:bg-emerald-50"
//                             >
//                               Set counter
//                             </button>
//                           </div>
//                           <div className="flex items-center gap-1 justify-end">
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleNegStatusChange(n.id, "ACCEPTED")
//                               }
//                               className="px-2 py-1 rounded-full bg-emerald-600 text-white text-[10px] hover:bg-emerald-700"
//                             >
//                               Accept
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleNegStatusChange(n.id, "REJECTED")
//                               }
//                               className="px-2 py-1 rounded-full bg-white border border-gray-300 text-[10px] text-gray-700 hover:bg-gray-100"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         </div>
//                       )}
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
