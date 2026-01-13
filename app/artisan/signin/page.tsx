"use client";
import { useRouter } from "next/navigation";

export default function ArtisanSignin() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">

      {/* Brand Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-emerald-700 tracking-wide">
          KalaKriti
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Signin as Artisan
        </p>
      </div>

      {/* Signin Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">

        {/* Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => router.push("/buyer/signin")}
            className="flex-1 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            Buyer
          </button>

          <button
            className="flex-1 py-2 rounded-md text-sm font-medium bg-emerald-600 text-white"
          >
            Artisan
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            className="input"
            placeholder="Email Address or Phone Number"
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
          />

          <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition">
            Sign In
          </button>
        </div>

        {/* Extra Actions */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <a href="/forgot-password" className="text-emerald-600 hover:underline">
            Forgot Password?
          </a>
          <a href="/artisan/signup" className="text-gray-600 hover:underline">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
