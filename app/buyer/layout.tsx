"use client";

import { usePathname } from "next/navigation";
import NavbarBuyer from "@/components/NavbarBuyer";
import { CartProvider } from "@/store/cartContext";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/buyer/signin", "/buyer/signup"];
  const hideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {!hideNavbar && <NavbarBuyer />}
        {children}
      </div>
    </CartProvider>
  );
}
