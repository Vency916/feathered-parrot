"use client";

import React from "react";
import Link from "next/link";

interface HowAdoptionWorksProps {
  onOpenInquiry?: (subjectPrefix?: string) => void;
}

export default function HowAdoptionWorksSection({ onOpenInquiry }: HowAdoptionWorksProps) {
  const steps = [
    {
      num: "01",
      title: "Reach out first",
      desc: "Email us with a picture or reference image of the type of parrot you are interested in. Include a short introduction and your phone number if you would like a call.",
    },
    {
      num: "02",
      title: "Complete our application",
      desc: "If you wish to move forward, select “View adoption application.” We request information to understand whether your home is a suitable fit.",
    },
    {
      num: "03",
      title: "Review and conversation",
      desc: "We review your responses, discuss care expectations and may ask follow-up questions before deciding whether to proceed.",
    },
    {
      num: "04",
      title: "Plan a responsible placement",
      desc: "If approved and an appropriate match is available, we discuss next steps and safe transport arrangements within the United States.",
    },
  ];

  return (
    <section id="how-adoption-works" className="bg-cream-100 text-forest-900 py-16 sm:py-20 border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-forest-700">
            HOW ADOPTION WORKS
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-forest-900 leading-snug">
            The right match matters.
          </h2>
          <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed font-normal">
            Our parrots are not placed with just anyone. We take time to learn about each interested household and consider experience, environment, daily routine and the ability to provide lifelong care.
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-cream-300/80 shadow-xs flex items-start gap-5 hover:border-forest-600/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-sage-200 text-forest-900 font-bold text-xs flex items-center justify-center shrink-0">
                {step.num}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-extrabold text-forest-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dark Interested in Adopting Callout Box */}
        <div className="bg-forest-900 text-cream-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-forest-300">
              INTERESTED IN ADOPTING?
            </p>
            <p className="text-xs sm:text-sm text-cream-100/90 font-medium">
              Our application is the next step - not an instant approval.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="#application-form"
              className="inline-block px-6 py-2.5 rounded-full bg-cream-100 text-forest-900 font-bold text-xs sm:text-sm tracking-wide hover:bg-white transition-all shadow-xs"
            >
              View adoption application
            </Link>
          </div>
        </div>

        {/* Adoption Inquiries Sub-section */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight">
              Adoption inquiries
            </h3>
            <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed">
              We do not list individual birds for adoption on this website. To tell us what you are looking for, email a picture of the bird you are interested in, along with your name, location and optional phone number.
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                if (onOpenInquiry) {
                  onOpenInquiry("Adoption Inquiry");
                } else {
                  window.location.href = "mailto:adoptions@fhpra.org?subject=Adoption Inquiry";
                }
              }}
              className="inline-block px-6 py-2.5 rounded-full bg-forest-900 text-cream-100 font-bold text-xs sm:text-sm tracking-wide hover:bg-forest-850 transition-all cursor-pointer shadow-xs"
            >
              Email about adoption
            </button>
          </div>
        </div>


      </div>
    </section>
  );
}
