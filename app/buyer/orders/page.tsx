"use client";
import { useState } from "react";

// ✅ Define a proper type for Order
interface Order {
  id: string;
  name: string;
  price: number;
  date: string;
  status: "Fulfilled" | "Pending" | "Custom Order" | "Cancelled";
}

export default function BuyerOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);

  // ✅ Order State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-1001",
      name: "Handmade Vase",
      price: 1200,
      date: "Dec 2, 2024",
      status: "Fulfilled",
    },
    {
      id: "ORD-1002",
      name: "Macrame Wall Hanging",
      price: 950,
      date: "Nov 18, 2024",
      status: "Pending",
    },
    {
      id: "CUST-2001",
      name: "Custom Hand-painted Wall Plate",
      price: 2500,
      date: "Jan 5, 2025",
      status: "Custom Order",
    },
  ]);

  // ✅ Cancel Logic
  function cancelOrder(orderId: string) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
  }

  // ✅ Invoice Calculation Logic
  function calculateInvoice(order: Order, cancelled: boolean) {
    const penaltyRate = 0.15;
    const penalty = cancelled ? Math.round(order.price * penaltyRate) : 0;
    const refund = cancelled ? order.price - penalty : 0;

    return {
      orderValue: order.price,
      penalty,
      refund,
    };
  }

  // 🔹 VIEW 1: INVOICE / CANCELLATION DETAILS
  if (selectedOrder) {
    const invoice = calculateInvoice(selectedOrder, isCancelled);

    return (
      <main className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isCancelled ? "Cancellation Invoice" : "Order Invoice"}
        </h1>

        <div className="bg-white border rounded-xl p-6 space-y-4 shadow-sm text-gray-900">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Invoice ID</p>
              <p className="font-mono font-medium">INV-{selectedOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{selectedOrder.date}</p>
            </div>
          </div>

          <hr className="border-dashed" />

          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-medium text-lg">{selectedOrder.name}</p>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <span>Order Value</span>
              <span>₹{invoice.orderValue}</span>
            </div>

            {isCancelled && (
              <>
                <div className="flex justify-between text-red-600">
                  <span>Cancellation Penalty (15%)</span>
                  <span>- ₹{invoice.penalty}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Refund Amount</span>
                  <span>₹{invoice.refund}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                  * A 15% penalty is charged to compensate the artisan for time and
                  materials used on this order.
                </p>
              </>
            )}

            {!isCancelled && (
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total Paid</span>
                <span>₹{invoice.orderValue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons in Detail View */}
        <div className="mt-6 space-y-3">
          {/* If the user is viewing cancellation details, show Confirm Cancel button */}
          {isCancelled && selectedOrder.status !== "Cancelled" && (
            <button
              onClick={() => {
                cancelOrder(selectedOrder.id);
                // Update local view state immediately to reflect change
                setSelectedOrder({ ...selectedOrder, status: "Cancelled" });
                // We keep isCancelled true to show the penalty invoice
              }}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Confirm Cancellation
            </button>
          )}

          <button
            onClick={() => {
              setSelectedOrder(null);
              setIsCancelled(false);
            }}
            className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
          >
            ← Back to Orders
          </button>
        </div>
      </main>
    );
  }

  // 🔹 VIEW 2: ORDER LIST
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Orders</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-gray-500">
                  {order.id}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.status === "Fulfilled"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 leading-tight">
                {order.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{order.date}</p>
              <p className="font-bold text-lg mt-3 text-gray-900">
                ₹{order.price}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsCancelled(false); // Just viewing normal invoice
                }}
                className="w-full text-sm py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition"
              >
                View Invoice
              </button>

              {order.status !== "Fulfilled" && order.status !== "Cancelled" && (
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsCancelled(true); // Viewing cancellation preview
                  }}
                  className="w-full text-sm py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
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