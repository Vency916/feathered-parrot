"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import { HomepageSlot } from "@/lib/types";
import { generateAdoptionFormPDF } from "@/lib/pdfGenerator";

interface HeroSectionProps {
  heroSlot?: HomepageSlot;
}

export default function HeroSection({ heroSlot }: HeroSectionProps) {
  const [downloading, setDownloading] = useState(false);

  const title = heroSlot?.title || "Find Your Feathers, Bring Joy to Your Home";
  const subtitle =
    heroSlot?.subtitle ||
    "Over 80 magnificent rescued parrots are waiting for their second chance at a loving, forever flock. Download your application today.";
  const imageUrl =
    heroSlot?.imageUrl ||
    "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1600&q=85";

  const handleDownloadForm = () => {
    setDownloading(true);
    try {
      generateAdoptionFormPDF();
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100/60 to-cream-50 pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-850 border border-forest-300/50 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>Sanctuary & Lifelong Avian Haven</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest-900 tracking-tight leading-[1.1] font-serif">
              {title}
            </h1>

            <p className="text-lg text-forest-800/80 leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* Quick Adoption Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-forest-900 bg-cream-50 p-3 rounded-lg border border-cream-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
                <span>Health screened & avian vet checked</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-forest-900 bg-cream-50 p-3 rounded-lg border border-cream-200 shadow-xs">
                <HeartHandshake className="w-4 h-4 text-forest-600 shrink-0" />
                <span>Behavioral enrichment & diet transition</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleDownloadForm}
                disabled={downloading}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-forest-800 text-cream-50 font-bold text-sm tracking-wide hover:bg-forest-900 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-forest-300" />
                {downloading ? "Generating PDF..." : "1. Download Adoption Form"}
              </button>

              <Link
                href="/#submit-form"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border-2 border-forest-800 text-forest-850 font-bold text-sm tracking-wide hover:bg-forest-100/70 transition-all shadow-xs"
              >
                2. Submit Filled Form
              </Link>
            </div>

            {/* Trust badge */}
            <p className="text-xs text-forest-700/70 pt-1">
              * Download our official PDF form, complete it offline, and upload it right back here.
            </p>
          </div>

          {/* Right Image Space (Managed by Admin) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative borders in forest and cream */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-forest-700/20 via-forest-500/10 to-cream-300/40 blur-sm transform -rotate-1"></div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-cream-50 bg-cream-200 aspect-[4/3] sm:aspect-[4/3] lg:aspect-[5/4] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Featured Sanctuary Parrot"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Image Tag & Admin Upload Badge */}
                <div className="absolute top-3 left-3 bg-forest-900/80 backdrop-blur-md text-cream-50 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-forest-700/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Homepage Space 1 (Hero Banner)</span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950/80 via-forest-900/40 to-transparent p-4 text-cream-50">
                  <p className="text-xs font-semibold tracking-wider uppercase text-forest-200">
                    AuraParrot Resident
                  </p>
                  <p className="text-sm font-bold">
                    Safe, loving foster homes transform lives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
