"use client";

import { useEffect, useState } from "react";

export default function BuyerProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/buyer/profile", { credentials: "include" })
      .then(res => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  if (!profile) {
    return <p className="p-8 text-center">Loading profile…</p>;
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="mt-6 bg-white rounded-xl shadow-sm border p-6">
        <img
          src="https://i.pravatar.cc/100"
          className="w-20 h-20 rounded-full mx-auto"
        />

        <h2 className="text-center text-xl font-semibold mt-3">
          {profile.fullName}
        </h2>

        <p className="text-center text-gray-500">
          {profile.email || "Email not added"}
        </p>

        <div className="mt-6 space-y-4">
          <p className="border-b pb-2 text-gray-700">
            Phone: {profile.phone}
          </p>

          <p className="border-b pb-2 text-gray-700">
            City: {profile.city || "Not added"}
          </p>

          <p className="border-b pb-2 text-gray-700">
            Joined: {new Date(profile.createdAt).toDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}
