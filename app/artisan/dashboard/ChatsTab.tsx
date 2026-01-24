// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// type Conversation = {
//   id: string;
//   title: string;
//   createdAt: string;
//   lastMessage?: string | null;
// };

// export default function ChatsTab() {
//   const [loading, setLoading] = useState(true);
//   const [conversations, setConversations] = useState<Conversation[]>([]);

//   useEffect(() => {
//     async function loadConvos() {
//       try {
//         const res = await fetch("/api/conversations");
//         const data = await res.json();
//         setConversations(data);
//       } catch (err) {
//         console.error("Failed to load conversations", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadConvos();
//   }, []);

//   if (loading) return <p className="text-gray-500">Loading chats…</p>;

//   if (conversations.length === 0)
//     return <p className="text-gray-500">No conversations yet.</p>;

//   return (
//     <div className="space-y-4">
//       {conversations.map((c) => (
//         <Link
//           key={c.id}
//           href={`/artisan/chat/${c.id}`}
//           className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
//         >
//           <div className="flex justify-between items-center">
//             <h3 className="font-semibold text-gray-800">{c.title}</h3>
//             <span className="text-xs text-gray-500">
//               {new Date(c.createdAt).toLocaleDateString()}
//             </span>
//           </div>

//           <p className="text-gray-600 text-sm mt-1 line-clamp-1">
//             {c.lastMessage || "No messages yet"}
//           </p>
//         </Link>
//       ))}
//     </div>
//   );
// }
