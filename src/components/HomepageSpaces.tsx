import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { HomepageSlot } from "@/lib/types";

interface HomepageSpacesProps {
  slots: HomepageSlot[];
}

export default function HomepageSpaces({ slots }: HomepageSpacesProps) {
  const spotlight = slots.find((s) => s.slotKey === "spotlight_feature") || {
    id: "slot-2",
    slotKey: "spotlight_feature",
    title: "Sanctuary Spotlight: Rehabilitation & Care",
    subtitle: "Every parrot rescued goes through extensive avian vet checkups, behavioral enrichment, and personalized diet plans.",
    imageUrl: "https://images.unsplash.com/photo-1544943910-4c1dc44a0462?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Download Adoption Form",
    ctaLink: "#process",
  };

  const careStory = slots.find((s) => s.slotKey === "care_story") || {
    id: "slot-3",
    slotKey: "care_story",
    title: "Life-long Companionship",
    subtitle: "Parrots are sentient, emotional beings with lifespans up to 60+ years. Our adoption process ensures safe matches that last a lifetime.",
    imageUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Submit Filled Form",
    ctaLink: "#submit-form",
  };

  const sanctuaryLife = slots.find((s) => s.slotKey === "sanctuary_life") || {
    id: "slot-4",
    slotKey: "sanctuary_life",
    title: "Our Flight Aviaries & Social Flocks",
    subtitle: "Parrots socialise in free-flight sunlit aviaries before joining their forever homes.",
    imageUrl: "https://images.unsplash.com/photo-1522858547550-3405742f16f0?auto=format&fit=crop&w=1200&q=80",
  };

  return (
    <section id="spaces" className="py-20 bg-cream-100/50 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-850 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>Homepage Curated Showcase Spaces</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-serif">
            Sanctuary Life & Flight Galleries
          </h2>
          <p className="text-forest-800/80 text-base">
            These spaces highlight our rescue mission, aviary environments, and successful flock integrations (fully managed and customizable in the admin panel).
          </p>
        </div>

        {/* Feature Grid / Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Slot 2: Spotlight */}
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-100 px-2.5 py-1 rounded-md">
                  Space 2 • Spotlight Feature
                </span>
                <span className="text-xs text-forest-700/60 font-medium">Admin Editable</span>
              </div>
              <h3 className="text-2xl font-bold text-forest-900 font-serif">
                {spotlight.title}
              </h3>
              <p className="text-forest-800/80 text-sm leading-relaxed">
                {spotlight.subtitle}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-cream-200 relative group border-2 border-cream-100 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={spotlight.imageUrl}
                  alt={spotlight.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Link
                href={spotlight.ctaLink || "#process"}
                className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-forest-600 transition-colors pt-2"
              >
                <span>{spotlight.ctaText || "Learn More"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Slot 3: Care Story */}
          <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-100 px-2.5 py-1 rounded-md">
                  Space 3 • Care Story
                </span>
                <span className="text-xs text-forest-700/60 font-medium">Admin Editable</span>
              </div>
              <h3 className="text-2xl font-bold text-forest-900 font-serif">
                {careStory.title}
              </h3>
              <p className="text-forest-800/80 text-sm leading-relaxed">
                {careStory.subtitle}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-cream-200 relative group border-2 border-cream-100 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={careStory.imageUrl}
                  alt={careStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <Link
                href={careStory.ctaLink || "#submit-form"}
                className="inline-flex items-center gap-2 text-sm font-bold text-forest-800 hover:text-forest-600 transition-colors pt-2"
              >
                <span>{careStory.ctaText || "Submit Form"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Slot 4: Wide Sanctuary Space */}
        <div className="rounded-2xl bg-forest-900 text-cream-50 p-6 sm:p-10 relative overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-300 bg-forest-800/80 px-2.5 py-1 rounded-md border border-forest-700">
                Space 4 • Sanctuary Aviaries
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
                {sanctuaryLife.title}
              </h3>
              <p className="text-cream-200/80 text-sm leading-relaxed">
                {sanctuaryLife.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-forest-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Natural Wood Perches & UV Skylights
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  Daily Foraging & Organic Diet
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden aspect-[16/9] border-2 border-forest-700 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sanctuaryLife.imageUrl}
                  alt={sanctuaryLife.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
