import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ImageAnalysisResult } from "@/types/imageAnalysis";

interface ImageStoreState {
  imagePreview: string | null;
  analysis: ImageAnalysisResult | null;

  setImageData: (
    preview: string,
    analysis: ImageAnalysisResult
  ) => void;

  clearImageData: () => void;
}

export const useImageStore = create<ImageStoreState>()(
  persist(
    (set) => ({
      imagePreview: null,
      analysis: null,

      setImageData: (preview, analysis) =>
        set({
          imagePreview: preview,
          analysis,
        }),

      clearImageData: () =>
        set({
          imagePreview: null,
          analysis: null,
        }),
    }),
    {
      name: "artisan-image-store",
      storage: {
        getItem: (name) => sessionStorage.getItem(name),
        setItem: (name, value) =>
          sessionStorage.setItem(name, value),
        removeItem: (name) =>
          sessionStorage.removeItem(name),
      },
    }
  )
);
