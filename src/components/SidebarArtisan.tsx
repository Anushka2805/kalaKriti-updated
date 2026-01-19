"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiTrendingUp,
  FiCamera,
  FiShoppingBag,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const navItems = [
  { label: "Dashboard", href: "/artisan/dashboard", icon: <FiHome size={18} /> },
  { label: "AI Market Assistant", href: "/artisan/market", icon: <FiTrendingUp size={18} /> },
  { label: "AI Photo Studio", href: "/artisan/studio", icon: <FiCamera size={18} /> },
  { label: "Order History", href: "/artisan/orders", icon: <FiShoppingBag size={18} /> },
  { label: "Chat", href: "/artisan/chat", icon: <FiMessageSquare size={18} /> },
];

export default function SidebarArtisan() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include", // 🔥 VERY IMPORTANT
  });

  router.push("/artisan/signin");
};


  return (
    <aside className="w-64 fixed h-screen bg-white border-r flex flex-col justify-between">

      {/* Logo + Navigation */}
      <div>
        <div className="flex items-center gap-3 p-6">
          <h2 className="text-xl font-bold text-emerald-700">KalaKriti</h2>
        </div>

        <nav className="mt-4 flex flex-col">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex gap-3 px-6 py-3 items-center font-medium rounded-lg
              ${
                pathname === item.href
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* User + Logout */}
      <div className="p-6 border-t space-y-4">
        <div className="flex gap-3 items-center">
          <FaUserCircle className="w-10 h-10 text-gray-400" />
          <div>
            <p className="font-semibold text-gray-900">Ruby Jha</p>
            <p className="text-sm text-gray-500">Artisan</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>

    </aside>
  );
}
