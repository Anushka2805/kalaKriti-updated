"use client";

import { motion } from "framer-motion";

/* Animations */
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

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 px-6 bg-white">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-extrabold text-gray-900">
            The Problem
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Rural artisans possess incredible skill but remain disconnected
            from the modern digital economy.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* PROBLEM CARDS */}
          <motion.div
            className="grid gap-6"
            variants={containerStagger}
          >
            {[
              {
                color: "bg-red-50 border-red-100",
                title: "Outdated Designs",
                text: "Lack of access to current urban trends.",
              },
              {
                color: "bg-yellow-50 border-yellow-100",
                title: "Unfair Pricing",
                text: "Middlemen take up to 70% profit.",
              },
              {
                color: "bg-blue-50 border-blue-100",
                title: "Low Digital Skills",
                text: "No ability to create digital listings.",
              },
              {
                color: "bg-yellow-50 border-yellow-100",
                title: "Market Isolation",
                text: "No data on what sells → wasted inventory.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                className={`${card.color} border rounded-2xl p-6 shadow-sm`}
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* DONUT CHART */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Current Sales Channel Distribution
            </h3>

            <div className="relative w-64 h-64">
              <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="6"
                  strokeDasharray="60 40"
                  strokeDashoffset="-15"
                  strokeLinecap="round"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="6"
                  strokeDasharray="20 80"
                  strokeDashoffset="-75"
                  strokeLinecap="round"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="6"
                  strokeDasharray="12 88"
                  strokeDashoffset="-95"
                  strokeLinecap="round"
                />
                <circle
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  strokeDasharray="8 92"
                  strokeDashoffset="-107"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm">Rural</p>
                <h3 className="text-xl font-bold text-gray-800">
                  Sales
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
