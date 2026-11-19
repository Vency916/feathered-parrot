import React from "react";
import Link from "next/link";
import { Feather, Heart, Mail, MapPin, Phone, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-cream-50">
                <Feather className="w-5 h-5 -rotate-12" />
              </div>
              <div>
                <span className="text-xl font-black text-cream-50 font-serif">
                  Aura<span className="text-forest-400 font-sans font-bold">Parrot</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-cream-300 block">Sanctuary</span>
              </div>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed">
              Providing lifelong sanctuary, specialized avian rehabilitation, and loving ethical adoptions for parrots in need.
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-300 bg-forest-900/60 p-2.5 rounded-lg border border-forest-800/60">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
              <span>100% non-profit companion parrot rescue</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream-50 font-bold text-sm uppercase tracking-wider mb-4">
              Adoption & Care
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-200/80">
              <li>
                <Link href="/#parrots" className="hover:text-cream-50 transition-colors">
                  Available Parrots
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-cream-50 transition-colors">
                  How Adoption Works
                </Link>
              </li>
              <li>
                <Link href="/#submit-form" className="hover:text-cream-50 transition-colors">
                  Submit Completed Form
                </Link>
              </li>
              <li>
                <Link href="/#spaces" className="hover:text-cream-50 transition-colors">
                  Sanctuary Facilities & Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Sanctuary Contact */}
          <div>
            <h4 className="text-cream-50 font-bold text-sm uppercase tracking-wider mb-4">
              Sanctuary Contact
            </h4>
            <ul className="space-y-3 text-sm text-cream-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-forest-400 shrink-0 mt-0.5" />
                <span>884 Canopy Way, Evergreen Valley, OR 97201</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-forest-400 shrink-0" />
                <span>(555) 328-BIRD (2473)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-forest-400 shrink-0" />
                <span>adoptions@auraparrot.org</span>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-4">
            <h4 className="text-cream-50 font-bold text-sm uppercase tracking-wider">
              Staff Portal
            </h4>
            <p className="text-xs text-cream-300 leading-relaxed">
              Authorized caretakers and administrators can manage parrot listings, inspect submitted forms, and dispatch applicant emails.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest-800 hover:bg-forest-700 text-cream-50 text-xs font-bold rounded-lg border border-forest-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-forest-300" />
              Staff Login Panel
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-900 text-center text-xs text-cream-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AuraParrot Sanctuary. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js • Prepared for Vercel Deployment
          </p>
        </div>
      </div>
    </footer>
  );
}
