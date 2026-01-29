"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

export default function ArtisanDashboard() {
  /* --- FIXED TABS --- */
  const tabList = ["chats", "requests", "negotiations"] as const;
  const [activeTab, setActiveTab] =
    useState<(typeof tabList)[number]>("chats");

  const router = useRouter();

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  /* 🔊 INTRO */
  useEffect(() => {
    speak(
      "Welcome back. Ye aapka artisan dashboard hai. Aap bol sakte ho naya product, negotiations, custom requests."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 🎤 MIC CLICK */
  const handleMicClick = () => {
    listen(handleDashboardVoice);
  };

  /* 🔁 SPEAK + AUTO LISTEN */
  const speakAndListen = (msg: string) => {
    speak(msg);
    setTimeout(() => listen(handleDashboardVoice), 600);
  };

  /* 🧠 VOICE LOGIC */
  const handleDashboardVoice = (text: string) => {
    const t = text.toLowerCase();

    if (t.includes("naya") || t.includes("product")) {
      speak("Naya product add karne ke liye le ja rahi hoon.");
      router.push("/artisan/add-product");
      return;
    }

    if (t.includes("negotiation")) {
      setActiveTab("negotiations");
      speakAndListen("Ab negotiations ka section khula hai.");
      return;
    }

    if (t.includes("request")) {
      setActiveTab("requests");
      speakAndListen("Ab custom requests ka section khula hai.");
      return;
    }

    if (t.includes("chat")) {
      speak("Chats khol rahi hoon.");
      router.push("/chat");
      return;
    }

    if (t.includes("repeat") || t.includes("samjhao")) {
      speakAndListen(
        "Ye dashboard aapke products, negotiations aur requests manage karne ke liye hai. Aap bol sakte ho naya product, negotiations, custom requests."
      );
    }
  };

  /* ================= EXISTING DATA (UNCHANGED) ================= */

  const chatPreview = [
    { id: "1", title: "Order discussion – Diwali Candles" },
  ];

  const requestPreview = [
    { id: "1", title: "Custom Packaging for Hampers", status: "IN_DISCUSSION" },
  ];

  const negotiationPreview = [
    { id: "1", productName: "Handmade Basket", offerAmount: 450 },
  ];

  /* ================= UI (ORIGINAL – UNCHANGED) ================= */

  return (
    <main className="p-10">

      {/* 🎤 MIC BUTTON */}
      <button
        type="button"
        onClick={handleMicClick}
        className="mb-6 p-3 rounded-full bg-emerald-600 text-white text-xl"
      >
        🎤
      </button>

      {/* ==================== WELCOME SECTION ==================== */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, Ruby!
        </h1>

        <p className="mt-2 text-gray-600 max-w-3xl">
          Here's your personal guide to showcasing your craft and growing your
          business with KalaKriti.
        </p>

        <div className="mt-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-10 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Start Your Product Journey
            </h2>
            <p className="mt-3 text-purple-100 max-w-lg">
              Launch a new product in a seamless flow. We'll guide you through
              photo enhancement, voice description, and final publishing with AI
              assistance.
            </p>
          </div>

          <button
            onClick={() => router.push("/artisan/add-product")}
            className="mt-6 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow"
          >
            Start One-Click Flow
          </button>
        </div>
      </div>

      {/* ==================== REQUEST CARDS ==================== */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Bargain Requests (0)
          </h3>
          <p className="text-gray-500">
            You have no pending bargain requests.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Connection Requests (0)
          </h3>
          <p className="text-gray-500">
            You have no pending connection requests.
          </p>
        </div>
      </div>

      {/* ==================== INTERACTION CENTER ==================== */}
      <div className="mt-12 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Interaction Center
        </h2>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 text-sm rounded-lg border ${
              activeTab === "requests"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            Custom Requests
          </button>

          <button
            onClick={() => setActiveTab("negotiations")}
            className={`px-4 py-2 text-sm rounded-lg border ${
              activeTab === "negotiations"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            Negotiations
          </button>
        </div>

        <div>
          {activeTab === "chats" && (
            <div className="space-y-3">
              {chatPreview.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">{c.title}</p>
                    <p className="text-xs text-black">
                      Last updated: Just now
                    </p>
                  </div>
                  <a
                    href="/chat"
                    className="text-emerald-600 text-sm font-medium hover:underline"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-3">
              {requestPreview.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-500">
                      Status: {r.status.replace("_", " ")}
                    </p>
                  </div>
                  <a
                    href="/chat"
                    className="text-emerald-600 text-sm font-medium hover:underline"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === "negotiations" && (
            <div className="space-y-3">
              {negotiationPreview.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl border bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {n.productName || "Negotiation"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Offer: ₹{n.offerAmount}
                    </p>
                  </div>
                  <a
                    href="/chat"
                    className="text-emerald-600 text-sm font-medium hover:underline"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
