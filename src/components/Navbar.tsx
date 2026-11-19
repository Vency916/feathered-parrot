"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, FileUp, Shield, Menu, X, Feather } from "lucide-react";
import { generateAdoptionFormPDF } from "@/lib/pdfGenerator";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadForm = () => {
    setIsGeneratingPdf(true);
    try {
      generateAdoptionFormPDF();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-cream-300 shadow-xs flex items-center justify-center bg-cream-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="AuraParrot Sanctuary Logo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  // Fallback if image fails
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-forest-900 block leading-tight font-serif">
                Aura<span className="text-forest-600 font-sans font-bold">Parrot</span>
              </span>
              <span className="text-xs uppercase tracking-widest text-forest-700/80 font-medium block">
                Sanctuary & Adoption
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/#parrots"
              className="text-sm font-semibold text-forest-850 hover:text-forest-600 transition-colors"
            >
              Available Parrots
            </Link>
            <Link
              href="/#spaces"
              className="text-sm font-semibold text-forest-850 hover:text-forest-600 transition-colors"
            >
              Sanctuary Life
            </Link>
            <Link
              href="/#process"
              className="text-sm font-semibold text-forest-850 hover:text-forest-600 transition-colors"
            >
              Adoption Process
            </Link>
            <Link
              href="/#submit-form"
              className="text-sm font-semibold text-forest-850 hover:text-forest-600 transition-colors flex items-center gap-1.5"
            >
              <FileUp className="w-4 h-4 text-forest-600" />
              Submit Filled Form
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleDownloadForm}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-forest-800 text-forest-800 font-bold text-xs uppercase tracking-wider hover:bg-forest-100 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? "Preparing Form..." : "Download Form (PDF)"}
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 transition-all shadow-sm hover:shadow"
            >
              <Shield className="w-4 h-4 text-forest-300" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-forest-800 hover:bg-cream-200 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-100 border-b border-cream-300 px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/#parrots"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-forest-900"
          >
            Available Parrots
          </Link>
          <Link
            href="/#spaces"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-forest-900"
          >
            Sanctuary Life
          </Link>
          <Link
            href="/#process"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-forest-900"
          >
            Adoption Process
          </Link>
          <Link
            href="/#submit-form"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-forest-900"
          >
            Submit Filled Form
          </Link>
          <div className="pt-4 border-t border-cream-300 flex flex-col gap-2.5">
            <button
              onClick={() => {
                handleDownloadForm();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-forest-800 text-forest-800 font-bold text-sm"
            >
              <Download className="w-4 h-4" />
              Download Form (PDF)
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-forest-800 text-cream-50 font-bold text-sm"
            >
              <Shield className="w-4 h-4 text-forest-300" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
