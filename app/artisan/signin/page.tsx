"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

export default function ArtisanSignin() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const role = "ARTISAN";

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  /* 🔊 INTRO */
  useEffect(() => {
    speak(
      "Namaste. Aap artisan ke roop me login kar rahe hain. Mic button dabaiye aur apna phone number boliye."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 🎤 MIC CLICK */
  const handleMicClick = () => {
    listen(handleVoiceLogin);
  };

  /* 🔁 SPEAK + LISTEN */
  const speakAndListen = (msg: string) => {
    speak(msg);
    setTimeout(() => listen(handleVoiceLogin), 600);
  };

  /* 🧠 VOICE LOGIC */
  const handleVoiceLogin = (text: string) => {
    const t = text.toLowerCase().trim();

    /* PHONE */
    if (!phone) {
      const digits = t.replace(/\D/g, "");
      if (digits.length === 10) {
        setPhone(digits);
        speak(
          "Phone number mil gaya. Ab password manually type kijiye. Uske baad mic dabakar login boliye."
        );
      } else {
        speakAndListen("Kripya 10 digit ka phone number boliye.");
      }
      return;
    }

    /* LOGIN COMMAND */
    if (
      (t.includes("login") || t.includes("sign in") || t.includes("signin")) &&
      password
    ) {
      speak("Login ho raha hai.");
      submitLogin();
      return;
    }

    if (!password) {
      speak("Kripya pehle password type kijiye, phir login boliye.");
    }
  };

  /* 🔐 SUBMIT (UNCHANGED) */
  async function submitLogin() {
    if (!phone || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone, password, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push("/artisan/dashboard");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitLogin();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4">

      {/* 🎤 MIC BUTTON (ADDED, UI SAME) */}
      <button
        type="button"
        onClick={handleMicClick}
        className="mb-4 p-3 rounded-full bg-emerald-600 text-white text-xl"
      >
        🎤
      </button>

      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-emerald-700">KalaKriti</h2>
        <p className="text-sm text-gray-500">Signin as Artisan</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border">
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
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          New here?
          <a
            href="/artisan/signup"
            className="text-emerald-600 font-semibold ml-1 hover:underline"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
