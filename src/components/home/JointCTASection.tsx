"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

export default function JoinCTASection() {
  return (
    <section
      id="choose"
      className="py-20 px-6 bg-emerald-700 text-white text-center"
    >
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold"
      >
        Ready to Join Our Community?
      </motion.h2>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-4 text-lg max-w-2xl mx-auto text-emerald-100"
      >
        Whether you're an artisan or a shopper, your journey starts here.
      </motion.p>

      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-10 flex flex-col md:flex-row items-center justify-center gap-6"
      >
        <motion.div variants={fadeUp} whileHover={{ scale: 1.05 }}>
          <Link
            href="/artisan/signup"
            className="bg-white text-emerald-700 font-semibold px-8 py-3 rounded-full shadow hover:shadow-xl"
          >
            I'm an Artisan
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ scale: 1.05 }}>
          <Link
            href="/buyer"
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-emerald-700 shadow transition"
          >
            Start Shopping
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
