"use client";

import React, { useState } from "react";
import { HomepageSlot } from "@/lib/types";
import { Eye, ChevronDown, ChevronUp, Sparkles, X } from "lucide-react";

interface WhoWeAreProps {
  slots: HomepageSlot[];
}

const ALL_SANCTUARY_BIRDS = [
  { src: "/birds/bird-1.jpeg", title: "Scarlet Macaw Morning Perch", tag: "Macaw" },
  { src: "/birds/bird-2.jpeg", title: "African Grey Bonding Time", tag: "African Grey" },
  { src: "/birds/bird-3.jpeg", title: "Sun Conure Play & Snuggles", tag: "Conure" },
  { src: "/birds/bird-4.jpeg", title: "Umbrella Cockatoo Affection", tag: "Cockatoo" },
  { src: "/birds/bird-5.jpeg", title: "Lovebird Companions", tag: "Lovebird" },
  { src: "/birds/bird-6.jpeg", title: "Amazon Parrot Vocal Hour", tag: "Amazon" },
  { src: "/birds/bird-7.jpeg", title: "Gentle Feeding & Fruit Chop", tag: "Sanctuary Care" },
  { src: "/birds/bird-8.jpeg", title: "Natural Wood Aviary Flight", tag: "Free Flight" },
  { src: "/birds/bird-9.jpeg", title: "Feather Grooming & Preening", tag: "Enrichment" },
  { src: "/birds/bird-10.jpeg", title: "Curious Foraging Puzzle", tag: "Puzzle Enrichment" },
  { src: "/birds/bird-11.jpeg", title: "Sunshine Flight Deck", tag: "Sunlight & Wellness" },
  { src: "/birds/bird-12.jpeg", title: "Lifelong Companionship", tag: "Forever Care" },
];

export default function WhoWeAreSection({ slots }: WhoWeAreProps) {
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [activePreviewImg, setActivePreviewImg] = useState<{ src: string; title: string; tag: string } | null>(null);

  const glimpse1 = slots.find((s) => s.slotKey === "glimpse_1")?.imageUrl || "/birds/bird-2.jpeg";
  const glimpse2 = slots.find((s) => s.slotKey === "glimpse_2")?.imageUrl || "/birds/bird-3.jpeg";
  const glimpse3 = slots.find((s) => s.slotKey === "glimpse_3")?.imageUrl || "/birds/bird-4.jpeg";

  return (
    <section id="who-we-are" className="bg-cream-100 text-forest-900 py-16 sm:py-20 border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Top Story Header */}
        <div className="space-y-4 max-w-3xl">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-forest-700">
            WHO WE ARE
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-forest-900 leading-snug">
            More than rehoming. A commitment to care.
          </h2>
          <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed font-normal">
            At Feathered Haven, we believe successful adoption starts with understanding parrots as intelligent, social, long-lived companions. Our goal is to support responsible placements where birds can feel secure and families are prepared for the commitment.
          </p>
        </div>

        {/* Our Rehoming Story Box */}
        <div className="bg-sage-200/90 rounded-2xl p-6 sm:p-8 space-y-2 border border-sage-300/60 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-forest-800">
            OUR REHOMING STORY
          </p>
          <p className="text-xs sm:text-sm text-forest-900/90 leading-relaxed">
            We are proud to help parrots begin new chapters with caring households. Each placement represents careful conversations, preparation and a shared commitment to the bird’s future.
          </p>
        </div>

        {/* A glimpse into our world */}
        <div className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight">
                A glimpse into our world
              </h3>
              <p className="text-xs text-forest-700/80">
                Photos from our care and community - not a catalog of birds for adoption.
              </p>
            </div>

            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-600 bg-white hover:bg-cream-50 border border-cream-300 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>{showAllGallery ? "Show featured 3" : "View all 12 sanctuary photos"}</span>
              {showAllGallery ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* 3 Featured Spaces */}
          {!showAllGallery ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Card 1 */}
              <div
                onClick={() => setActivePreviewImg({ src: glimpse1, title: "Sanctuary Care & Flight", tag: "Enrichment" })}
                className="bg-white rounded-2xl aspect-[16/11] overflow-hidden border border-cream-300 shadow-xs hover:border-forest-700 hover:shadow-md transition-all cursor-pointer relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={glimpse1}
                  alt="Sanctuary Bird 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-forest-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-forest-900/80 text-cream-50 text-xs font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </span>
                </div>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => setActivePreviewImg({ src: glimpse2, title: "Rehabilitation & Social Hours", tag: "Socializing" })}
                className="bg-white rounded-2xl aspect-[16/11] overflow-hidden border border-cream-300 shadow-xs hover:border-forest-700 hover:shadow-md transition-all cursor-pointer relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={glimpse2}
                  alt="Sanctuary Bird 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-forest-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-forest-900/80 text-cream-50 text-xs font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => setActivePreviewImg({ src: glimpse3, title: "Healthy Nutrition & Greens", tag: "Nutrition" })}
                className="bg-white rounded-2xl aspect-[16/11] overflow-hidden border border-cream-300 shadow-xs hover:border-forest-700 hover:shadow-md transition-all cursor-pointer relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={glimpse3}
                  alt="Sanctuary Bird 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-forest-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-forest-900/80 text-cream-50 text-xs font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* All 12 Bird Photos Expanded Gallery */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
              {ALL_SANCTUARY_BIRDS.map((bird, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePreviewImg(bird)}
                  className="bg-white rounded-2xl overflow-hidden aspect-[4/3] border border-cream-300 shadow-xs hover:border-forest-700 hover:shadow-md transition-all cursor-pointer relative group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bird.src}
                    alt={bird.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950/80 via-forest-900/40 to-transparent p-2 text-cream-50 text-[11px] font-bold">
                    <span className="block truncate">{bird.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>

      {/* Lightbox Modal */}
      {activePreviewImg && (
        <div
          onClick={() => setActivePreviewImg(null)}
          className="fixed inset-0 z-50 bg-forest-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream-50 rounded-3xl overflow-hidden max-w-xl w-full border border-cream-300 shadow-2xl relative space-y-4 p-4 sm:p-6"
          >
            <button
              onClick={() => setActivePreviewImg(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-forest-900/80 text-cream-50 hover:bg-forest-900 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-cream-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePreviewImg.src}
                alt={activePreviewImg.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest-600 bg-sage-200 px-2 py-0.5 rounded">
                  {activePreviewImg.tag}
                </span>
                <h4 className="text-base font-bold text-forest-900 mt-1">
                  {activePreviewImg.title}
                </h4>
              </div>
              <button
                onClick={() => setActivePreviewImg(null)}
                className="px-4 py-1.5 rounded-full bg-forest-900 text-cream-100 text-xs font-bold uppercase tracking-wider hover:bg-forest-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
