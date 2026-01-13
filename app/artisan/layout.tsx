"use client";

import { usePathname } from "next/navigation";
import SidebarArtisan from "../src/components/SidebarArtisan";

export default function ArtisanLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar on signup and signin pages
  const hideSidebar = pathname === "/artisan/signup" || pathname === "/artisan/signin";

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar (Left) */}
      {!hideSidebar && <SidebarArtisan />}

      {/* Page Content (Right) */}
      <div className={!hideSidebar ? "ml-64 flex-1 bg-[#F8FAFC] min-h-screen" : "w-full bg-[#F8FAFC] min-h-screen"}>
        {children}
      </div>
    </div>
  );
}
