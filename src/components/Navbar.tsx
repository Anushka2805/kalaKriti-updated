"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-4 px-6">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 text-white rounded-lg w-8 h-8 flex items-center justify-center font-bold">
              K
            </div>
            <span className="font-semibold text-xl text-gray-800">
              KalaKriti AI
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
            <a href="#home" className="hover:text-emerald-600">Home</a>
            <a href="#problem" className="hover:text-emerald-600">Problem</a>
            <a href="#solution" className="hover:text-emerald-600">Solution</a>
            <a href="#features" className="hover:text-emerald-600">Features</a>
            <a href="#buyers" className="hover:text-emerald-600">Buyers</a>
            <a href="#tech" className="hover:text-emerald-600">Tech</a>
          </nav>

          {/* CTA Button */}
          <a
            href="#contact"
            className="hidden md:block bg-emerald-600 text-white px-4 py-2 rounded-full shadow hover:bg-emerald-700"
          >
            Get Involved
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="flex flex-col gap-4 md:hidden px-6 pb-4 text-gray-600 font-medium">
            <a href="#home">Home</a>
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#features">Features</a>
            <a href="#buyers">Buyers</a>
            <a href="#tech">Tech</a>
            <a
              href="#contact"
              className="bg-emerald-600 text-white px-4 py-2 rounded-full shadow text-center"
            >
              Get Involved
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
