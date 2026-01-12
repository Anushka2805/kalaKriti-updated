"use client"; 

 

import { useState } from "react"; 

import { motion } from "framer-motion"; 

import { useImageStore } from "@/lib/store/imageStore"; 

 

/* helper: File → base64 */ 

function fileToBase64(file: File): Promise<string> { 

  return new Promise((resolve, reject) => { 

    const reader = new FileReader(); 

    reader.onload = () => resolve(reader.result as string); 

    reader.onerror = reject; 

    reader.readAsDataURL(file); 

  }); 

} 

 

export default function StudioPage() { 

  const { imagePreview, analysis, setImageData } = useImageStore(); 

  const [loading, setLoading] = useState(false); 

 

  async function analyzeNewImage(file: File) { 

    try { 

      setLoading(true); 

 

      const base64 = await fileToBase64(file); 

 

      const form = new FormData(); 

      form.append("image", file); 

 

      const res = await fetch("/api/analyze", { 

        method: "POST", 

        body: form, 

      }); 

 

      const json = await res.json(); 

 

      if (!res.ok) { 

        alert(json.error || "AI processing failed."); 

        return; 

      } 

 

      // ✅ overwrite ONLY when user uploads new image 

      setImageData(base64, json); 

    } catch (err) { 

      alert("Something went wrong."); 

    } finally { 

      setLoading(false); 

    } 

  } 

 

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) { 

    const file = e.target.files?.[0]; 

    if (!file) return; 

    analyzeNewImage(file); 

  } 

 

  return ( 

    <main className="p-10 text-black"> 

      <h1 className="text-3xl font-bold">AI Studio</h1> 

      <p className="text-gray-700 mt-2"> 

        Refine pricing, trends & design ideas. 

      </p> 

 

      {/* IMAGE PREVIEW / UPLOAD */} 

      <div className="mt-6 border-2 border-dashed rounded-xl p-6 text-center"> 

        {!imagePreview ? ( 

          <> 

            <input 

              type="file" 

              accept="image/*" 

              onChange={onUpload} 

              className="hidden" 

              id="fileInput" 

            /> 

            <label htmlFor="fileInput" className="cursor-pointer text-gray-600"> 

              Upload image to start 

            </label> 

          </> 

        ) : ( 

          <> 

            <img 

              src={imagePreview} 

              className="mx-auto w-56 h-56 object-cover rounded-lg shadow" 

              alt="Preview" 

            /> 

            <input 

              type="file" 

              accept="image/*" 

              onChange={onUpload} 

              className="hidden" 

              id="changeImage" 

            /> 

            <label 

              htmlFor="changeImage" 

              className="mt-4 inline-block cursor-pointer text-blue-600 underline" 

            > 

              Change Image 

            </label> 

          </> 

        )} 

 

        {loading && ( 

          <p className="mt-3 text-emerald-600 animate-pulse"> 

            Analyzing new image… 

          </p> 

        )} 

      </div> 

 

      {/* RESULTS */} 

      {analysis && ( 

        <motion.div 

          className="mt-10 grid md:grid-cols-3 gap-6" 

          initial={{ opacity: 0, y: 20 }} 

          animate={{ opacity: 1, y: 0 }} 

        > 

          {/* TREND */} 

          <div className="bg-white p-6 rounded-xl shadow border"> 

            <h2 className="text-lg font-bold text-emerald-700"> 

              Trend Insight 

            </h2> 

            <p className="mt-3 text-sm"> 

              Based on visual appeal & style, this product has 

              <strong> medium market demand</strong>. 

            </p> 

          </div> 

 

          {/* DESIGN */} 

          <div className="bg-white p-6 rounded-xl shadow border"> 

            <h2 className="text-lg font-bold text-blue-600"> 

              Design Recommendations 

            </h2> 

            <ul className="list-disc ml-5 mt-4 text-sm space-y-2"> 

              <li>Try a matte finish variant</li> 

              <li>Introduce pastel color options</li> 

              <li>Experiment with minimal patterns</li> 

            </ul> 

          </div> 

 

          {/* PRICING */} 

          <div className="bg-white p-6 rounded-xl shadow border"> 

            <h2 className="text-lg font-bold text-yellow-600"> 

              Pricing Advisor 

            </h2> 

            <p className="mt-4 text-sm"> 

              Suggested Range:{" "} 

              <strong>{analysis.pricing.suggested_range}</strong> 

            </p> 

            <p className="text-sm mt-2"> 

              Recommended Price: <strong>₹999</strong> 

            </p> 

          </div> 

        </motion.div> 

      )} 

    </main> 

  ); 

} 

 

 