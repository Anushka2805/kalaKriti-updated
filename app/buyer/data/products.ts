// app/buyer/data/products.ts
export type Product = {
  id: string;
  name: string;
  category: "Home Decor" | "Toys" | "Food" | "Art";
  price: number;
  basePrice: number;
  image: string;
  thumbnail: string;
  rating: number;
  reviews: number;
  
  artisanName: string;
  artisanId: string;
  artisanLocation: string;
  deliveryEstimate: string;
  tags: string[];
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "handmade-dolls",
    name: "Handmade Crochet Dolls (Set of 2)",
    category: "Toys",
    price: 1499,
    basePrice: 1499,
    image:
      "https://images.pexels.com/photos/18864018/pexels-photo-18864018.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/18864018/pexels-photo-18864018.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    reviews: 132,
    artisanName: "Ananya Crafts Collective",
    artisanId: "artisan-ramesh",
    artisanLocation: "Jaipur, Rajasthan",
    deliveryEstimate: "5–7 days",
    tags: ["Crochet", "Kids", "Custom names", "Gift"],
    description:
      "Handmade crochet dolls crafted with premium cotton yarn. Perfect for gifting, nursery decor, or keepsakes. Personalize skin tone, dress colors, and even add a small name tag.",
  },
  {
    id: "choco-strawberries",
    name: "Artisanal Chocolate-Covered Strawberries (Box of 12)",
    category: "Food",
    price: 1099,
    basePrice: 1099,
    image:
      "https://images.pexels.com/photos/32397280/pexels-photo-32397280.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/32397280/pexels-photo-32397280.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.9,
    reviews: 214,
    
    artisanName: "Berry & Cocoa Studio",
    artisanId: "artisan-ramesh",
    artisanLocation: "Bengaluru, Karnataka",
    deliveryEstimate: "2–3 days (cold chain)",
    tags: ["Gifting", "Party", "Premium", "Vegetarian"],
    description:
      "Fresh strawberries dipped in Belgian chocolate, finished with pastel drizzles and edible pearls. Ideal for birthdays, anniversaries, and corporate hampers.",
  },
  {
    id: "wall-art-madhubani",
    name: "Madhubani Wall Art (Framed A3)",
    category: "Art",
    price: 1899,
    basePrice: 1899,
    image:
      "https://images.pexels.com/photos/3769718/pexels-photo-3769718.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/3769718/pexels-photo-3769718.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.7,
    reviews: 89,
    artisanName: "Mithila Kala Studio",
    artisanId: "artisan-ramesh",
    artisanLocation: "Darbhanga, Bihar",
    deliveryEstimate: "6–9 days",
    tags: ["Traditional", "Hand-painted", "Framed", "Living room"],
    description:
      "Hand-painted Madhubani artwork using natural pigments on handmade paper, framed with a matte black wooden frame. Perfect for living rooms, cafes, and studio walls.",
  },
  {
    id: "blockprint-cushion",
    name: "Block-Printed Cushion Covers (Set of 4)",
    category: "Home Decor",
    price: 1299,
    basePrice: 1299,
    // 🔁 NEW image URL (jo reliably open hota hai)
    image:
      "https://images.pexels.com/photos/1439965/pexels-photo-1439965.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/1439965/pexels-photo-1439965.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.6,
    reviews: 67,
    artisanName: "Bagru Print Karigars",
    artisanId: "artisan-ramesh",
    artisanLocation: "Bagru, Rajasthan",
    deliveryEstimate: "5–8 days",
    tags: ["Block print", "Cotton", "Cushion", "Boho"],
    description:
      "Set of 4 pure cotton cushion covers with traditional block prints. Available in multiple color palettes for modern and boho interiors.",
  },
  {
    id: "terracotta-planters",
    name: "Terracotta Planters (Set of 3)",
    category: "Home Decor",
    price: 899,
    basePrice: 899,
    image:
      "https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.5,
    reviews: 54,
    artisanName: "Village Clay Studio",
    artisanId: "artisan-ramesh",
    artisanLocation: "Khurja, Uttar Pradesh",
    deliveryEstimate: "6–9 days",
    tags: ["Terracotta", "Planter", "Indoor plants", "Eco-friendly"],
    description:
      "Hand-thrown terracotta planters with breathable clay that helps plant roots thrive. Perfect for indoor herbs and table-top plants.",
  },
  {
    id: "handwoven-basket",
    name: "Handwoven Storage Basket",
    category: "Home Decor",
    price: 799,
    basePrice: 799,
    image:
      "https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.4,
    reviews: 41,
    artisanName: "Northeast Cane Collective",
    artisanId: "artisan-ramesh",
    artisanLocation: "Guwahati, Assam",
    deliveryEstimate: "7–10 days",
    tags: ["Basket", "Cane", "Organiser", "Eco-friendly"],
    description:
      "Multi-purpose handwoven basket made from natural cane and bamboo. Great for blankets, toys, or planters.",
  },
  {
    id: "kids-name-wall-hanging",
    name: "Custom Name Wall Hanging (Kids Room)",
    category: "Art",
    price: 1299,
    basePrice: 1299,
    image:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/3933275/pexels-photo-3933275.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    reviews: 103,
    artisanName: "Little Letters Studio",
    artisanId: "artisan-ramesh",
    artisanLocation: "Pune, Maharashtra",
    deliveryEstimate: "5–8 days",
    tags: ["Kids decor", "Custom name", "Gift"],
    description:
      "Personalized name wall hanging for kids' rooms with pastel colors and playful icons. Perfect for birthdays and nursery setups.",
  },
  {
    id: "festive-torans",
    name: "Embroidered Festive Torans (Set of 2)",
    category: "Home Decor",
    price: 999,
    basePrice: 999,
    image:
      "https://images.pexels.com/photos/7927874/pexels-photo-7927874.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/7927874/pexels-photo-7927874.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.6,
    reviews: 76,
    artisanName: "Shubh Decor Collective",
    artisanId: "artisan-ramesh",
    artisanLocation: "Ahmedabad, Gujarat",
    deliveryEstimate: "4–7 days",
    tags: ["Festive", "Door hanging", "Diwali", "Traditional"],
    description:
      "Colorful embroidered torans to decorate doors and windows during festivals and special occasions.",
  },
  {
    id: "handpainted-mugs",
    name: "Hand-painted Ceramic Mugs (Set of 2)",
    category: "Home Decor",
    price: 899,
    basePrice: 899,
    image:
      "https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.7,
    reviews: 120,
    artisanName: "Studio Mitti",
    artisanId: "artisan-ramesh",
    artisanLocation: "Auroville, Tamil Nadu",
    deliveryEstimate: "6–9 days",
    tags: ["Mugs", "Ceramic", "Hand-painted", "Gifting"],
    description:
      "Microwave-safe ceramic mugs with minimal hand-painted motifs. Ideal for chai lovers and desk coffee.",
  },
  {
    id: "wooden-toy-train",
    name: "Handcrafted Wooden Toy Train",
    category: "Toys",
    price: 1199,
    basePrice: 1199,
    image:
      "https://images.pexels.com/photos/4488771/pexels-photo-4488771.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumbnail:
      "https://images.pexels.com/photos/4488771/pexels-photo-4488771.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.5,
    reviews: 58,
    artisanName: "Channapatna Toy Makers",
    artisanId: "artisan-ramesh",
    artisanLocation: "Channapatna, Karnataka",
    deliveryEstimate: "6–9 days",
    tags: ["Wooden toys", "Kids", "Montessori"],
    description:
      "Non-toxic, lacquered wooden toy train with detachable compartments. Safe and durable for toddlers.",
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
