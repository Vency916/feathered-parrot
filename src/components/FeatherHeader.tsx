"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface FeatherHeaderProps {
  theme?: "light" | "dark";
}

export default function FeatherHeader({ theme = "light" }: FeatherHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  return (
    <header className={`w-full ${isDark ? "bg-forest-900 text-cream-100" : "bg-cream-100 text-forest-900"} transition-colors`}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-forest-800/20 shadow-xs flex items-center justify-center bg-white shrink-0 group-hover:border-forest-700 transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Feathered Haven Parrot Rescue & Adoption Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black tracking-wider uppercase font-sans leading-none block">
                FEATHERED HAVEN
              </span>
              <span className={`text-[10px] sm:text-xs tracking-widest uppercase font-bold block mt-1 ${isDark ? "text-forest-300" : "text-forest-700"}`}>
                Parrot Rescue & Adoption
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold tracking-wide">
            <Link
              href="#who-we-are"
              className={`hover:opacity-75 transition-opacity ${isDark ? "text-cream-200" : "text-forest-850"}`}
            >
              Our mission
            </Link>
            <span className={`opacity-40 ${isDark ? "text-cream-300" : "text-forest-700"}`}>|</span>
            <Link
              href="#how-adoption-works"
              className={`hover:opacity-75 transition-opacity ${isDark ? "text-cream-200" : "text-forest-850"}`}
            >
              Adoption
            </Link>
            <span className={`opacity-40 ${isDark ? "text-cream-300" : "text-forest-700"}`}>|</span>
            <Link
              href="#support-contact"
              className={`hover:opacity-75 transition-opacity ${isDark ? "text-cream-200" : "text-forest-850"}`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-6 pt-2 pb-6 border-t ${
          isDark
            ? "bg-forest-950 border-forest-800 text-cream-100"
            : "bg-cream-200 border-cream-300 text-forest-900"
        } space-y-3`}>
          <Link
            href="#who-we-are"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold tracking-wide"
          >
            Our mission
          </Link>
          <Link
            href="#how-adoption-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold tracking-wide"
          >
            Adoption
          </Link>
          <Link
            href="#support-contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold tracking-wide"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
