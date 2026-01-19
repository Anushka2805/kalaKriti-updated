"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuyerSignin() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const role = "BUYER";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!phone || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // 🔥 MUST
  body: JSON.stringify({
    phone,
    password,
    role,
  }),
});


    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    // TEMP (later cookies/session)
    

    router.push("/buyer");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">

      {/* Brand Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-emerald-700 tracking-wide">
          KalaKriti
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Sign in as Buyer
        </p>
      </div>

      {/* Signin Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">

        {/* Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button className="flex-1 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white">
            Buyer
          </button>

          <button
            type="button"
            onClick={() => router.push("/artisan/signin")}
            className="flex-1 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            Artisan
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Extra Actions */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <a href="/forgot-password" className="text-emerald-600 hover:underline">
            Forgot Password?
          </a>
          <a href="/buyer/signup" className="text-gray-600 hover:underline">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
