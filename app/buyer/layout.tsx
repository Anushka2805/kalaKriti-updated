"use client";

import { usePathname } from "next/navigation";
import NavbarBuyer from "../src/components/NavbarBuyer";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/buyer/signin", "/buyer/signup"];

  const hideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <NavbarBuyer />}
      {children}
    </div>
  );
}
