"use client";

import React, { useState } from "react";
import FeatherHeader from "@/components/FeatherHeader";
import FeatherHero from "@/components/FeatherHero";
import WhoWeAreSection from "@/components/WhoWeAreSection";
import HowAdoptionWorksSection from "@/components/HowAdoptionWorksSection";
import SupportAndContactSection from "@/components/SupportAndContactSection";
import FeatherFooter from "@/components/FeatherFooter";
import InquiryModal from "@/components/InquiryModal";
import { Parrot, HomepageSlot } from "@/lib/types";

interface HomeClientProps {
  initialParrots: Parrot[];
  initialSlots: HomepageSlot[];
}

export default function HomeClient({ initialSlots }: HomeClientProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryPrefix, setInquiryPrefix] = useState("Adoption Inquiry");

  const heroSlot = initialSlots.find((s) => s.slotKey === "hero_main");

  const handleOpenInquiry = (prefix?: string) => {
    setInquiryPrefix(prefix || "Adoption Inquiry");
    setIsInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-900 font-sans selection:bg-sage-200 selection:text-forest-950">
      {/* Top Header */}
      <FeatherHeader theme="light" />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Section 1: Hero Block (Dark Forest Green with Stylized Bird & Explore CTA) */}
        <FeatherHero heroSlot={heroSlot} />

        {/* Section 2: Who We Are & Glimpse into our world (3 Image Slots) */}
        <WhoWeAreSection slots={initialSlots} />

        {/* Section 3: How Adoption Works (4 Step Cards & Email about Adoption) */}
        <HowAdoptionWorksSection onOpenInquiry={handleOpenInquiry} />

        {/* Section 4: Support & Contact, US Serving, Application Preview & Form Submission */}
        <SupportAndContactSection onOpenInquiry={handleOpenInquiry} />
      </main>

      {/* Footer */}
      <FeatherFooter />

      {/* Direct Inquiry / Email Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        defaultSubjectPrefix={inquiryPrefix}
      />
    </div>
  );
}
