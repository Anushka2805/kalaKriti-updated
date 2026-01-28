"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

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

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  useEffect(() => {
    speak("Namaste. Main aapka account banane me madad karungi. Aap apna poora naam boliye.");
    listen(handleSignupVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignupVoice = (text: string) => {
    text = text.toLowerCase();

    if (!fullName) {
      setFullName(text);
      speak("Naam set ho gaya. Ab phone number boliye.");
      listen(handleSignupVoice);
      return;
    }

    if (!phone) {
      const digits = text.replace(/\D/g, "");
      if (digits.length === 10) {
        setPhone(digits);
        speak("Phone number set ho gaya. Ab password manually type kijiye.");
      } else {
        speak("Kripya 10 digit ka phone number boliye.");
        listen(handleSignupVoice);
      }
      return;
    }

    if (!language && role === "artisan") {
      speak("Preferred language select kijiye.");
      return;
    }
  };

  /* ================= NORMAL SUBMIT (UNCHANGED) ================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
      role: role.toUpperCase(),
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
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    router.push("/artisan/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">

      {/* HEADER */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">KalaKriti</h2>
        <p className="text-gray-500">Signup as Artisan</p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="input" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Preferred Language</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>

          <input className="input" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          <input className="input" placeholder="Type of Craft" value={craftType} onChange={(e) => setCraftType(e.target.value)} />
          <input className="input" type="number" placeholder="Years of Experience" value={experience ?? ""} onChange={(e) => setExperience(Number(e.target.value))} />
          <input className="input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />

          <button disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* ✅ SIGN IN LINK (FIXED) */}
      <p className="text-center text-sm mt-6 text-gray-600">
        Already have an account?
        <a href="/artisan/signin" className="text-emerald-600 font-semibold ml-1 hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
}
