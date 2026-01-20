"use client";

import { useEffect, useState } from "react";

export default function ArtisanProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artisan/profile", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load profile");
        }
        return res.json();
      })
      .then(setProfile)
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    const res = await fetch("/api/artisan/profile", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      alert("Failed to update profile");
      return;
    }

    alert("Profile updated");
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profile) return <p className="p-6">No profile data</p>;

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
