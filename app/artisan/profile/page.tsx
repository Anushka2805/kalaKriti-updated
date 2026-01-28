"use client";

import { useEffect, useState } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

export default function ArtisanProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  useEffect(() => {
    fetch("/api/artisan/profile", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load profile");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        speak(
          "Profile page khuli hai. Aap apna naam, phone, location aur bio bolke update kar sakte ho. Save profile bolkar save kar sakte ho."
        );
        listen(handleProfileVoice);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileVoice = (text: string) => {
    text = text.toLowerCase();

    if (!profile) return;

    if (text.startsWith("name")) {
      const value = text.replace("name", "").trim();
      setProfile({ ...profile, fullName: value });
      speak("Naam update ho gaya.");
      listen(handleProfileVoice);
      return;
    }

    if (text.startsWith("phone")) {
      const value = text.replace(/\D/g, "");
      setProfile({ ...profile, phone: value });
      speak("Phone number update ho gaya.");
      listen(handleProfileVoice);
      return;
    }

    if (text.startsWith("location")) {
      const value = text.replace("location", "").trim();
      setProfile({ ...profile, location: value });
      speak("Location update ho gayi.");
      listen(handleProfileVoice);
      return;
    }

    if (text.startsWith("bio")) {
      const value = text.replace("bio", "").trim();
      setProfile({ ...profile, bio: value });
      speak("Bio update ho gayi.");
      listen(handleProfileVoice);
      return;
    }

    if (text.includes("save")) {
      speak("Profile save ki ja rahi hai.");
      saveProfile();
      return;
    }

    if (text.includes("repeat")) {
      speak(
        "Aap bol sakte ho name, phone, location, bio, ya save profile."
      );
      listen(handleProfileVoice);
    }
  };

  async function saveProfile() {
    const res = await fetch("/api/artisan/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      alert("Failed to update profile");
      speak("Profile update fail ho gaya.");
      return;
    }

    alert("Profile updated");
    speak("Profile successfully update ho gaya.");
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profile) return <p className="p-6">No profile data</p>;

  /* ================= UI (UNCHANGED) ================= */

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <input
        className="w-full border p-2 mb-3"
        value={profile.fullName || ""}
        onChange={(e) =>
          setProfile({ ...profile, fullName: e.target.value })
        }
        placeholder="Full Name"
      />

      <input
        className="w-full border p-2 mb-3"
        value={profile.phone || ""}
        onChange={(e) =>
          setProfile({ ...profile, phone: e.target.value })
        }
        placeholder="Phone"
      />

      <input
        className="w-full border p-2 mb-3"
        value={profile.location || ""}
        onChange={(e) =>
          setProfile({ ...profile, location: e.target.value })
        }
        placeholder="Location"
      />

      <textarea
        className="w-full border p-2 mb-3"
        value={profile.bio || ""}
        onChange={(e) =>
          setProfile({ ...profile, bio: e.target.value })
        }
        placeholder="About you / your craft"
      />

      <button
        onClick={saveProfile}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </main>
  );
}
