"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ArtisanSignup() {
  const [role, setRole] = useState<"artisan" | "buyer">("artisan");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
const [city, setCity] = useState("");
const [language, setLanguage] = useState("");
const [state, setState] = useState("");
const [craftType, setCraftType] = useState("");
const [experience, setExperience] = useState<number | undefined>();
const router = useRouter();


  // 👇 YAHAN handleSubmit aayega
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ✅ VALIDATION (sabse pehle)
  if (!fullName || !phone || !password) {
    alert("Please fill all required fields");
    return;
  }

  if (phone.length !== 10) {
    alert("Phone number must be 10 digits");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

    setLoading(true);

    const payload = {
      role: role.toUpperCase(), // IMPORTANT
      fullName,
      phone,
      password,
      email,
      city,
      language,
      state,
      craftType,
      experience,
    };

    const res = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // 🔥 MUST
  body: JSON.stringify(payload),
});

const data = await res.json();
setLoading(false);

if (!res.ok) {
  alert(data.error || "Signup failed");
  return;
}

if (role === "artisan") {
  router.push("/artisan/dashboard");
} else {
  router.push("/buyer");
}


  }

  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">

      {/* Brand Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700 text-center">
          KalaKriti
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {role === "artisan" ? "Signup as Artisan" : "Signup as Buyer"}
        </p>
      </div>

      {/* Signup Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">

        {/* TOGGLE */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type = "button"
            onClick={() => setRole("artisan")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              role === "artisan"
                ? "bg-emerald-600 text-white"
                : "text-gray-600"
            }`}
          >
            Artisan
          </button>
          <button
          type = "button"
            onClick={() => setRole("buyer")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              role === "buyer"
                ? "bg-emerald-600 text-white"
                : "text-gray-600"
            }`}
          >
            Buyer
          </button>
          

        </div>

        


        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="input" 
            placeholder="Full Name"
            value = {fullName} 
            onChange={(e) => setFullName(e.target.value)}
          />
          
          <input 
            className="input" 
            placeholder="Phone Number" 
            value = {phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input 
            className="input" 
            type="password" 
            placeholder="Password" 
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            />

          {/* ARTISAN-ONLY FIELDS */}
          {role === "artisan" && (
            <>

          <select 
            className="input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Preferred Language</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>

          <input 
            className="input" 
            placeholder="State (e.g. Rajasthan)"
            value = {state}
            onChange={(e) => setState(e.target.value)} />
          <input
            className="input"
            placeholder="Type of Craft (e.g. Pottery, Madhubani)"
            value = {craftType}
            onChange={(e) => setCraftType(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Years of Experience"
            min={0}
            value = {experience ?? ""}
            onChange={(e) => setExperience(Number(e.target.value))}
          />
          <input
            className="input"
            placeholder="Email Address (optional)"
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </>
          )}

          {/* BUYER-ONLY FIELDS */}
          {role === "buyer" && (
            <>
              <input
                className="input"
                placeholder="City or Pincode (optional)"
                value = {city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                className="input"
                placeholder="Email Address (optional)"
                value = {email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" className="mt-1" />
                <span>
                  I agree to the{" "}
                  <span className="text-emerald-600 font-medium">
                    Terms & Privacy Policy
                  </span>
                </span>
              </label>
            </>
          )}


          <button 
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition">
            {/* {role === "artisan" ? "Sign Up as Artisan" : "Sign Up as Buyer"} */}
            {loading ? "Signing up..." : "Sign Up"}
            
          </button>

          {/* ✅ GOOGLE BUTTON – UI ONLY */}
          <button
            type="button"
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 mt-4"
          >
            <span>🔐</span>
            Sign in with Google
          </button>

        </form>
        </div>

        {/* Switch to Buyer */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?
          <a
            href={role === "artisan" ? "/artisan/signin" : "/buyer/signin"}
            className="text-emerald-600 font-semibold ml-1 hover:underline"
          >
            Sign In
            
          </a>
        </p>

        {/* Login */}
        {/* <p className="text-center text-sm mt-2 text-gray-600">
          Already have an account?
          <a
            href={role === "artisan" ? "/artisan/signin" : "/buyer/signin"}
            className="text-emerald-600 font-semibold ml-1 hover:underline"
          >
            Sign In
          </a>
        </p> */}

      </div>
    
  );    
}
