"use client";

export default function BuyerSignup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">

      {/* Brand Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-emerald-700 tracking-wide">
          KalaKriti
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Signup as Buyer
        </p>
      </div>

      {/* Signup Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">

        <div className="space-y-4">
          <input className="input" placeholder="Full Name" />
          <input className="input" placeholder="Email Address" />
          <input className="input" type="password" placeholder="Password" />

          <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition">
            Sign Up as Buyer
          </button>
        </div>

        {/* Switch to Artisan */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Are you an artisan?
          <a
            href="/artisan/signup"
            className="text-emerald-600 font-semibold ml-1 hover:underline"
          >
            Signup as Artisan
          </a>
        </p>

        {/* Login */}
        <p className="text-center text-sm mt-2 text-gray-600">
          Already have an account?
          <a
            href="/buyer/signin"
            className="text-emerald-600 font-semibold ml-1 hover:underline"
          >
            Sign In
          </a>
        </p>

      </div>
    </div>
  );
}
