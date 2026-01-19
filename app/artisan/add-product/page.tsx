"use client";

import { useState, useEffect } from "react";


type Step =
    | 0
    | 1
    | 2
    | 3
    | 4;

const steps: string[] = [
    "Product Details",
    "Upload Images",
    "Size & Dimensions",
    "Category",
    "Publish",
];

interface Dimensions {
    length: string;
    width: string;
    height: string;
}

export default function AddProduct() {
    const [step, setStep] = useState<Step>(0);

    const [productName, setProductName] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        const remainingSlots = 4 - images.length;
        const filesToAdd = selectedFiles.slice(0, remainingSlots);

        setImages((prev) => [...prev, ...filesToAdd]);
    };

    // const [artisanId, setArtisanId] = useState<string | null>(null);

    //     useEffect(() => {
    //     const id = localStorage.getItem("userId");
    //     setArtisanId(id);
    //     }, []);


    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const [dimensions, setDimensions] = useState<Dimensions>({
        length: "",
        width: "",
        height: "",
    });
    const uploadImages = async () => {
  if (images.length === 0) return [];

  const uploadedUrls: string[] = [];

  for (const file of images) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    uploadedUrls.push(data.url);
  }

  return uploadedUrls;
};


const handlePublish = async () => {
  if (!productName || !price) {
    alert("Product name and price required");
    return;
  }
//   if (!artisanId) {
//     alert("Not logged in");
//     return;
//   }
  try{

    const imageUrls = await uploadImages();
    if (imageUrls.length === 0) {
      alert("Please upload at least one image");
      return;
    }

  const res = await fetch("/api/artisan/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: productName,
      description,
      price: Number(price),
      basePrice: Number(price),
      images : imageUrls,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
      alert(data.error || "Failed to publish");
      return;
  }

  alert("Product published 🎉");
  window.location.href = "/artisan/products";
}catch (err) {
    console.error(err);
    alert("failed to publish product");
  }
};
    const [category, setCategory] = useState<string>("");

    const nextStep = () => {
        if (step < 4) setStep((step + 1) as Step);
    };

    const prevStep = () => {
        if (step > 0) setStep((step - 1) as Step);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Handicraft
            </h1>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-10">
                {steps.map((label, index) => (
                    <div key={index} className="flex-1 flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
              ${index <= step
                                    ? "bg-emerald-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {index + 1}
                        </div>

                        <p
                            className={`ml-2 text-sm font-medium
              ${index <= step ? "text-emerald-600" : "text-gray-500"}`}
                        >
                            {label}
                        </p>

                        {index !== steps.length - 1 && (
                            <div className="flex-1 h-[2px] bg-gray-200 mx-4" />
                        )}
                    </div>
                ))}
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl">

                {/* STEP 1 – PRODUCT DETAILS */}
                {step === 0 && (
                    <div className="space-y-4">
                        <input
                            className="input"
                            placeholder="Product Name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />

                        <input
                            className="input"
                            placeholder="Price (₹)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            className="input h-28 resize-none"
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                )}

                {/* STEP 2 – IMAGES */}
                {step === 1 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload up to 4 product images
                        </p>

                        {/* Upload Input */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            id="imageUpload"
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        {/* Image Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="h-32 w-full object-cover rounded-lg border"
                                    />

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            {/* Upload Box */}
                            {images.length < 4 && (
                                <label
                                    htmlFor="imageUpload"
                                    className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center text-gray-400 hover:border-emerald-500 cursor-pointer"
                                >
                                    + Upload
                                </label>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3 – DIMENSIONS */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            className="input"
                            placeholder="Length (cm)"
                            value={dimensions.length}
                            onChange={(e) =>
                                setDimensions({ ...dimensions, length: e.target.value })
                            }
                        />

                        <input
                            className="input"
                            placeholder="Width (cm)"
                            value={dimensions.width}
                            onChange={(e) =>
                                setDimensions({ ...dimensions, width: e.target.value })
                            }
                        />

                        <input
                            className="input"
                            placeholder="Height (cm)"
                            value={dimensions.height}
                            onChange={(e) =>
                                setDimensions({ ...dimensions, height: e.target.value })
                            }
                        />
                    </div>
                )}

                {/* STEP 4 – CATEGORY */}
                {step === 3 && (
                    <div className="space-y-4">
                        <select
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            <option value="paintings">Paintings</option>
                            <option value="pots">Pots & Ceramics</option>
                            <option value="woodwork">Woodwork</option>
                            <option value="textiles">Textiles</option>
                            <option value="jewellery">Jewellery</option>
                        </select>
                    </div>
                )}

                {/* STEP 5 – PUBLISH */}
                {step === 4 && (
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Ready to Publish?
                        </h3>
                        <p className="text-sm text-gray-600">
                            Please review your product details before publishing.
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        disabled={step === 0}
                        onClick={prevStep}
                        className="px-6 py-2 rounded-lg border text-gray-600 disabled:opacity-40"
                    >
                        Back
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={nextStep}
                            className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handlePublish}
                            className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            Publish Product
                        </button>
                        

                    )}
                </div>
            </div>
        </div>
    );
}
