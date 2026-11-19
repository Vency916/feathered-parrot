"use client";

import React, { useState } from "react";
import { Parrot, ParrotSpecies } from "@/lib/types";
import { Search, Heart, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";

interface ParrotCatalogProps {
  parrots: Parrot[];
  onSelectParrotForAdoption?: (parrot: Parrot) => void;
}

const SPECIES_OPTIONS: (ParrotSpecies | "All")[] = [
  "All",
  "Macaw",
  "Cockatoo",
  "African Grey",
  "Amazon",
  "Conure",
  "Cockatiel",
  "Lovebird",
];

export default function ParrotCatalog({
  parrots,
  onSelectParrotForAdoption,
}: ParrotCatalogProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<ParrotSpecies | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParrots = parrots.filter((parrot) => {
    const matchesSpecies =
      selectedSpecies === "All" || parrot.species.toLowerCase() === selectedSpecies.toLowerCase();
    const matchesStatus =
      selectedStatus === "All" || parrot.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      parrot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parrot.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parrot.personality.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSpecies && matchesStatus && matchesSearch;
  });

  const handleApply = (parrot: Parrot) => {
    if (onSelectParrotForAdoption) {
      onSelectParrotForAdoption(parrot);
    }
    const formElement = document.getElementById("submit-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="parrots" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-850 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>Available Sanctuary Residents</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-serif">
              Meet Our Feathered Companions
            </h2>
            <p className="text-forest-800/80 text-sm sm:text-base mt-2 max-w-2xl">
              Each parrot has their own vibrant personality, favorite treats, and distinct vocal flair. Find the soulmate that fits your family and aviary.
            </p>
          </div>

          <div className="text-xs text-forest-700/70 font-medium">
            Showing <span className="font-bold text-forest-900">{filteredParrots.length}</span> of {parrots.length} companions
          </div>
        </div>

        {/* Filters & Search */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-600/70" />
              <input
                type="text"
                placeholder="Search by name, species, or trait (e.g. playful)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-100 border border-cream-300 text-sm text-forest-900 placeholder:text-forest-700/50 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-cream-50 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-forest-800">Status:</span>
              <div className="flex bg-cream-200/60 p-1 rounded-xl border border-cream-300 text-xs">
                {["All", "Available", "Pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedStatus === status
                        ? "bg-forest-800 text-cream-50 shadow-xs"
                        : "text-forest-850 hover:text-forest-950"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Species Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SPECIES_OPTIONS.map((species) => (
              <button
                key={species}
                onClick={() => setSelectedSpecies(species)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  selectedSpecies === species
                    ? "bg-forest-800 text-cream-50 shadow-xs"
                    : "bg-cream-100 text-forest-800 border border-cream-300 hover:bg-cream-200"
                }`}
              >
                {species}
              </button>
            ))}
          </div>
        </div>

        {/* Parrot Grid */}
        {filteredParrots.length === 0 ? (
          <div className="text-center py-16 bg-cream-100/60 rounded-2xl border border-dashed border-cream-300 space-y-3">
            <AlertCircle className="w-10 h-10 text-forest-600/60 mx-auto" />
            <h3 className="text-lg font-bold text-forest-900">No companions match your search</h3>
            <p className="text-sm text-forest-700/70">
              Try adjusting your species or search filters, or reach out to us for upcoming intakes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParrots.map((parrot) => (
              <div
                key={parrot.id}
                className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Photo & Badges */}
                <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={parrot.imageUrl}
                    alt={parrot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-cream-50 text-[11px] font-bold">
                      {parrot.species}
                    </span>
                    {parrot.featuredOnHome && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                        parrot.status === "Available"
                          ? "bg-emerald-600 text-cream-50"
                          : parrot.status === "Pending"
                          ? "bg-amber-600 text-cream-50"
                          : "bg-gray-600 text-cream-50"
                      }`}
                    >
                      {parrot.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-2xl font-black text-forest-900 font-serif">
                        {parrot.name}
                      </h3>
                      <span className="text-xs font-semibold text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                        {parrot.age} • {parrot.gender}
                      </span>
                    </div>

                    <p className="text-sm text-forest-800/80 line-clamp-3 leading-relaxed">
                      {parrot.description}
                    </p>

                    {/* Personality Traits */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parrot.personality.map((trait, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-cream-200 text-forest-850 px-2 py-0.5 rounded-md"
                        >
                          #{trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-cream-200 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleApply(parrot)}
                      disabled={parrot.status === "Adopted"}
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        parrot.status === "Adopted"
                          ? "bg-cream-200 text-forest-700/50 cursor-not-allowed"
                          : "bg-forest-800 text-cream-50 hover:bg-forest-900 shadow-xs hover:shadow"
                      }`}
                    >
                      <span>Apply to Adopt</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
