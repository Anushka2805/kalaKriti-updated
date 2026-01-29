"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";


export default function ArtisanSignup() {
  const [role] = useState<"artisan" | "buyer">("artisan");
  const [loading, setLoading] = useState(false);


  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailSkipped, setEmailSkipped] = useState(false);


  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [state, setState] = useState("");
  const [craftType, setCraftType] = useState("");
  const [experience, setExperience] = useState<number | undefined>();


  const router = useRouter();
  const { speak, listen } = useVoiceAssistant();


  /* 🔊 INTRO */
  useEffect(() => {
    speak(
      "Namaste. Mai aapki voice assistant hu. Agar aap already registered user hain, to sign in boliye ya neeche sign in par click kijiye. Mic button dabaiye aur apna poora naam boliye."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /* 🎤 MIC */
  const handleMicClick = () => {
    listen(handleSignupVoice);
  };


  /* 🧠 VOICE LOGIC */
  const handleSignupVoice = (text: string) => {
    const t = text.toLowerCase().trim();


    /* 🔑 SIGN IN (VOICE) */
    if (t.includes("sign in") || t.includes("signin")) {
      speak("Sign in page par le ja rahe hain.");
      router.push("/artisan/signin");
      return;
    }


    /* NAME */
    if (!fullName) {
      setFullName(t);
      speak("Naam save ho gaya. Ab phone number boliye.");
      return;
    }


    /* PHONE */
    if (!phone) {
      const digits = t.replace(/\D/g, "");
      if (digits.length === 10) {
        setPhone(digits);
        speak("Phone number save ho gaya. Ab apna state boliye.");
      } else {
        speak("Kripya 10 digit ka phone number boliye.");
      }
      return;
    }


    /* STATE */
    if (!state) {
      setState(t);
      speak("State save ho gaya. Ab kaunsi craft karte hain wo boliye.");
      return;
    }


    /* CRAFT */
    if (!craftType) {
      setCraftType(t);
      speak("Craft save ho gayi. Ab experience kitne saal ka hai wo boliye.");
      return;
    }


    /* EXPERIENCE */
    if (!experience) {
      const years = parseInt(t.replace(/\D/g, ""));
      if (!isNaN(years)) {
        setExperience(years);
        speak(
          "Experience save ho gaya. Agar email dena chahte hain to boliye, warna skip email boliye."
        );
      } else {
        speak("Kripya experience saalon mein boliye.");
      }
      return;
    }


    /* EMAIL (OPTIONAL) */
    if (!email && !emailSkipped) {
      if (t.includes("skip") || t.includes("nahi") || t.includes("chhod")) {
        setEmailSkipped(true);
        speak("Email skip kar diya gaya. Ab signup boliye.");
        return;
      }


      if (t.includes("@")) {
        setEmail(t.replace(/\s/g, ""));
        speak("Email save ho gaya. Ab signup boliye.");
        return;
      }


      speak("Valid email boliye ya skip email boliye.");
      return;
    }


    /* ✅ SIGNUP — NOW ALWAYS REACHABLE */
    if (t.includes("signup") || t.includes("sign up")) {
      speak("Signup ho raha hai.");
      submitForm();
    }
  };


  /* 🔐 SUBMIT */
  const submitForm = async () => {
    if (!fullName || !phone || !password) {
      speak("Password type karna zaroori hai.");
      return;
    }


    setLoading(true);


    const payload = {
      role: role.toUpperCase(),
      fullName,
      phone,
      password,
      email: emailSkipped ? "" : email,
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


    setLoading(false);


    if (!res.ok) {
      speak("Signup fail ho gaya.");
      return;
    }


    router.push("/artisan/dashboard");
  };


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitForm();
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">
      {/* 🎤 MIC */}
      <button
        type="button"
        onClick={handleMicClick}
        className="mb-4 p-3 rounded-full bg-emerald-600 text-white text-xl"
      >
        🎤
      </button>


      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">KalaKriti</h2>
        <p className="text-gray-500">Signup as Artisan</p>
      </div>


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


      {/* ✅ SIGN IN UI — RESTORED */}
      <p className="text-center text-sm mt-6 text-gray-600">
        Already have an account?
        <a
          href="/artisan/signin"
          className="text-emerald-600 font-semibold ml-1 hover:underline"
        >
          Sign In
        </a>
      </p>
    </div>
  );
}
