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

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative pt-24 pb-20 px-6 bg-gradient-to-r from-[#F8FCEF] to-[#EAFBF3]"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full font-medium"
          >
            Bridging Tradition & Technology
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Empowering Rural
            <br />
            Artisans with{" "}
            <span className="text-emerald-600">AI Intelligence</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-gray-600 leading-relaxed"
          >
            KalaKriti bridges the gap between rural craftsmanship and modern
            market demands. We provide real-time trend analysis, fair pricing
            guidance, and digital tools to help artisans thrive.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#choose"
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-medium shadow hover:shadow-lg"
            >
              Explore Now
            </motion.a>
          </motion.div>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="bg-white shadow-xl rounded-3xl p-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="h-3 w-24 bg-gray-900 rounded" />
            </div>

            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-emerald-600 font-medium"
            >
              Trending
            </motion.span>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-100 rounded-xl p-6 flex items-center justify-center text-gray-500 font-medium"
            >
              Pottery
            </motion.div>

            <div className="bg-emerald-50 rounded-xl p-6">
              <h3 className="font-semibold text-emerald-700 mb-2">
                AI Analysis
              </h3>

              <div className="w-full h-2 bg-emerald-200 rounded-full">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                />
              </div>

              <p className="text-sm font-medium mt-2 text-gray-600">
                Demand: High
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Suggested Price: <span className="font-bold">₹450</span>
          </p>

          <div className="mt-4 w-full flex justify-end">
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="bg-emerald-600 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
            >
              ✓
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
