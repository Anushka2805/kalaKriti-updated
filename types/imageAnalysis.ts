export interface ImageAnalysisResult {
  image_insights: {
    category: string;
    materials: { name: string; confidence: "low" | "medium" | "high" }[];
    design_style: string;
    complexity: "low" | "medium" | "high";
    market_position: "budget" | "mid-range" | "premium";
  };
  content: {
    caption: string;
    hashtags: string[];
  };
  pricing: {
    suggested_range: string;
  };
}
