import React from "react";
import Link from "next/link";

export default function FeatherFooter() {
  return (
    <footer className="bg-forest-950 text-cream-200 py-12 border-t border-forest-900">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-6">
        {/* Main Footer Links */}
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs font-semibold tracking-wider uppercase text-cream-200/90">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-forest-700 bg-white shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Feathered Haven Parrot Rescue Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-cream-50 font-black text-sm">FEATHERED HAVEN</span>
              <span className="opacity-40">|</span>
              <span>New York, USA</span>
              <span className="opacity-40">|</span>
              <a href="mailto:adoptions@featherandhome.org" className="hover:text-cream-50 transition-colors">
                adoptions@featherandhome.org
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-6 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-300/60 tracking-wider gap-2">
          <span>Non-profit Avian Rehabilitation, Rescue & Responsible Adoption</span>
          <span className="font-mono">© {new Date().getFullYear()} Feathered Haven. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
