// "use client";

// import { useState } from "react";
// import { FiSend, FiMic } from "react-icons/fi";

// export default function BuyerChat() {
  
//   const chats = [
//     { id: 1, name: "Priya Sharma", last: "Hi 👋", img: "https://i.pravatar.cc/45?img=12" },
//     { id: 2, name: "Kritik Joshi", last: "No messages yet", img: "https://i.pravatar.cc/45?img=3" },
//     { id: 3, name: "Alex Doe", last: "No messages yet", img: "https://i.pravatar.cc/45?img=5" },
//   ];

//   const [active, setActive] = useState(chats[0]);

//   const messages = [
//     { id: 1, text: "Hi, is this available?", me: false },
//     { id: 2, text: "Yes!", me: true },
//   ];

//   return (
//     <div className="flex h-[calc(100vh-64px)]">

//       {/* LEFT CHAT LIST */}
//       <div className="w-80 border-r bg-white overflow-y-auto">
//         <h2 className="font-bold text-xl p-5 text-gray-900">Conversations</h2>

//         {chats.map(chat => (
//           <div
//             key={chat.id}
//             onClick={() => setActive(chat)}
//             className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-50 ${
//               active.id === chat.id ? "bg-emerald-50" : ""
//             }`}
//           >
//             <img src={chat.img} className="w-10 h-10 rounded-full" />
//             <div>
//               <p className="font-medium text-gray-800">{chat.name}</p>
//               <p className="text-sm text-gray-500">{chat.last}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* CHAT WINDOW */}
//       <div className="flex-1 flex flex-col">

//         {/* HEADER */}
//         <div className="border-b flex items-center gap-3 px-5 py-4 bg-white">
//           <img src={active.img} className="w-10 h-10 rounded-full" />
//           <p className="font-semibold">{active.name}</p>
//         </div>

//         {/* MESSAGES */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           {messages.map(m => (
//             <div
//               key={m.id}
//               className={`max-w-xs mb-4 px-4 py-2 rounded-xl ${
//                 m.me
//                   ? "ml-auto bg-emerald-600 text-white rounded-br-none"
//                   : "bg-gray-200 text-gray-800 rounded-bl-none"
//               }`}
//             >
//               {m.text}
//             </div>
//           ))}
//         </div>

//         {/* INPUT BAR */}
//         <div className="border-t p-4 bg-white flex items-center gap-3">
//           <input
//             placeholder="Type message..."
//             className="flex-1 border rounded-full px-4 py-2 text-gray-700 outline-none"
//           />
//           <FiMic className="text-gray-500 text-xl" />
//           <button className="bg-emerald-600 text-white p-2 rounded-full">
//             <FiSend />
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
