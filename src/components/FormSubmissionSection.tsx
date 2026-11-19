"use client";

import React, { useState, useRef } from "react";
import { Download, Upload, CheckCircle, FileText, AlertCircle, RefreshCw, Paperclip } from "lucide-react";
import { Parrot } from "@/lib/types";
import { generateAdoptionFormPDF } from "@/lib/pdfGenerator";

interface FormSubmissionSectionProps {
  parrots: Parrot[];
  selectedParrot?: Parrot | null;
}

export default function FormSubmissionSection({
  parrots,
  selectedParrot,
}: FormSubmissionSectionProps) {
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parrotId, setParrotId] = useState(selectedParrot?.id || "");
  const [parrotName, setParrotName] = useState(selectedParrot?.name || "");
  const [address, setAddress] = useState("");
  const [housingType, setHousingType] = useState<"House" | "Apartment" | "Condo" | "Other">("House");
  const [experienceLevel, setExperienceLevel] = useState<"Beginner" | "Intermediate" | "Experienced">("Intermediate");
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [petDetails, setPetDetails] = useState("");
  const [notes, setNotes] = useState("");

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form submission status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApplicationId, setSubmittedApplicationId] = useState<string | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  // Update selected parrot when prop changes
  React.useEffect(() => {
    if (selectedParrot) {
      setParrotId(selectedParrot.id);
      setParrotName(selectedParrot.name);
    }
  }, [selectedParrot]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 12 * 1024 * 1024) {
      setError("File size exceeds 12MB. Please compress or choose a smaller scan.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setFileDataUrl(event.target.result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDownloadTemplate = () => {
    setIsDownloadingTemplate(true);
    try {
      generateAdoptionFormPDF();
    } finally {
      setTimeout(() => setIsDownloadingTemplate(false), 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!applicantName || !email || !phone) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }

    if (!fileDataUrl && !fileName) {
      setError("Please attach your completed filled adoption form (PDF or clear photo/scan).");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName,
          email,
          phone,
          parrotId,
          parrotName: parrotName || (parrots.find((p) => p.id === parrotId)?.name ?? "General / Any"),
          address,
          housingType,
          experienceLevel,
          hasOtherPets,
          petDetails,
          notes,
          submittedFormFileName: fileName,
          submittedFormDataUrl: fileDataUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSubmittedApplicationId(data.application.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setApplicantName("");
    setEmail("");
    setPhone("");
    setParrotId("");
    setParrotName("");
    setAddress("");
    setNotes("");
    setPetDetails("");
    setFile(null);
    setFileDataUrl("");
    setFileName("");
    setSubmittedApplicationId(null);
    setError(null);
  };

  return (
    <section id="submit-form" className="py-20 bg-cream-50 scroll-mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-850 text-xs font-bold uppercase tracking-wider">
            <Upload className="w-3.5 h-3.5 text-forest-600" />
            <span>Adoption Submission Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-900 font-serif">
            Submit Your Completed Application
          </h2>
          <p className="text-forest-800/80 text-sm sm:text-base max-w-xl mx-auto">
            Once you have downloaded and filled out your official form, upload it below along with your contact information. Our admin team will receive it immediately.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate}
              className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 bg-cream-100 hover:bg-cream-200 border border-cream-300 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-forest-600" />
              <span>Don&apos;t have the blank form yet? Click here to download</span>
            </button>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {submittedApplicationId ? (
          <div className="bg-cream-50 rounded-3xl border-2 border-forest-600 p-8 sm:p-12 text-center space-y-6 shadow-md animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-700 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-forest-900 font-serif">
                Application Received Successfully!
              </h3>
              <p className="text-forest-800/80 text-sm max-w-lg mx-auto">
                Thank you, <span className="font-bold text-forest-900">{applicantName}</span>. Your completed adoption application and attached form have been securely transmitted to the AuraParrot Sanctuary Admin Team.
              </p>
            </div>

            <div className="inline-block bg-cream-100 border border-cream-300 rounded-2xl px-6 py-4 text-left">
              <div className="text-xs text-forest-700 font-semibold uppercase tracking-wider">
                Application Reference Code
              </div>
              <div className="text-2xl font-mono font-black text-forest-900 tracking-wider">
                {submittedApplicationId}
              </div>
              <div className="text-xs text-forest-600 mt-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Attached: {fileName || "Completed_Form.pdf"}</span>
              </div>
            </div>

            <div className="bg-forest-50 p-4 rounded-xl border border-forest-200 max-w-lg mx-auto text-xs text-forest-850 leading-relaxed text-left space-y-1.5">
              <span className="font-bold block text-forest-900">What Happens Next?</span>
              <p>1. Our avian welfare committee reviews your home environment details.</p>
              <p>2. The admin will reach out to <span className="font-semibold">{email}</span> via email to coordinate the next steps or request veterinary records.</p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Submit Another Application</span>
              </button>
            </div>
          </div>
        ) : (
          /* Form Entry */
          <form
            onSubmit={handleSubmit}
            className="bg-cream-100/70 rounded-3xl border border-cream-300 p-6 sm:p-10 shadow-xs space-y-8"
          >
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Submission Error:</span> {error}
                </div>
              </div>
            )}

            {/* Applicant Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-900 font-serif border-b border-cream-300 pb-2">
                1. Applicant Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-850 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-850 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-850 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-850 mb-1">
                    Parrot of Interest
                  </label>
                  <select
                    value={parrotId}
                    onChange={(e) => {
                      setParrotId(e.target.value);
                      const match = parrots.find((p) => p.id === e.target.value);
                      setParrotName(match ? match.name : "");
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="">Any available companion / Undecided</option>
                    {parrots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.species}) - {p.status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-850 mb-1">
                  Home City & State
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Portland, OR"
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            {/* Housing & Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-900 font-serif border-b border-cream-300 pb-2">
                2. Environment & Avian Background
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-850 mb-1">
                    Residence Type
                  </label>
                  <select
                    value={housingType}
                    onChange={(e) => setHousingType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="House">Single Family House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condo">Condo / Townhouse</option>
                    <option value="Other">Other / Aviary Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-850 mb-1">
                    Parrot Handling Experience
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="Beginner">First Time Companion Bird Guardian</option>
                    <option value="Intermediate">1-5 Years Prior Bird Experience</option>
                    <option value="Experienced">Experienced Aviculturist (5+ Years)</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-forest-900">
                  <input
                    type="checkbox"
                    checked={hasOtherPets}
                    onChange={(e) => setHasOtherPets(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700 accent-forest-700"
                  />
                  <span>Do you have other pets in the home? (Dogs, cats, other birds)</span>
                </label>
                {hasOtherPets && (
                  <input
                    type="text"
                    value={petDetails}
                    onChange={(e) => setPetDetails(e.target.value)}
                    placeholder="List species, ages, and whether separate rooms exist for birds"
                    className="mt-2 w-full px-4 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                )}
              </div>
            </div>

            {/* File Upload of the Filled Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest-900 font-serif border-b border-cream-300 pb-2">
                3. Upload Completed Adoption Form *
              </h3>
              <p className="text-xs text-forest-700/80">
                Please attach the filled official form (PDF, scanned documents, or clear camera photos).
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  fileName
                    ? "border-forest-600 bg-forest-50/60"
                    : "border-cream-400 bg-cream-50 hover:bg-cream-100/60"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/webp,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {fileName ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-forest-700 text-cream-50 mx-auto flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-forest-900">{fileName}</p>
                    <p className="text-xs text-forest-600">
                      Form attached successfully! Click to choose a different file if needed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full bg-cream-200 text-forest-700 mx-auto flex items-center justify-center">
                      <Paperclip className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-forest-900">
                        Click to browse or drop your filled form here
                      </p>
                      <p className="text-xs text-forest-700/70 mt-1">
                        Accepts PDF, JPG, PNG or DOCX (Max 12MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-bold text-forest-850 mb-1">
                Additional Notes or Questions for the Caretakers
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any special housing accommodations, daily schedule, or questions..."
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-300 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-forest-700/70">
                * By submitting, you confirm all provided avian care information is accurate.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-forest-800 text-cream-50 font-bold text-sm uppercase tracking-wider hover:bg-forest-900 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4 text-forest-300" />
                <span>{loading ? "Submitting Application..." : "Submit Completed Form"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
