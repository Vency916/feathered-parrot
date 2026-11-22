"use client";

import React, { useState, useRef } from "react";
import { Download, Upload, CheckCircle2, Paperclip, AlertCircle, RefreshCw } from "lucide-react";
import { generateAdoptionFormPDF } from "@/lib/pdfGenerator";

interface SupportAndContactProps {
  onOpenInquiry?: (subjectPrefix?: string) => void;
}

export default function SupportAndContactSection({ onOpenInquiry }: SupportAndContactProps) {
  // Application Form State
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [cityState, setCityState] = useState("");
  const [parrotExperience, setParrotExperience] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const handleDownloadForm = () => {
    setIsDownloading(true);
    try {
      generateAdoptionFormPDF();
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 12 * 1024 * 1024) {
      setErrorMessage("File exceeds 12MB. Please compress or select a smaller scan.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setFileDataUrl(event.target.result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !emailAddress) {
      setErrorMessage("Please provide your full name and email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: fullName,
          email: emailAddress,
          phone: phoneNumber || "Not provided",
          cityState: cityState,
          address: cityState,
          experienceLevel: parrotExperience || "General inquiry",
          notes: notes,
          submittedFormFileName: fileName || "Adoption_Form.pdf",
          submittedFormDataUrl: fileDataUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmittedAppId(data.application.id);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmailAddress("");
    setCityState("");
    setParrotExperience("");
    setPhoneNumber("");
    setNotes("");
    setFile(null);
    setFileDataUrl("");
    setFileName("");
    setSubmittedAppId(null);
    setErrorMessage(null);
  };

  return (
    <section id="support-contact" className="bg-cream-100 text-forest-900 py-16 sm:py-20 border-b border-cream-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {/* SUPPORT & CONTACT */}
        <div className="space-y-6">
          <div className="space-y-4 max-w-3xl">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-forest-700">
              SUPPORT & CONTACT
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-forest-900 leading-snug">
              Help us care for parrots.
            </h2>
            <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed font-normal">
              If you would like to support food, enrichment, veterinary care or other bird welfare needs, please contact us by email. We do not accept automatic donations through this website.
            </p>
          </div>

          {/* Donations Handled by Email Card */}
          <div className="bg-sage-200/90 rounded-2xl p-6 sm:p-8 space-y-4 border border-sage-300/60 shadow-xs max-w-3xl">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-forest-800">
              DONATIONS ARE HANDLED BY EMAIL
            </p>
            <p className="text-xs sm:text-sm text-forest-900/90 leading-relaxed">
              Tell us how you would like to help. We will respond with information about our needs and how support can be arranged.
            </p>
            <div>
              <button
                onClick={() => {
                  if (onOpenInquiry) {
                    onOpenInquiry("Donation Inquiry");
                  } else {
                    window.location.href = "mailto:adoptions@fhpra.org?subject=Donation Inquiry";
                  }
                }}
                className="inline-block px-6 py-2.5 rounded-full bg-forest-900 text-cream-100 font-bold text-xs sm:text-sm tracking-wide hover:bg-forest-850 transition-all cursor-pointer shadow-xs"
              >
                Email about donations
              </button>
            </div>
          </div>
        </div>

        {/* Serving Families Across US */}
        <div className="space-y-3 max-w-3xl">
          <h3 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight">
            Serving families across the United States
          </h3>
          <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed">
            We are based in the United States. When an adoption is approved, we can discuss transportation to locations across the country, subject to the bird’s welfare, carrier policies and applicable laws.
          </p>
        </div>

        {/* APPLICATION PREVIEW / INTERACTIVE FORM CARD */}
        <div id="application-form" className="scroll-mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-xs space-y-8">
            <div className="space-y-2 border-b border-cream-200 pb-4">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-forest-700">
                APPLICATION PREVIEW
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans tracking-tight">
                Tell us about your home
              </h3>
              <p className="text-xs text-forest-700/80">
                Download our official PDF form, or submit your details and completed form directly below.
              </p>
            </div>

            {submittedAppId ? (
              <div className="bg-sage-100 rounded-2xl p-6 sm:p-8 text-center space-y-4 border border-sage-300">
                <div className="w-12 h-12 rounded-full bg-forest-800 text-cream-50 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-forest-900">
                  Application Received
                </h4>
                <p className="text-xs sm:text-sm text-forest-800/85 max-w-md mx-auto">
                  Thank you, <span className="font-bold">{fullName}</span>. Your application (Ref: <code className="font-mono font-bold text-forest-900">{submittedAppId}</code>) has been submitted to the Feathered Haven adoption committee.
                </p>
                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-forest-900 text-cream-100 text-xs font-bold uppercase tracking-wider hover:bg-forest-850 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit another application</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 4 Mockup Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Full name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full legal name"
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Email address *
                    </label>
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      City / state
                    </label>
                    <input
                      type="text"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      placeholder="e.g. Portland, OR"
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-forest-900 mb-1">
                      Parrot experience
                    </label>
                    <input
                      type="text"
                      value={parrotExperience}
                      onChange={(e) => setParrotExperience(e.target.value)}
                      placeholder="Prior species, years keeping companion birds"
                      className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Optional Phone */}
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Phone number (optional)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
                  />
                </div>

                {/* Form Download & Upload Sub-block */}
                <div className="bg-cream-50 rounded-2xl p-5 border border-cream-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                        Official Adoption Application Form (PDF)
                      </h4>
                      <p className="text-[11px] text-forest-700/80">
                        Download our comprehensive PDF application, fill it out, and upload it back.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadForm}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-900 hover:bg-forest-850 text-cream-50 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloading ? "Downloading..." : "Download Form (PDF)"}</span>
                    </button>
                  </div>

                  {/* Upload Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${fileName
                        ? "border-forest-600 bg-sage-100"
                        : "border-cream-300 bg-white hover:bg-cream-50"
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/*,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {fileName ? (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-forest-900">
                        <Paperclip className="w-4 h-4 text-forest-700" />
                        <span>Attached: {fileName}</span>
                        <span className="text-[10px] text-forest-600 font-normal">(Click to change)</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-xs text-forest-700">
                        <Upload className="w-4 h-4 text-forest-600" />
                        <span>Optional: Attach completed filled PDF or scanned form</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[11px] text-forest-700/70">
                    * Submissions are securely delivered to the Feathered Haven adoption team.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-block px-8 py-3 rounded-full bg-forest-900 text-cream-100 font-bold text-xs sm:text-sm tracking-wide hover:bg-forest-850 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Let's talk about a thoughtful adoption */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-forest-900 tracking-tight">
              Let’s talk about a thoughtful adoption.
            </h3>
            <p className="text-xs sm:text-sm text-forest-800/85 leading-relaxed">
              For adoption inquiries, please email a bird picture or reference image. Include your name, city and state, and a phone number if you would like us to call.
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
              Contact our team
            </button>
          </div>
        </div>


      </div>
    </section>
  );
}
