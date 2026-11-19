"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, FileText, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { generateAdoptionFormPDF } from "@/lib/pdfGenerator";

export default function AdoptionProcess() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadForm = () => {
    setDownloading(true);
    try {
      generateAdoptionFormPDF();
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <section id="process" className="py-20 bg-cream-100/60 border-t border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-850 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            <span>Clear & Transparent Steps</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-serif">
            How Our Adoption Process Works
          </h2>
          <p className="text-forest-800/80 text-base">
            We prioritize lifelong bird welfare with a simple 3-step application flow: download the form, fill it out, and submit it back through our site.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-cream-50 rounded-2xl border-2 border-forest-800/20 p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-forest-900 font-serif">
                Download Official Form
              </h3>
              <p className="text-forest-800/80 text-sm leading-relaxed">
                Click below to download our standardized PDF application form. It covers your living environment, avian vet references, and cage setup details.
              </p>
            </div>

            <div className="pt-6">
              <button
                onClick={handleDownloadForm}
                disabled={downloading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <Download className="w-4 h-4 text-forest-300" />
                <span>{downloading ? "Generating PDF..." : "Download Form (PDF)"}</span>
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-cream-50 rounded-2xl border-2 border-forest-800/20 p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-forest-900 font-serif">
                Fill & Sign Form
              </h3>
              <p className="text-forest-800/80 text-sm leading-relaxed">
                Fill the downloaded document either electronically or print and sign by hand. Take a clear scan or snapshot of each page on your device.
              </p>
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-300 text-xs text-forest-850 space-y-1">
                <span className="font-bold flex items-center gap-1 text-forest-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                  Key details to include:
                </span>
                <p className="text-forest-700/80">Cage dimensions, Teflon/PTFE safety awareness & veterinary details.</p>
              </div>
            </div>

            <div className="pt-6">
              <div className="w-full py-2.5 px-4 rounded-xl bg-cream-200/80 text-forest-800 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-forest-600" />
                <span>PDF, Scan or Photos</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-cream-50 rounded-2xl border-2 border-forest-800/20 p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-600 text-cream-50 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-forest-900 font-serif">
                Submit Online & Review
              </h3>
              <p className="text-forest-800/80 text-sm leading-relaxed">
                Upload your completed form using our submission portal below. Our adoption team immediately receives it and follows up via email within 48 hours.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="#submit-form"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-forest-800 text-forest-850 font-bold text-xs uppercase tracking-wider hover:bg-forest-100 transition-all shadow-xs"
              >
                <span>Go to Submission Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Note / Support Box */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-forest-900">Have questions about cage setup or avian diets?</h4>
              <p className="text-xs text-forest-700/80">Our care team answers inquiries every weekday from 9am to 5pm.</p>
            </div>
          </div>
          <a
            href="mailto:adoptions@auraparrot.org"
            className="text-xs font-bold text-forest-800 hover:text-forest-600 underline underline-offset-4 shrink-0"
          >
            adoptions@auraparrot.org
          </a>
        </div>
      </div>
    </section>
  );
}
