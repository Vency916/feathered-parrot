"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, AlertCircle, Mail } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectPrefix?: string;
}

export default function InquiryModal({
  isOpen,
  onClose,
  defaultSubjectPrefix = "Adoption Inquiry",
}: InquiryModalProps) {
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSending(true);

    try {
      // Record inquiry in received emails inbox and applications
      await Promise.all([
        fetch("/api/admin/received-emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromEmail: senderEmail,
            fromName: senderName,
            subject: defaultSubjectPrefix,
            message: `${message}\n\n---\nSender Details:\nPhone: ${phone || "Not provided"}\nLocation: ${location || "Not provided"}`,
            source: "Contact Form",
            category: defaultSubjectPrefix.toLowerCase().includes("donat") ? "Donations" : "Adoption Inquiry",
          }),
        }),
        fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicantName: senderName,
            email: senderEmail,
            phone: phone || "Not provided",
            cityState: location,
            address: location,
            experienceLevel: "Direct Email Inquiry",
            notes: `[Subject: ${defaultSubjectPrefix}] ${message}`,
            submittedFormFileName: "Direct_Inquiry.txt",
          }),
        }),
      ]);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setSenderName("");
        setSenderEmail("");
        setMessage("");
      }, 2500);
} catch (err) {
  setError(err instanceof Error ? err.message : "Failed to send inquiry.");
} finally {
  setIsSending(false);
}
  };

const mailtoHref = `mailto:adoptions@fhpra.org?subject=${encodeURIComponent(
  defaultSubjectPrefix
)}&body=${encodeURIComponent(
  `Hello Feathered Haven team,\n\nName: ${senderName}\nLocation: ${location}\nPhone: ${phone}\n\nMessage:\n${message}`
)}`;

return (
  <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-cream-50 rounded-3xl border border-cream-300 max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-1 rounded-full text-forest-700 hover:text-forest-900 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest-700">
          {defaultSubjectPrefix.toUpperCase()}
        </p>
        <h3 className="text-xl sm:text-2xl font-extrabold text-forest-900 font-sans tracking-tight">
          Send Us an Email
        </h3>
        <p className="text-xs text-forest-700/80">
          Send a direct message to our avian care committee or use your default email client.
        </p>
      </div>

      {success ? (
        <div className="bg-sage-100 rounded-2xl p-6 text-center space-y-3 border border-sage-300">
          <CheckCircle2 className="w-10 h-10 text-forest-700 mx-auto" />
          <h4 className="text-base font-bold text-forest-900">Message Delivered</h4>
          <p className="text-xs text-forest-800/80">
            Thank you! Our adoption team will respond to <span className="font-semibold">{senderEmail}</span> shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Your name *
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="First and last name"
              className="w-full px-3.5 py-2 rounded-xl bg-cream-100 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Email address *
              </label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-cream-100 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                City, state
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Portland, OR"
                className="w-full px-3.5 py-2 rounded-xl bg-cream-100 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Phone number (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full px-3.5 py-2 rounded-xl bg-cream-100 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Message / bird reference details *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you are looking for, species preference, or how you would like to help..."
              className="w-full px-3.5 py-2 rounded-xl bg-cream-100 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={mailtoHref}
              className="text-xs text-forest-700 hover:text-forest-900 underline flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open in email app instead</span>
            </a>

            <button
              type="submit"
              disabled={isSending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-cream-100 font-bold text-xs uppercase tracking-wider hover:bg-forest-850 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? "Sending..." : "Send Message"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);
}
