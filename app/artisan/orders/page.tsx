"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  orderNumber: string;
  title: string;
  amount: number;
  status: "PENDING" | "FULFILLED" | "CANCELLED";
  createdAt: string;
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artisan/orders", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-10 text-gray-500">Loading orders...</p>;
  }

  const pendingOrders = orders.filter(o => o.status === "PENDING");
  const fulfilledOrders = orders.filter(o => o.status === "FULFILLED");
const cancelledOrders = orders.filter(o => o.status === "CANCELLED");

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
      <p className="text-gray-600 mt-2 max-w-2xl">
        Track your previous and ongoing orders easily.
      </p>

      {/* PENDING ORDERS */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Pending Orders</h2>

        {pendingOrders.length === 0 ? (
          <p className="text-gray-500">No pending orders 🎉</p>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* FULFILLED ORDERS */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Fulfilled Orders</h2>

        {fulfilledOrders.length === 0 ? (
          <p className="text-gray-500">No fulfilled orders yet.</p>
        ) : (
          <div className="space-y-4">
            {fulfilledOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ---------------- ORDER CARD ---------------- */

function OrderCard({ order }: { order: Order }) {
  async function updateStatus(status: "FULFILLED" | "CANCELLED") {
    await fetch("/api/artisan/orders", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        status,
      }),
    });

    window.location.reload();
  }

  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm flex justify-between items-center
        ${order.status === "PENDING" ? "border-l-4 border-emerald-500" : ""}
      `}
    >
      <div>
        <p className="font-medium text-gray-900">
          {order.title}
          {order.status === "PENDING" && (
            <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
              New
            </span>
          )}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Order ID: {order.orderNumber} ·{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="text-right space-y-2">
        <div>
          <span className="font-semibold text-gray-900">
            ₹{order.amount}
          </span>

          <span
            className={`ml-3 inline-block text-xs px-3 py-1 rounded-full ${
              order.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {order.status === "PENDING" && (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => updateStatus("FULFILLED")}
              className="px-3 py-1 text-xs bg-emerald-600 text-white rounded"
            >
              Accept / Fulfill
            </button>

            <button
              onClick={() => updateStatus("CANCELLED")}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
