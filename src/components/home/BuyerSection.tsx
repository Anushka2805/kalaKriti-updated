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

export default function BuyerSection() {
  return (
    <section id="buyers" className="py-24 px-6 bg-[#F7FBF8]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* CHAT MOCK */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="bg-white shadow-xl rounded-2xl p-6"
        >
          <h3 className="font-semibold text-lg mb-4">Lakshmi Devi</h3>

          <div className="space-y-3 text-gray-700">
            <div>Can you make this vase in blue?</div>

            <div className="bg-emerald-50 p-2 rounded-lg">
              Yes, I can! It will take 2 days.
            </div>

            <div>Great! Offering ₹500 for 2 pieces.</div>

            <div className="border border-dashed border-emerald-400 p-2 rounded-lg font-medium">
              Offer Sent: ₹500
            </div>
          </div>

          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-l-lg p-2"
            />
            <button className="bg-emerald-600 text-white px-4 rounded-r-lg">
              Send
            </button>
          </div>
        </motion.div>

        {/* BUYER FEATURES */}
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
            Authentic Crafts, Simplified
          </motion.h2>

          <motion.ul
            variants={fadeUp}
            className="mt-8 space-y-4 text-gray-700 text-lg"
          >
            {[
              "Visual Search: See how it looks in your room",
              "Bulk Boards: Post requirements",
              "Custom Orders: Personalize directly",
              "Transparent: No middlemen",
            ].map((item, i) => (
              <motion.li key={i} whileHover={{ scale: 1.02 }}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

      </div>
    </section>
  );
}
