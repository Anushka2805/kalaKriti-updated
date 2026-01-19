"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */

interface Order {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  status: "PENDING" | "FULFILLED" | "CANCELLED";
  isCustom: boolean;
}

/* ================= COMPONENT ================= */

export default function BuyerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCancelledPreview, setIsCancelledPreview] = useState(false);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    fetch("/api/buyer/orders", { credentials: "include" })
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  /* ================= CANCEL ORDER ================= */
  async function cancelOrder(orderId: string) {
    await fetch("/api/buyer/orders/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderId }),
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "CANCELLED" } : o
      )
    );

    if (selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status: "CANCELLED" });
    }
  }

  /* ================= INVOICE LOGIC ================= */
  function calculateInvoice(order: Order, cancelled: boolean) {
    const penalty = cancelled ? Math.round(order.amount * 0.15) : 0;
    const refund = cancelled ? order.amount - penalty : 0;

    return { penalty, refund };
  }

  /* ================= INVOICE VIEW ================= */
  if (selectedOrder) {
    const invoice = calculateInvoice(selectedOrder, isCancelledPreview);

    return (
      <main className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isCancelledPreview ? "Cancellation Invoice" : "Order Invoice"}
        </h1>

        <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm">
          <p className="font-mono text-sm text-gray-500">
            INV-{selectedOrder.id}
          </p>

          <p className="font-semibold text-lg">{selectedOrder.title}</p>
          <p className="text-sm text-gray-500">
            {new Date(selectedOrder.createdAt).toDateString()}
          </p>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Order Value</span>
              <span>₹{selectedOrder.amount}</span>
            </div>

            {isCancelledPreview && (
              <>
                <div className="flex justify-between text-red-600">
                  <span>Cancellation Penalty (15%)</span>
                  <span>-₹{invoice.penalty}</span>
                </div>

                <div className="flex justify-between font-bold">
                  <span>Refund</span>
                  <span>₹{invoice.refund}</span>
                </div>
              </>
            )}

            {!isCancelledPreview && (
              <div className="flex justify-between font-bold">
                <span>Total Paid</span>
                <span>₹{selectedOrder.amount}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isCancelledPreview && selectedOrder.status !== "CANCELLED" && (
            <button
              onClick={() => cancelOrder(selectedOrder.id)}
              className="w-full bg-red-600 text-white py-3 rounded-lg"
            >
              Confirm Cancellation
            </button>
          )}

          <button
            onClick={() => {
              setSelectedOrder(null);
              setIsCancelledPreview(false);
            }}
            className="w-full bg-gray-900 text-white py-3 rounded-lg"
          >
            ← Back to Orders
          </button>
        </div>
      </main>
    );
  }

  /* ================= ORDERS LIST ================= */
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-5 bg-white shadow-sm"
          >
            <div className="flex justify-between mb-2">
              <span className="text-xs font-mono">{order.id}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  order.status === "FULFILLED"
                    ? "bg-green-100 text-green-700"
                    : order.status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <h3 className="font-semibold">{order.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toDateString()}
            </p>

            <p className="font-bold text-lg mt-2">₹{order.amount}</p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsCancelledPreview(false);
                }}
                className="w-full border py-2 rounded-lg"
              >
                View Invoice
              </button>

              {order.status === "PENDING" && (
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsCancelledPreview(true);
                  }}
                  className="w-full border border-red-200 text-red-600 py-2 rounded-lg"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
