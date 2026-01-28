"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

export default function ArtisanNegotiationDashboard() {
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterInput, setCounterInput] = useState<{ [key: string]: string }>({});

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  useEffect(() => {
    fetchNegotiations();
    speak(
      "Negotiation dashboard khula hai. Aap bol sakte ho accept, reject, ya counter price."
    );
    listen(handleNegotiationVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNegotiations() {
    try {
      const res = await fetch("/api/negotiations/artisan");
      if (res.ok) {
        const data = await res.json();
        setNegotiations(data);
      }
    } catch (error) {
      console.error("Failed to load negotiations", error);
    } finally {
      setLoading(false);
    }
  }

  const handleNegotiationVoice = (text: string) => {
    text = text.toLowerCase();

    if (negotiations.length === 0) {
      speak("Koi active negotiation nahi hai.");
      return;
    }

    const first = negotiations[0];

    if (text.includes("accept")) {
      speak("Negotiation accept ki ja rahi hai.");
      handleAction(first.id, "ACCEPT");
      return;
    }

    if (text.includes("reject")) {
      speak("Negotiation reject ki ja rahi hai.");
      handleAction(first.id, "REJECT");
      return;
    }

    if (text.includes("counter")) {
      const price = text.replace(/\D/g, "");
      if (!price) {
        speak("Counter price boliye.");
        listen(handleNegotiationVoice);
        return;
      }
      setCounterInput((prev) => ({ ...prev, [first.id]: price }));
      handleAction(first.id, "COUNTER");
      return;
    }

    if (text.includes("refresh")) {
      fetchNegotiations();
      speak("Negotiations refresh ho gayi hain.");
      return;
    }

    if (text.includes("repeat")) {
      speak(
        "Aap bol sakte ho accept, reject, counter price, ya refresh."
      );
      listen(handleNegotiationVoice);
    }
  };

  async function handleAction(
    id: string,
    action: "ACCEPT" | "REJECT" | "COUNTER"
  ) {
    const body: any = { negotiationId: id, action };

    if (action === "COUNTER") {
      const price = counterInput[id];
      if (!price) return alert("Please enter a counter price");
      body.counterPrice = price;
    }

    try {
      const res = await fetch("/api/negotiations/artisan-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchNegotiations();
        if (action === "COUNTER") {
          setCounterInput((prev) => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
          });
        }
      } else {
        alert("Action failed");
      }
    } catch (err) {
      alert("Error processing request");
    }
  }

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;

  /* ================= UI (UNCHANGED) ================= */

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Negotiation Requests
          </h1>
          <p className="text-gray-500">
            Manage incoming price offers from buyers.
          </p>
        </div>
        <button
          onClick={fetchNegotiations}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <FiRefreshCw />
        </button>
      </div>

      {negotiations.length === 0 ? (
        <div className="text-center py-12 border rounded-2xl bg-gray-50 text-gray-500">
          No active negotiations found.
        </div>
      ) : (
        <div className="grid gap-4">
          {negotiations.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6"
            >
              <div className="flex gap-4 items-start md:w-1/3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product?.image || "/placeholder.jpg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.product?.name || "Unknown Product"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Base Price: ₹{item.basePrice}
                  </p>
                </div>
              </div>

              <div className="flex-1 border-l pl-0 md:pl-6 border-gray-100 flex flex-col justify-center">
                <span className="text-xl font-bold text-gray-900">
                  ₹{item.buyerOffer}
                </span>
              </div>

              <div className="md:w-1/3 flex flex-col justify-center gap-2">
                {item.status === "PENDING" ? (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(item.id, "ACCEPT")}
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-1"
                      >
                        <FiCheck /> Accept
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "REJECT")}
                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        <FiX /> Reject
                      </button>
                    </div>

                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        placeholder="Counter amount..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        value={counterInput[item.id] || ""}
                        onChange={(e) =>
                          setCounterInput({
                            ...counterInput,
                            [item.id]: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() => handleAction(item.id, "COUNTER")}
                        className="bg-gray-900 text-white px-3 rounded-lg text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-sm text-gray-400 italic">
                    No actions available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
