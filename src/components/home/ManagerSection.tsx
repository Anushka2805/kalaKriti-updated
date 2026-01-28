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

export default function ManagerSection() {
  return (
    <section id="manager" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold text-gray-900"
          >
            Your Digital Manager
          </motion.h2>

          <motion.ul
            variants={fadeUp}
            className="mt-8 space-y-4 text-gray-700 text-lg"
          >
            {[
              "Better Designs",
              "Fair Pricing",
              "Auto-Marketing",
              "Direct Orders",
            ].map((item, i) => (
              <motion.li key={i} whileHover={{ scale: 1.02 }}>
                ✔ {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          whileHover={{ scale: 1.02 }}
          viewport={{ once: true }}
          className="bg-white shadow-xl rounded-3xl p-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full" />
            <div>
              <h3 className="font-semibold text-lg">Lakshmi Devi</h3>
              <p className="text-sm text-gray-600">
                Madhubani Artist • Bihar
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm font-medium text-gray-600">
            Trend Score
          </p>

          <div className="w-full h-2 bg-green-100 rounded-full">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "94%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
