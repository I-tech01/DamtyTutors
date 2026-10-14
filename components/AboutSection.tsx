"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface AboutSectionProps {
  description?: string;
}

export default function AboutSection({
  description = "We are an online tutoring company dedicated to helping students achieve their academic goals through personalized learning experiences.",
}: AboutSectionProps) {
  return (
    <motion.section
      className="py-16 bg-gray-50 text-center"
      initial={{ opacity: 0, y: 50 }}          // start hidden + shifted down
      whileInView={{ opacity: 1, y: 0 }}       // animate when scrolled into view
      transition={{ duration: 0.8 }}           // smooth timing
      viewport={{ once: false, amount: 0.3 }}                // only animate once
    >
      <h2 className="text-3xl font-semibold mb-6">About Our Company</h2>
      <p className="max-w-2xl mx-auto text-gray-600 mb-8">{description}</p>
      <Link href="/about">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition">
          Learn More About Us
        </button>
      </Link>
    </motion.section>
  );
}