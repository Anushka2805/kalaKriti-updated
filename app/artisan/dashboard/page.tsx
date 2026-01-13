"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ArtisanDashboard() {
  // --- FIXED TABS ---
  const tabList = ["chats", "requests", "negotiations"] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabList)[number]>("chats");
  const router = useRouter();   

  // --- DUMMY PREVIEW DATA (Replace with real API later) ---
  const chatPreview = [
  { id: "1", title: "Order discussion – Diwali Candles" },
];


  const requestPreview = [
    { id: "1", title: "Custom Packaging for Hampers", status: "IN_DISCUSSION" },
  ];

  const negotiationPreview = [
    { id: "1", productName: "Handmade Basket", offerAmount: 450 },
  ];

  return (
    <main className="p-10">

      {/* ==================== WELCOME SECTION ==================== */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back, Ruby!
        </h1>

        <p className="mt-2 text-gray-600 max-w-3xl">
          Here's your personal guide to showcasing your craft and growing your business
          with KalaKriti.
        </p>

        {/* PURPLE CTA BOX */}
        <div className="mt-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl p-10 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg">

          <div>
            <h2 className="text-2xl font-bold text-white">
              Start Your Product Journey
            </h2>
            <p className="mt-3 text-purple-100 max-w-lg">
              Launch a new product in a seamless flow. We'll guide you through photo enhancement,
              voice description, and final publishing with AI assistance.
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

        {/* Bargain Requests */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Bargain Requests (0)
          </h3>
          <p className="text-gray-500">
            You have no pending bargain requests.
          </p>
        </div>

        {/* Connection Requests */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Connection Requests (0)
          </h3>
          <p className="text-gray-500">
            You have no pending connection requests.
          </p>
        </div>
      </div>

      {/* ==================== INTERACTION CENTER (TABS) ==================== */}
      <div className="mt-12 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Interaction Center
        </h2>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("chats")}
            className={`px-4 py-2 text-sm rounded-lg border ${
              activeTab === "chats"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            Chats
          </button>

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

        {/* ========================== TAB CONTENT ========================== */}
        <div>
          {/* Chats */}
          {activeTab === "chats" && (
            <div className="space-y-3">
              {chatPreview.length === 0 ? (
                <p className="text-gray-500 text-sm">No chat conversations yet.</p>
              ) : (
                chatPreview.map((c) => (
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
                ))
              )}
            </div>
          )}

          {/* Requests */}
          {activeTab === "requests" && (
            <div className="space-y-3">
              {requestPreview.length === 0 ? (
                <p className="text-gray-500 text-sm">No customization requests yet.</p>
              ) : (
                requestPreview.map((r) => (
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
                ))
              )}
            </div>
          )}

          {/* Negotiations */}
          {activeTab === "negotiations" && (
            <div className="space-y-3">
              {negotiationPreview.length === 0 ? (
                <p className="text-gray-500 text-sm">No negotiations yet.</p>
              ) : (
                negotiationPreview.map((n) => (
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
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==================== GET STARTED ==================== */}
      <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-8">
        How to Get Started
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="font-semibold text-xl">Explore KalaKriti</h3>
          </div>

          <p className="mt-2 text-emerald-100 max-w-md">
            The heart of KalaKriti. Discover trending designs, marketing tools, and more.
          </p>

          <button className="mt-6 bg-white text-emerald-600 rounded-lg px-6 py-2 font-medium hover:bg-purple-50">
            Discover Now
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <span className="text-xl">📸</span>
            </div>
            <h3 className="font-semibold text-xl text-gray-800">
              Create Stunning Photos
            </h3>
          </div>

          <p className="mt-2 text-gray-600 max-w-md">
            Use our AI Photo Studio to create professional product images.
          </p>

          <button className="mt-6 w-full bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded-lg text-black">
            Go to Photo Studio
          </button>
        </div>
      </div>
    </main>
  );
}
