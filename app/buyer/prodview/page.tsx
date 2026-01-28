// @ts-nocheck
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/* ================= CLIENT-ONLY IMPORTS ================= */

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

const OrbitControls = dynamic(
  () => import("@react-three/drei").then((m) => m.OrbitControls),
  { ssr: false }
);

const Environment = dynamic(
  () => import("@react-three/drei").then((m) => m.Environment),
  { ssr: false }
);

const ContactShadows = dynamic(
  () => import("@react-three/drei").then((m) => m.ContactShadows),
  { ssr: false }
);

/* ================= PRODUCT PLANE ================= */

function ProductPlane({
  imageUrl,
  depthUrl,
  depthIntensity,
  scale,
}) {
  const [maps, setMaps] = useState(null);

  useEffect(() => {
    let mounted = true;

    import("three").then((THREE) => {
      const loader = new THREE.TextureLoader();
      const colorMap = loader.load(imageUrl);
      const depthMap = loader.load(depthUrl);
      depthMap.flipY = false;

      if (mounted) setMaps({ colorMap, depthMap });
    });

    return () => {
      mounted = false;
    };
  }, [imageUrl, depthUrl]);

  if (!maps) return null;

  return (
    <mesh position={[0, 0.25, 0]} scale={scale}>
      <planeGeometry args={[1.6, 2, 128, 128]} />
      <meshStandardMaterial
        map={maps.colorMap}
        displacementMap={maps.depthMap}
        displacementScale={depthIntensity}
        transparent
        roughness={0.35}
        metalness={0.05}
      />
    </mesh>
  );
}

/* ================= SCALE REFERENCES ================= */

function TableReference() {
  return (
    <mesh position={[0, -1.05, 0]}>
      <boxGeometry args={[4, 0.1, 2]} />
      <meshStandardMaterial color="#dcdcdc" />
    </mesh>
  );
}

function ScaleBar({ scale }) {
  return (
    <group position={[0, -0.55, 0]} scale={scale}>
      {/* Main bar */}
      <mesh>
        <boxGeometry args={[1.2, 0.03, 0.03]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Left tick */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.03, 0.1, 0.03]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Right tick */}
      <mesh position={[0.6, 0, 0]}>
        <boxGeometry args={[0.03, 0.1, 0.03]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
}

/* ================= MAIN PAGE ================= */

export default function Try3DViewerPage() {
  const [processedImg, setProcessedImg] = useState(null);
  const [depthMap, setDepthMap] = useState(null);
  const [loading, setLoading] = useState(false);

  const [depthIntensity, setDepthIntensity] = useState(0.25);

  const [autoScaleOn, setAutoScaleOn] = useState(true);
  const [autoScale, setAutoScale] = useState(1);
  const [scaleText, setScaleText] = useState("≈ 30 cm");

  const [scaleRef, setScaleRef] = useState("table");

  const handleUpload = async (file) => {
    setLoading(true);
    setProcessedImg(null);
    setDepthMap(null);

    try {
      /* Background remove */
      const bgForm = new FormData();
      bgForm.append("image_file", file);
      bgForm.append("size", "auto");

      const bgRes = await fetch("/api/remove-bg", {
        method: "POST",
        body: bgForm,
      });

      const bgBlob = await bgRes.blob();
      const bgUrl = URL.createObjectURL(bgBlob);
      setProcessedImg(bgUrl);

      /* Auto-scale calculation */
      const img = new Image();
      img.src = bgUrl;

      img.onload = () => {
        const area = img.width * img.height;
        const referenceArea = 800 * 800;

        const scale = Math.sqrt(area / referenceArea);
        const clamped = Math.min(Math.max(scale, 0.8), 1.4);

        setAutoScale(clamped);
        setScaleText(`≈ ${Math.round(30 * clamped)} cm`);
      };

      /* Depth map */
      const depthForm = new FormData();
      depthForm.append("image", bgBlob);

      const depthRes = await fetch("/api/depth-map", {
        method: "POST",
        body: depthForm,
      });

      const depthBlob = await depthRes.blob();
      setDepthMap(URL.createObjectURL(depthBlob));
    } catch {
      alert("Processing failed");
    } finally {
      setLoading(false);
    }
  };

  const finalScale = autoScaleOn ? autoScale : 1;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 px-6 py-10">
      <h1 className="text-3xl font-semibold text-center mb-2">
        3D Product Preview
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Depth, lighting & scale-aware preview
      </p>

      {/* Upload */}
      <div className="flex justify-center mb-6">
        <label className="cursor-pointer bg-black text-white px-6 py-3 rounded-lg font-medium">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files && handleUpload(e.target.files[0])
            }
          />
        </label>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Processing…</p>
      )}

      {/* Controls */}
      {processedImg && depthMap && (
        <div className="max-w-xl mx-auto grid gap-4 mb-6">
          {/* Depth */}
          <div>
            <label className="text-sm font-medium">
              Depth Intensity
            </label>
            <input
              type="range"
              min={0}
              max={0.6}
              step={0.01}
              value={depthIntensity}
              onChange={(e) =>
                setDepthIntensity(parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>

          {/* Auto-scale */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={autoScaleOn}
              onChange={(e) => setAutoScaleOn(e.target.checked)}
            />
            <span className="text-sm">Auto scale based on image</span>
          </div>

          {/* Scale reference */}
          <div>
            <label className="text-sm font-medium">
              Scale Reference
            </label>
            <select
              value={scaleRef}
              onChange={(e) => setScaleRef(e.target.value)}
              className="w-full border rounded-md px-2 py-1"
            >
              <option value="table">Table</option>
              <option value="scale">Scale Bar</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      )}

      {/* Viewer */}
      {processedImg && depthMap && (
        <div className="relative h-[520px] max-w-4xl mx-auto rounded-xl overflow-hidden bg-white shadow-lg">
          {/* Scale text overlay */}
          {scaleRef === "scale" && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 
                            bg-white/80 backdrop-blur px-3 py-1 
                            rounded-full text-sm text-gray-700 shadow">
              {scaleText}
            </div>
          )}

          <Canvas camera={{ position: [0, 0, 3], fov: 40 }}>
            <color attach="background" args={["#eeeeee"]} />

            {/* Lighting */}
            <ambientLight intensity={0.35} />
            <directionalLight position={[3, 4, 5]} intensity={1.2} />
            <directionalLight position={[-3, 2, 4]} intensity={0.6} />
            <directionalLight position={[0, 2, -5]} intensity={0.9} />

            <Environment preset="studio" />

            <ProductPlane
              imageUrl={processedImg}
              depthUrl={depthMap}
              depthIntensity={depthIntensity}
              scale={finalScale}
            />

            {scaleRef === "table" && <TableReference />}
            {scaleRef === "scale" && <ScaleBar scale={finalScale} />}

            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.4}
              scale={6}
              blur={2}
              far={4}
            />

            <OrbitControls enablePan={false} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
