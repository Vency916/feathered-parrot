"use client";

import React from "react";
import Link from "next/link";
import { HomepageSlot } from "@/lib/types";

interface FeatherHeroProps {
  heroSlot?: HomepageSlot;
}

export default function FeatherHero({ heroSlot }: FeatherHeroProps) {
  const title = heroSlot?.title || "Every parrot deserves a home that understands.";
  const subtitle =
    heroSlot?.subtitle ||
    "We help parrots move toward caring, prepared homes through a thoughtful adoption process built around each bird's individual needs.";
  const imageUrl = heroSlot?.imageUrl;

  return (
    <section className="bg-forest-900 text-cream-100 py-16 sm:py-20 lg:py-24 border-b border-forest-950">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-forest-300">
              A SAFE PLACE TO BEGIN AGAIN
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-cream-50 leading-[1.15] font-sans">
              {title.includes("home that understands") ? (
                <>
                  Every parrot deserves<br className="hidden sm:inline" /> a home that understands.
                </>
              ) : (
                title
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-cream-200/90 leading-relaxed max-w-xl font-normal">
              {subtitle}
            </p>

            {/* Pill CTA Button */}
            <div className="pt-2">
              <Link
                href="#who-we-are"
                className="inline-block px-7 py-3 rounded-full bg-cream-100 text-forest-900 font-bold text-xs sm:text-sm tracking-wide hover:bg-white hover:shadow-md transition-all"
              >
                Explore our approach
              </Link>
            </div>
          </div>

          {/* Right Column: Featured Bird Image from Sanctuary */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs sm:max-w-sm aspect-[4/5] bg-sage-200 rounded-3xl overflow-hidden relative shadow-md border-2 border-forest-700/40 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl || "/birds/bird-1.jpeg"}
                alt="Feathered Haven Sanctuary Resident"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity pointer-events-none" />
              <div className="absolute bottom-4 inset-x-4 text-cream-50 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest-300 block">
                  Sanctuary Resident
                </span>
                <span className="text-xs sm:text-sm font-bold block drop-shadow-xs">
                  Rehabilitated & Thriving
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
