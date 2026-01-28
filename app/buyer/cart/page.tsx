"use client";
import { useCart } from "@/store/cartContext";

export default function BuyerCartPage() {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <p className="p-10 text-center text-gray-500">
        Your cart is empty
      </p>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.productId}
          className="border p-4 rounded-xl flex justify-between items-center"
        >
          <div className="flex gap-4 items-center">
            {item.image && (
              <img
                src={item.image}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}

            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
              <p className="font-bold">
                ₹{item.price * item.quantity}
              </p>
            </div>
          </div>

          <button
            onClick={() => removeFromCart(item.productId)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="border-t pt-4 flex justify-between items-center">
        <p className="text-lg font-bold">
          Total: ₹{total}
        </p>

        <a
          href="/buyer/checkout"
          className="bg-emerald-600 text-white px-6 py-2 rounded-xl"
        >
          Checkout
        </a>
      </div>
    </main>
  );
}
