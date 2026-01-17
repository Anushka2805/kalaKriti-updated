"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const containerStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function SolutionSection() {
  return (
    <section id="solution" className="py-24 px-6 bg-[#F1FBF6]">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-center text-4xl font-extrabold text-gray-900"
        >
          Our Solution: KalaKriti
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-center max-w-4xl mx-auto text-gray-600 text-lg"
        >
          An all-in-one platform where artisans upload a photo of their craft and
          AI handles everything.
        </motion.p>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Trend Intelligence",
              desc: "Analyzes global design trends to suggest colors and patterns.",
            },
            {
              title: "Smart Pricing",
              desc: "Calculates fair market value based on material and labor.",
            },
            {
              title: "Hybrid Marketplace",
              desc: "Connects artisans directly with buyers & shops.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow p-8 text-center"
            >
              <h3 className="font-semibold text-xl text-gray-800">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
