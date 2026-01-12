"use client";

import { useEffect, useState } from "react";
import { FiCheck, FiX, FiRefreshCw, FiClock, FiDollarSign } from "react-icons/fi";

export default function ArtisanNegotiationDashboard() {
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterInput, setCounterInput] = useState<{ [key: string]: string }>({});

  // Fetch negotiations on load
  useEffect(() => {
    fetchNegotiations();
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

  async function handleAction(id: string, action: "ACCEPT" | "REJECT" | "COUNTER") {
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
        fetchNegotiations(); // Refresh list after action
        // Clear input if counter
        if (action === "COUNTER") {
            setCounterInput(prev => {
                const newState = {...prev};
                delete newState[id];
                return newState;
            })
        }
      } else {
        alert("Action failed");
      }
    } catch (err) {
      alert("Error processing request");
    }
  }

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Negotiation Requests</h1>
            <p className="text-gray-500">Manage incoming price offers from buyers.</p>
        </div>
        <button onClick={fetchNegotiations} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
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
              {/* Product Info */}
              <div className="flex gap-4 items-start md:w-1/3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {/* Fallback image if product image is missing in DB */}
                   <img src={item.product?.image || "/placeholder.jpg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product?.name || "Unknown Product"}</h3>
                  <p className="text-sm text-gray-500">Base Price: ₹{item.basePrice}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                    ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      item.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Offer Details */}
              <div className="flex-1 border-l pl-0 md:pl-6 border-gray-100 flex flex-col justify-center">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-gray-500">Buyer offered:</span>
                    <span className="text-xl font-bold text-gray-900">₹{item.buyerOffer}</span>
                    <span className="text-xs text-red-500 font-medium">
                        ({Math.round(((item.basePrice - item.buyerOffer) / item.basePrice) * 100)}% off)
                    </span>
                </div>
                
                {item.status === "COUNTERED" && (
                    <p className="text-sm text-emerald-600 font-medium">
                        You countered: ₹{item.artisanCounter}
                    </p>
                )}
              </div>

              {/* Actions */}
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
                        
                        {/* Counter Offer Input */}
                        <div className="flex gap-2 mt-1">
                            <input 
                                type="number" 
                                placeholder="Counter amount..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder-gray-500"
                                value={counterInput[item.id] || ""}
                                onChange={(e) => setCounterInput({...counterInput, [item.id]: e.target.value})}
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