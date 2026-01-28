"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarArtisan from "@/src/components/SidebarArtisan";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar on signup and signin pages
  const hideSidebar =
    pathname === "/artisan/signup" || pathname === "/artisan/signin";

  /* ================= VOICE ASSISTANT (GLOBAL) ================= */
  const { speak, listen } = useVoiceAssistant();

  useEffect(() => {
    if (hideSidebar) return;

    speak(
      "Artisan dashboard active hai. Aap bol sakte ho go to dashboard, go to products, go to add product, go to orders, ya go to profile."
    );
    listen(handleLayoutVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLayoutVoice = (text: string) => {
    text = text.toLowerCase();

    if (text.includes("dashboard")) {
      speak("Dashboard khol rahi hoon.");
      router.push("/artisan/dashboard");
      return;
    }

    if (text.includes("add")) {
      speak("Add product page khol rahi hoon.");
      router.push("/artisan/add-product");
      return;
    }

    if (text.includes("product")) {
      speak("My products page khol rahi hoon.");
      router.push("/artisan/products");
      return;
    }

    if (text.includes("order")) {
      speak("Orders page khol rahi hoon.");
      router.push("/artisan/orders");
      return;
    }

    if (text.includes("profile")) {
      speak("Profile page khol rahi hoon.");
      router.push("/artisan/profile");
      return;
    }

    if (text.includes("repeat")) {
      speak(
        "Aap bol sakte ho go to dashboard, go to products, go to add product, go to orders, ya go to profile."
      );
      listen(handleLayoutVoice);
    }
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="flex w-full min-h-screen">
      {!hideSidebar && <SidebarArtisan />}

      <div
        className={
          !hideSidebar
            ? "ml-64 flex-1 bg-[#F8FAFC] min-h-screen"
            : "w-full bg-[#F8FAFC] min-h-screen"
        }
      >
        {children}
      </div>
    </div>
  );
}
