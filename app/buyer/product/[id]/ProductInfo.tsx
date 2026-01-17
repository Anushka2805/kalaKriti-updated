export default function ProductInfo({ product }: { product: any }) {
  return (
    <div className="border border-gray-100 rounded-3xl bg-white p-4 shadow-sm space-y-3">
      <p className="text-[11px] text-emerald-700 font-semibold uppercase">
        {product.category || "Category"}
      </p>

      <h1 className="text-lg md:text-xl font-semibold text-gray-900">
        {product.name}
      </h1>

      <p className="text-xs text-gray-700">
        Handmade by {product.artisan?.fullName || "artisan"}
      </p>

      <p className="text-sm text-gray-700 line-clamp-3">
        {product.description}
      </p>

      <p className="text-2xl font-semibold text-gray-900">
        ₹{product.price}
      </p>

      <p className="text-[11px] text-gray-500">
        Base price per unit
      </p>
    </div>
  );
}
