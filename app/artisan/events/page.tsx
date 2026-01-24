'use client';
import { motion } from "framer-motion";

const fairs = [
  {
    name: "Surajkund Mela",
    location: "Haryana",
    description:
      "One of India’s largest craft fairs showcasing traditional handicrafts, handlooms, and folk art from across the country.",
    image: "/surajkund.png",
  },
  {
    name: "Dilli Haat",
    location: "New Delhi",
    description:
      "A permanent fair-like marketplace where artisans from different states display authentic crafts and regional food.",
    image: "/dillihaat.png",
  },
  {
    name: "Shilpgram",
    location: "Udaipur",
    description:
      "A rural arts and crafts complex promoting traditional lifestyles, crafts, and cultural performances.",
    image: "/shilpgram.png",
  },
  {
    name: "Kala Ghoda Arts Festival",
    location: "Mumbai",
    description:
      "A vibrant urban arts festival celebrating contemporary art, crafts, music, and heritage in South Mumbai.",
    image: "/kalaghoda.png",
  },
  {
    name: "Saras Mela",
    location: "Multiple States",
    description:
      "An initiative to promote rural artisans, self-help groups, and indigenous crafts from across India.",
    image: "/sarasmela.png",
  },
  {
    name: "Rann Utsav",
    location: "Gujarat",
    description:
      "A cultural extravaganza showcasing Kutchi handicrafts, embroidery, folk music, and desert art.",
    image: "/rannutsav.png",
  },
];

export default function FairsShowcase() {
  return (
    <div className="bg-[#faf7f2] min-h-screen py-16 px-6 md:px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#4a2c2a]">
          Indian Artisan Fairs
        </h1>
        <p className="mt-4 text-lg text-[#6b4f4f] max-w-2xl mx-auto">
          Discover iconic fairs across India where skilled artisans showcase
          their handcrafted stories.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {fairs.map((fair, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          >
            <div className="h-52 overflow-hidden">
              <img
                src={fair.image}
                alt={fair.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#4a2c2a]">
                {fair.name}
              </h2>
              <p className="text-sm text-[#a06b5b] mt-1">{fair.location}</p>
              <p className="mt-4 text-[#5f5f5f] leading-relaxed">
                {fair.description}
              </p>
              <button className="mt-6 inline-block text-sm font-medium text-white bg-[#a06b5b] px-5 py-2 rounded-full hover:bg-[#8b5a4a] transition">
                Explore Event
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
