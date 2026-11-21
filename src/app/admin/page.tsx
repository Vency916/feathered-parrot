"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Feather,
  LayoutDashboard,
  Bird,
  Image as ImageIcon,
  FileCheck2,
  Mail,
  Send,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Upload,
  RefreshCw,
  LogOut,
  Paperclip,
  Check,
  AlertCircle,
  Eye,
  Download,
  Menu,
  X,
  ChevronRight,
  FileText,
  Inbox,
  Reply,
  Search,
  CheckCheck,
  Filter,
} from "lucide-react";
import {
  Parrot,
  AdoptionApplication,
  HomepageSlot,
  SentEmailLog,
  ReceivedEmail,
  ParrotSpecies,
  AdoptionStatus,
  ApplicationStatus,
} from "@/lib/types";
import { EMAIL_TEMPLATES } from "@/lib/emailTemplates";

type AdminTab = "overview" | "parrots" | "spaces" | "submissions" | "emails";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Data states
  const [parrots, setParrots] = useState<Parrot[]>([]);
  const [spaces, setSpaces] = useState<HomepageSlot[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [emails, setEmails] = useState<SentEmailLog[]>([]);
  const [receivedEmails, setReceivedEmails] = useState<ReceivedEmail[]>([]);
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    connected: boolean;
    provider: string;
    latencyMs?: number;
    error?: string;
  } | null>(null);

  // Email Sub-tab & Inbox States
  const [emailViewMode, setEmailViewMode] = useState<"inbox" | "compose" | "sent">("inbox");
  const [selectedReceivedEmail, setSelectedReceivedEmail] = useState<ReceivedEmail | null>(null);
  const [inboxSearch, setInboxSearch] = useState("");
  const [inboxFilter, setInboxFilter] = useState<"all" | "unread" | "replied">("all");

  // Parrot Form Modal
  const [isParrotModalOpen, setIsParrotModalOpen] = useState(false);
  const [editingParrotId, setEditingParrotId] = useState<string | null>(null);
  const [parrotName, setParrotName] = useState("");
  const [parrotSpecies, setParrotSpecies] = useState<ParrotSpecies>("Macaw");
  const [parrotAge, setParrotAge] = useState("");
  const [parrotGender, setParrotGender] = useState<"Male" | "Female" | "Unknown">("Male");
  const [parrotStatus, setParrotStatus] = useState<AdoptionStatus>("Available");
  const [parrotDescription, setParrotDescription] = useState("");
  const [parrotPersonality, setParrotPersonality] = useState("");
  const [parrotImageUrl, setParrotImageUrl] = useState("");
  const [parrotFeatured, setParrotFeatured] = useState(false);
  const [parrotHealth, setParrotHealth] = useState("");
  const [parrotDiet, setParrotDiet] = useState("");
  const parrotFileInputRef = useRef<HTMLInputElement>(null);

  // Email Dispatcher State
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("received");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);

  // Selected Submission Modal
  const [selectedApp, setSelectedApp] = useState<AdoptionApplication | null>(null);
  const [appAdminNotes, setAppAdminNotes] = useState("");
  const [pdfPreview, setPdfPreview] = useState<{ url: string; fileName: string; applicantName: string } | null>(null);

  // Spaces Editor State
  const [activeSpaceEdit, setActiveSpaceEdit] = useState<HomepageSlot | null>(null);
  const spaceFileInputRef = useRef<HTMLInputElement>(null);
  const [spaceSaveFeedback, setSpaceSaveFeedback] = useState<string | null>(null);

  // Initial Data Fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const [parrotsRes, spacesRes, appsRes, emailsRes, receivedRes, dbStatusRes] = await Promise.all([
        fetch("/api/parrots"),
        fetch("/api/homepage-slots"),
        fetch("/api/applications"),
        fetch("/api/admin/send-email"),
        fetch("/api/admin/received-emails"),
        fetch("/api/admin/db-status"),
      ]);

      if (parrotsRes.ok) setParrots(await parrotsRes.json());
      if (spacesRes.ok) setSpaces(await spacesRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
      if (emailsRes.ok) setEmails(await emailsRes.json());
      if (receivedRes.ok) setReceivedEmails(await receivedRes.json());
      if (dbStatusRes.ok) setDbStatus(await dbStatusRes.json());
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const authRes = await fetch("/api/admin/auth");
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.replace("/admin/login");
          return;
        }
        setIsAuthenticated(true);
        fetchData();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      }
    };
    checkAuthAndLoad();
  }, [router]);

  // Update default email body when template or recipient changes
  const applyEmailTemplate = (templateId: string, name?: string, parrot?: string) => {
    setSelectedTemplateId(templateId);
    const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailMessage(template.body(name || recipientName, parrot));
    }
  };

  // Open email dispatcher with pre-filled application details
  const handleOpenEmailForApplicant = (app: AdoptionApplication) => {
    setRecipientEmail(app.email);
    setRecipientName(app.applicantName);
    applyEmailTemplate("received", app.applicantName, app.parrotName);
    setActiveTab("emails");
    setEmailViewMode("compose");
    setSelectedApp(null);
    setSidebarOpen(false);
  };

  // Reply to Received Email
  const handleReplyToReceivedEmail = (email: ReceivedEmail) => {
    setRecipientEmail(email.fromEmail);
    setRecipientName(email.fromName || "");
    const replySubject = email.subject.toLowerCase().startsWith("re:")
      ? email.subject
      : `Re: ${email.subject}`;
    setEmailSubject(replySubject);
    setEmailMessage(
      `Dear ${email.fromName || "Friend"},\n\nThank you for reaching out to Feathered Haven regarding "${email.subject}".\n\n\n\nWarm regards,\nFeathered Haven Team\nadoptions@fhpra.org`
    );
    setSelectedTemplateId("custom");
    setActiveTab("emails");
    setEmailViewMode("compose");
    setSelectedReceivedEmail(null);
    // Mark as replied
    handleMarkEmailStatus(email.id, "Replied");
  };

  // Handle Mark Received Email Status
  const handleMarkEmailStatus = async (id: string, newStatus: ReceivedEmail["status"]) => {
    try {
      const res = await fetch(`/api/admin/received-emails/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setReceivedEmails((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedReceivedEmail?.id === id) {
          setSelectedReceivedEmail((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update email status:", err);
    }
  };

  // Handle Delete Received Email
  const handleDeleteReceivedEmail = async (id: string) => {
    if (!confirm("Are you sure you want to delete this received message?")) return;
    try {
      const res = await fetch(`/api/admin/received-emails/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReceivedEmails((prev) => prev.filter((e) => e.id !== id));
        if (selectedReceivedEmail?.id === id) {
          setSelectedReceivedEmail(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete email:", err);
    }
  };

  // Handle Send Email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSuccessMsg(null);
    setEmailErrorMsg(null);
    setIsSendingEmail(true);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          subject: emailSubject,
          message: emailMessage,
          templateUsed: EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name || "Custom",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email");
      }

      setEmailSuccessMsg(data.note || "Email sent successfully!");
      // Refresh email log list
      const emailsRes = await fetch("/api/admin/send-email");
      if (emailsRes.ok) setEmails(await emailsRes.json());
    } catch (err) {
      setEmailErrorMsg(err instanceof Error ? err.message : "Failed to dispatch email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle Application Status Change
  const handleUpdateApplicationStatus = async (
    id: string,
    newStatus: ApplicationStatus,
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
        if (selectedApp?.id === id) {
          setSelectedApp(updated);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle Image Upload for Parrot
  const handleParrotImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setParrotImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Add / Edit Parrot Submit
  const handleSaveParrot = async (e: React.FormEvent) => {
    e.preventDefault();
    const traits = parrotPersonality
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: parrotName,
      species: parrotSpecies,
      age: parrotAge,
      gender: parrotGender,
      status: parrotStatus,
      description: parrotDescription,
      personality: traits,
      imageUrl: parrotImageUrl || "/birds/bird-1.jpeg",
      featuredOnHome: parrotFeatured,
      healthStatus: parrotHealth,
      diet: parrotDiet,
    };

    try {
      if (editingParrotId) {
        const res = await fetch(`/api/parrots/${editingParrotId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setParrots((prev) => prev.map((p) => (p.id === editingParrotId ? updated : p)));
        }
      } else {
        const res = await fetch("/api/parrots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setParrots((prev) => [created, ...prev]);
        }
      }

      setIsParrotModalOpen(false);
      resetParrotForm();
    } catch (err) {
      console.error("Failed to save parrot:", err);
    }
  };

  const handleEditParrot = (parrot: Parrot) => {
    setEditingParrotId(parrot.id);
    setParrotName(parrot.name);
    setParrotSpecies(parrot.species);
    setParrotAge(parrot.age);
    setParrotGender(parrot.gender);
    setParrotStatus(parrot.status);
    setParrotDescription(parrot.description);
    setParrotPersonality(parrot.personality.join(", "));
    setParrotImageUrl(parrot.imageUrl);
    setParrotFeatured(parrot.featuredOnHome);
    setParrotHealth(parrot.healthStatus || "");
    setParrotDiet(parrot.diet || "");
    setIsParrotModalOpen(true);
  };

  const handleDeleteParrot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parrot listing?")) return;
    try {
      const res = await fetch(`/api/parrots/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParrots((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete parrot:", err);
    }
  };

  const resetParrotForm = () => {
    setEditingParrotId(null);
    setParrotName("");
    setParrotSpecies("Macaw");
    setParrotAge("");
    setParrotGender("Male");
    setParrotStatus("Available");
    setParrotDescription("");
    setParrotPersonality("");
    setParrotImageUrl("");
    setParrotFeatured(false);
    setParrotHealth("");
    setParrotDiet("");
  };

  // Handle Space Image Upload & Save
  const handleSpaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSpaceEdit) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setActiveSpaceEdit({
          ...activeSpaceEdit,
          imageUrl: event.target.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSpaceEdit) return;
    setSpaceSaveFeedback(null);

    try {
      const res = await fetch("/api/homepage-slots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeSpaceEdit),
      });

      if (res.ok) {
        const updated = await res.json();
        setSpaces((prev) => prev.map((s) => (s.slotKey === updated.slotKey ? updated : s)));
        setSpaceSaveFeedback("Space updated! Changes will appear immediately on the homepage.");
        setTimeout(() => setSpaceSaveFeedback(null), 4000);
      }
    } catch (err) {
      console.error("Failed to update space:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  // Navigation Items
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "parrots" as AdminTab,
      label: "Parrots",
      icon: Bird,
      badge: parrots.length,
    },
    {
      id: "spaces" as AdminTab,
      label: "Homepage Spaces",
      icon: ImageIcon,
      badge: spaces.length,
    },
    {
      id: "submissions" as AdminTab,
      label: "Adoption Forms",
      icon: FileCheck2,
      badge: applications.length,
      hasPending: applications.some((a) => a.status === "Pending"),
    },
    {
      id: "emails" as AdminTab,
      label: "Inbox & Emails",
      icon: Inbox,
      badge: receivedEmails.length,
      hasPending: receivedEmails.some((e) => e.status === "Unread"),
    },
  ];

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forest-800/40 bg-white mb-4 shadow-md animate-pulse">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Feathered Haven" className="w-full h-full object-cover" />
        </div>
        <p className="text-sm font-bold text-forest-900">Verifying administrator session...</p>
        <p className="text-xs text-forest-700/70 mt-1">Redirecting to login if unauthenticated</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col md:flex-row font-sans text-forest-900">
      {/* MOBILE TOP BAR (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-forest-950 text-cream-50 h-16 px-4 flex items-center justify-between border-b border-forest-900 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-forest-900 hover:bg-forest-850 text-cream-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-forest-700 bg-white shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase text-cream-50">
              Admin Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-forest-900 text-xs text-cream-200"
            title="Open Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-rose-950/80 text-rose-200 text-xs"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-forest-950/70 backdrop-blur-xs z-50 md:hidden animate-fade-in"
        />
      )}

      {/* SIDEBAR NAVIGATION (Desktop Static + Mobile Slide-over) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-forest-950 text-cream-100 flex flex-col justify-between z-50 border-r border-forest-900 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-forest-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-forest-700 bg-white shrink-0 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wider uppercase text-cream-50 font-sans leading-none">
                FEATHERED HAVEN
              </h2>
              <span className="text-[10px] tracking-widest text-forest-400 font-semibold uppercase block mt-1">
                Admin Suite
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-forest-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-forest-400/80 px-3 py-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                  if (item.id === "spaces" && !activeSpaceEdit && spaces.length > 0) {
                    setActiveSpaceEdit(spaces[0]);
                  }
                  if (item.id === "emails" && !emailSubject) {
                    applyEmailTemplate("received");
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-forest-850 text-cream-50 shadow-sm border border-forest-700/60"
                    : "text-cream-200/80 hover:bg-forest-900/60 hover:text-cream-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-forest-400"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.hasPending && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-forest-700 text-cream-50"
                          : "bg-forest-900 text-cream-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-forest-900/90 space-y-2 bg-forest-950/80">
          {dbStatus && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-forest-900/60 text-[11px] text-cream-200 border border-forest-800">
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    dbStatus.connected
                      ? "bg-emerald-400 animate-pulse"
                      : dbStatus.configured
                      ? "bg-amber-400"
                      : "bg-zinc-500"
                  }`}
                />
                <span className="truncate">
                  {dbStatus.connected ? "Supabase Active" : "In-Memory Store"}
                </span>
              </span>
              {dbStatus.latencyMs !== undefined && (
                <span className="text-[10px] text-emerald-400 font-mono">{dbStatus.latencyMs}ms</span>
              )}
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-forest-900/80 hover:bg-forest-850 text-xs font-semibold text-cream-200 border border-forest-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-forest-400" />
              <span>View Public Site</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-xs font-semibold text-rose-200 border border-rose-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {loading ? (
          <div className="text-center py-24 space-y-3">
            <RefreshCw className="w-8 h-8 text-forest-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-forest-800">Loading sanctuary management data...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="border-b border-cream-300 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans tracking-tight">
                      Sanctuary Overview
                    </h1>
                    <p className="text-xs text-forest-700/80 mt-1">
                      Real-time metrics, recent submissions, and quick operational shortcuts.
                    </p>
                  </div>

                  {/* Database Status Badge */}
                  {dbStatus && (
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        dbStatus.connected
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs"
                          : dbStatus.configured
                          ? "bg-amber-50 text-amber-900 border-amber-300"
                          : "bg-cream-100 text-forest-800 border-cream-300"
                      }`}
                      title={dbStatus.error || dbStatus.provider}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          dbStatus.connected
                            ? "bg-emerald-600 animate-pulse"
                            : dbStatus.configured
                            ? "bg-amber-500"
                            : "bg-zinc-400"
                        }`}
                      />
                      <span>
                        {dbStatus.connected
                          ? `Database: Supabase Live (${dbStatus.latencyMs}ms)`
                          : dbStatus.configured
                          ? "Database: Supabase Connecting..."
                          : "Database: In-Memory (No Supabase Env)"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                  <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                      Total Parrots
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
                      {parrots.length}
                    </h3>
                    <p className="text-[11px] text-forest-600 mt-1">
                      {parrots.filter((p) => p.status === "Available").length} available
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                      Pending Forms
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
                      {applications.filter((a) => a.status === "Pending").length}
                    </h3>
                    <p className="text-[11px] text-amber-700 mt-1">
                      Needs review
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab("emails");
                      setEmailViewMode("inbox");
                    }}
                    className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs cursor-pointer hover:border-forest-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                        Received Inbox
                      </p>
                      {receivedEmails.some((e) => e.status === "Unread") && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
                      {receivedEmails.length}
                    </h3>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      {receivedEmails.filter((e) => e.status === "Unread").length} unread messages
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                      Home Spaces
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
                      {spaces.length}
                    </h3>
                    <p className="text-[11px] text-forest-600 mt-1">
                      Editable slots
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                      Emails Sent
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-forest-900 mt-1">
                      {emails.length}
                    </h3>
                    <p className="text-[11px] text-forest-600 mt-1">
                      Outbound updates
                    </p>
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      resetParrotForm();
                      setIsParrotModalOpen(true);
                    }}
                    className="p-5 rounded-2xl bg-white border border-cream-300 hover:border-forest-700 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-forest-800 text-cream-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-900">Add New Parrot</h4>
                      <p className="text-xs text-forest-700/80 mt-0.5">Upload photo and bio</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("spaces");
                      if (!activeSpaceEdit && spaces.length > 0) {
                        setActiveSpaceEdit(spaces[0]);
                      }
                    }}
                    className="p-5 rounded-2xl bg-white border border-cream-300 hover:border-forest-700 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-900">Update Spaces</h4>
                      <p className="text-xs text-forest-700/80 mt-0.5">Change homepage images</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("emails");
                      applyEmailTemplate("received");
                    }}
                    className="p-5 rounded-2xl bg-white border border-cream-300 hover:border-forest-700 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-forest-600 text-cream-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-900">Compose Mail</h4>
                      <p className="text-xs text-forest-700/80 mt-0.5">Email an applicant</p>
                    </div>
                  </button>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-2xl border border-cream-300 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                    <h3 className="text-base font-bold text-forest-900">
                      Recent Adoption Submissions
                    </h3>
                    <button
                      onClick={() => setActiveTab("submissions")}
                      className="text-xs font-bold text-forest-700 hover:text-forest-900 underline"
                    >
                      View all ({applications.length})
                    </button>
                  </div>

                  <div className="divide-y divide-cream-200">
                    {applications.slice(0, 4).map((app) => (
                      <div
                        key={app.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-forest-900">
                              {app.applicantName}
                            </span>
                            <span className="text-[11px] font-mono text-forest-600">
                              ({app.id})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                app.status === "Pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : app.status === "Approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-cream-200 text-forest-800"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-forest-700/80 mt-0.5">
                            {app.email} • Seeking: {app.parrotName || "Any bird"}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPdfPreview({
                                url: app.submittedFormDataUrl || "/adoption-form.pdf",
                                fileName: app.submittedFormFileName || "Application_Form.pdf",
                                applicantName: app.applicantName,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-sage-200 hover:bg-sage-300 text-xs font-bold text-forest-900 cursor-pointer flex items-center gap-1"
                            title="View Attached PDF"
                          >
                            <FileText className="w-3 h-3 text-forest-700" />
                            <span>PDF</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setAppAdminNotes(app.adminNotes || "");
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-xs font-bold text-forest-850 cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => handleOpenEmailForApplicant(app)}
                            className="px-3 py-1.5 rounded-lg bg-forest-850 hover:bg-forest-900 text-cream-50 text-xs font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PARROTS */}
            {activeTab === "parrots" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans tracking-tight">
                      Parrot Directory
                    </h1>
                    <p className="text-xs text-forest-700/80 mt-1">
                      Manage rescued birds, update photos, health status, and adoption availability.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      resetParrotForm();
                      setIsParrotModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-850 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 cursor-pointer shadow-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Parrot</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {parrots.map((parrot) => (
                    <div
                      key={parrot.id}
                      className="bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-cream-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={parrot.imageUrl}
                            alt={parrot.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-forest-950/80 text-cream-50 text-[10px] font-bold">
                              {parrot.species}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                parrot.status === "Available"
                                  ? "bg-emerald-600 text-white"
                                  : parrot.status === "Pending"
                                  ? "bg-amber-600 text-white"
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              {parrot.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <h4 className="text-lg font-bold text-forest-900 font-sans">
                              {parrot.name}
                            </h4>
                            <span className="text-xs text-forest-700">
                              {parrot.age} • {parrot.gender}
                            </span>
                          </div>

                          <p className="text-xs text-forest-800/80 line-clamp-2 leading-relaxed">
                            {parrot.description}
                          </p>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {parrot.personality.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-cream-100 text-forest-800 px-1.5 py-0.5 rounded font-medium"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 border-t border-cream-200 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleEditParrot(parrot)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cream-100 hover:bg-cream-200 text-forest-900 text-xs font-bold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteParrot(parrot.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: HOMEPAGE SPACES */}
            {activeTab === "spaces" && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-cream-300 pb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans tracking-tight">
                    Homepage Image Spaces
                  </h1>
                  <p className="text-xs text-forest-700/80 mt-1">
                    Directly swap the featured hero photos and sanctuary gallery slots displayed on the homepage.
                  </p>
                </div>

                {spaceSaveFeedback && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{spaceSaveFeedback}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Space Selector */}
                  <div className="lg:col-span-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Choose Space to Edit
                    </h4>
                    {spaces.map((space) => (
                      <button
                        key={space.id}
                        onClick={() => setActiveSpaceEdit(space)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          activeSpaceEdit?.slotKey === space.slotKey
                            ? "bg-forest-850 text-cream-50 border-forest-850 shadow-sm"
                            : "bg-white text-forest-900 border-cream-300 hover:bg-cream-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono font-semibold uppercase opacity-75">
                            {space.slotKey}
                          </div>
                          <div className="text-xs font-bold truncate">
                            {space.title}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-300 shrink-0 border border-cream-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={space.imageUrl}
                            alt={space.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Space Editor Card */}
                  {activeSpaceEdit && (
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-cream-300 p-5 sm:p-7 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-cream-100 px-2.5 py-1 rounded-md">
                          Slot: {activeSpaceEdit.slotKey}
                        </span>
                        <span className="text-xs text-forest-700/60 font-mono">
                          ID: {activeSpaceEdit.id}
                        </span>
                      </div>

                      <form onSubmit={handleSaveSpace} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1.5">
                            Image Preview
                          </label>
                          <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-cream-200 border-2 border-dashed border-cream-300 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={activeSpaceEdit.imageUrl}
                              alt={activeSpaceEdit.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => spaceFileInputRef.current?.click()}
                                className="px-4 py-2 rounded-full bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Image</span>
                              </button>
                            </div>
                          </div>

                          <input
                            ref={spaceFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleSpaceImageUpload}
                            className="hidden"
                          />

                          <div className="mt-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => spaceFileInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-900 cursor-pointer"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span>Select local image file</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1">
                            Or Image URL
                          </label>
                          <input
                            type="text"
                            value={activeSpaceEdit.imageUrl}
                            onChange={(e) =>
                              setActiveSpaceEdit({ ...activeSpaceEdit, imageUrl: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 font-mono focus:outline-none focus:ring-2 focus:ring-forest-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1">
                            Title / Headline
                          </label>
                          <input
                            type="text"
                            required
                            value={activeSpaceEdit.title}
                            onChange={(e) =>
                              setActiveSpaceEdit({ ...activeSpaceEdit, title: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs sm:text-sm font-bold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1">
                            Subtitle / Description
                          </label>
                          <textarea
                            rows={3}
                            value={activeSpaceEdit.subtitle}
                            onChange={(e) =>
                              setActiveSpaceEdit({ ...activeSpaceEdit, subtitle: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                          />
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-850 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 cursor-pointer shadow-xs"
                          >
                            <Check className="w-4 h-4" />
                            <span>Save to Homepage</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: ADOPTION SUBMISSIONS */}
            {activeTab === "submissions" && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-cream-300 pb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans tracking-tight">
                    Submitted Adoption Forms
                  </h1>
                  <p className="text-xs text-forest-700/80 mt-1">
                    Review filled applications, download attached forms, and follow up directly with applicants.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream-100 text-forest-900 font-bold uppercase tracking-wider border-b border-cream-300">
                        <tr>
                          <th className="py-3 px-4">Ref</th>
                          <th className="py-3 px-4">Applicant</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Form</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-200">
                        {applications.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-forest-700/60">
                              No applications received yet.
                            </td>
                          </tr>
                        ) : (
                          applications.map((app) => (
                            <tr key={app.id} className="hover:bg-cream-50 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-forest-900">
                                {app.id}
                              </td>
                              <td className="py-3 px-4 font-bold text-forest-950">
                                {app.applicantName}
                              </td>
                              <td className="py-3 px-4 text-forest-800">
                                <div>{app.email}</div>
                                <div className="text-[11px] text-forest-600">{app.phone}</div>
                              </td>
                              <td className="py-3 px-4 text-forest-700">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPdfPreview({
                                      url: app.submittedFormDataUrl || "/adoption-form.pdf",
                                      fileName: app.submittedFormFileName || "Application_Form.pdf",
                                      applicantName: app.applicantName,
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-sage-100 hover:bg-sage-200 text-forest-900 border border-sage-300 px-2.5 py-1 rounded-lg cursor-pointer transition-colors max-w-[160px] truncate"
                                  title="Click to view attached PDF"
                                >
                                  <FileText className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                                  <span className="truncate">
                                    {app.submittedFormFileName || "Form.pdf"}
                                  </span>
                                </button>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    app.status === "Pending"
                                      ? "bg-amber-100 text-amber-800"
                                      : app.status === "In Review"
                                      ? "bg-blue-100 text-blue-800"
                                      : app.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {app.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPdfPreview({
                                      url: app.submittedFormDataUrl || "/adoption-form.pdf",
                                      fileName: app.submittedFormFileName || "Application_Form.pdf",
                                      applicantName: app.applicantName,
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sage-200 hover:bg-sage-300 text-forest-900 font-bold cursor-pointer"
                                  title="View Attached PDF Form"
                                >
                                  <Eye className="w-3 h-3 text-forest-700" />
                                  <span>View PDF</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setAppAdminNotes(app.adminNotes || "");
                                  }}
                                  className="px-2.5 py-1 rounded bg-cream-100 hover:bg-cream-200 text-forest-900 font-bold cursor-pointer"
                                >
                                  Inspect
                                </button>
                                <button
                                  onClick={() => handleOpenEmailForApplicant(app)}
                                  className="px-2.5 py-1 rounded bg-forest-850 hover:bg-forest-900 text-cream-50 font-bold cursor-pointer"
                                >
                                  Email
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: INBOX & EMAILS */}
            {activeTab === "emails" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header & Sub-Navigation */}
                <div className="border-b border-cream-300 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-sans tracking-tight">
                      Inbox & Email Center
                    </h1>
                    <p className="text-xs text-forest-700/80 mt-1">
                      Manage incoming inquiries, compose template updates, and review sent delivery logs.
                    </p>
                  </div>

                  {/* Sub-view switcher */}
                  <div className="inline-flex p-1 bg-cream-200/80 rounded-2xl border border-cream-300 shrink-0">
                    <button
                      onClick={() => setEmailViewMode("inbox")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        emailViewMode === "inbox"
                          ? "bg-forest-850 text-cream-50 shadow-xs"
                          : "text-forest-800 hover:text-forest-950"
                      }`}
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Received Inbox</span>
                      {receivedEmails.filter((e) => e.status === "Unread").length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                          {receivedEmails.filter((e) => e.status === "Unread").length}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setEmailViewMode("compose")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        emailViewMode === "compose"
                          ? "bg-forest-850 text-cream-50 shadow-xs"
                          : "text-forest-800 hover:text-forest-950"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Compose Email</span>
                    </button>

                    <button
                      onClick={() => setEmailViewMode("sent")}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        emailViewMode === "sent"
                          ? "bg-forest-850 text-cream-50 shadow-xs"
                          : "text-forest-800 hover:text-forest-950"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Sent History ({emails.length})</span>
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW 1: RECEIVED INBOX */}
                {emailViewMode === "inbox" && (
                  <div className="space-y-4">
                    {/* Controls & Filter Bar */}
                    <div className="bg-white rounded-2xl border border-cream-300 p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <Search className="w-4 h-4 text-forest-600/60 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inboxSearch}
                            onChange={(e) => setInboxSearch(e.target.value)}
                            placeholder="Search sender, subject, message..."
                            className="pl-9 pr-4 py-1.5 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 w-64"
                          />
                        </div>

                        {/* Filter buttons */}
                        <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-xl border border-cream-200">
                          <button
                            onClick={() => setInboxFilter("all")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              inboxFilter === "all"
                                ? "bg-white text-forest-900 shadow-xs"
                                : "text-forest-700 hover:text-forest-900"
                            }`}
                          >
                            All ({receivedEmails.length})
                          </button>
                          <button
                            onClick={() => setInboxFilter("unread")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              inboxFilter === "unread"
                                ? "bg-white text-forest-900 shadow-xs"
                                : "text-forest-700 hover:text-forest-900"
                            }`}
                          >
                            Unread ({receivedEmails.filter((e) => e.status === "Unread").length})
                          </button>
                          <button
                            onClick={() => setInboxFilter("replied")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              inboxFilter === "replied"
                                ? "bg-white text-forest-900 shadow-xs"
                                : "text-forest-700 hover:text-forest-900"
                            }`}
                          >
                            Replied ({receivedEmails.filter((e) => e.status === "Replied").length})
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            const res = await fetch("/api/admin/received-emails");
                            if (res.ok) setReceivedEmails(await res.json());
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-semibold border border-cream-300 transition-colors cursor-pointer"
                          title="Refresh Inbox"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>

                    {/* Received Emails List */}
                    <div className="bg-white rounded-2xl border border-cream-300 shadow-xs overflow-hidden">
                      {(() => {
                        const filtered = receivedEmails
                          .filter((e) => {
                            if (inboxFilter === "unread") return e.status === "Unread";
                            if (inboxFilter === "replied") return e.status === "Replied";
                            return true;
                          })
                          .filter((e) => {
                            if (!inboxSearch.trim()) return true;
                            const q = inboxSearch.toLowerCase();
                            return (
                              e.fromName?.toLowerCase().includes(q) ||
                              e.fromEmail.toLowerCase().includes(q) ||
                              e.subject.toLowerCase().includes(q) ||
                              e.message.toLowerCase().includes(q)
                            );
                          });

                        if (filtered.length === 0) {
                          return (
                            <div className="p-12 text-center space-y-3">
                              <Inbox className="w-12 h-12 text-forest-300 mx-auto" />
                              <h3 className="text-sm font-bold text-forest-900">No messages in inbox</h3>
                              <p className="text-xs text-forest-700/70 max-w-sm mx-auto">
                                No messages match your current filter. Incoming messages from website visitors and email inquiries will appear here automatically.
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="divide-y divide-cream-200">
                            {filtered.map((item) => {
                              const isUnread = item.status === "Unread";
                              const isReplied = item.status === "Replied";

                              return (
                                <div
                                  key={item.id}
                                  className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                                    isUnread
                                      ? "bg-emerald-50/40 hover:bg-emerald-50/80 border-l-4 border-l-emerald-600"
                                      : "hover:bg-cream-50"
                                  }`}
                                >
                                  {/* Left: Sender & Subject */}
                                  <div
                                    onClick={() => {
                                      setSelectedReceivedEmail(item);
                                      if (isUnread) handleMarkEmailStatus(item.id, "Read");
                                    }}
                                    className="flex items-start gap-3.5 cursor-pointer flex-1 min-w-0"
                                  >
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                        isUnread
                                          ? "bg-emerald-600 text-white shadow-xs"
                                          : isReplied
                                          ? "bg-sky-100 text-sky-800"
                                          : "bg-cream-200 text-forest-800"
                                      }`}
                                    >
                                      {item.fromName
                                        ? item.fromName.substring(0, 2).toUpperCase()
                                        : item.fromEmail.substring(0, 2).toUpperCase()}
                                    </div>

                                    <div className="space-y-1 min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span
                                          className={`text-xs ${
                                            isUnread ? "font-black text-forest-950" : "font-bold text-forest-900"
                                          }`}
                                        >
                                          {item.fromName || item.fromEmail}
                                        </span>

                                        <span className="text-[11px] text-forest-600/70 truncate max-w-xs">
                                          &lt;{item.fromEmail}&gt;
                                        </span>

                                        {/* Status Pill */}
                                        {isUnread && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                            <span>Unread</span>
                                          </span>
                                        )}
                                        {isReplied && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                                            <Reply className="w-2.5 h-2.5" />
                                            <span>Replied</span>
                                          </span>
                                        )}
                                        {item.status === "Read" && (
                                          <span className="px-2 py-0.5 rounded-full bg-cream-100 text-forest-700 text-[10px] font-medium border border-cream-200">
                                            Read
                                          </span>
                                        )}

                                        {/* Source pill */}
                                        <span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-semibold">
                                          {item.source}
                                        </span>
                                      </div>

                                      <h4
                                        className={`text-xs truncate ${
                                          isUnread ? "font-extrabold text-forest-950" : "font-semibold text-forest-850"
                                        }`}
                                      >
                                        {item.subject}
                                      </h4>

                                      <p className="text-[11px] text-forest-700/80 line-clamp-1">
                                        {item.message}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Right: Date & Actions */}
                                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-cream-200">
                                    <span className="text-[10px] text-forest-600/80 whitespace-nowrap">
                                      {new Date(item.receivedAt).toLocaleDateString([], {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => {
                                          setSelectedReceivedEmail(item);
                                          if (isUnread) handleMarkEmailStatus(item.id, "Read");
                                        }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-forest-900 text-xs font-semibold border border-cream-300 transition-colors cursor-pointer"
                                        title="Read Email"
                                      >
                                        <Eye className="w-3 h-3 text-forest-700" />
                                        <span>View</span>
                                      </button>

                                      <button
                                        onClick={() => handleReplyToReceivedEmail(item)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest-850 hover:bg-forest-900 text-cream-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                                        title="Reply to Applicant"
                                      >
                                        <Reply className="w-3 h-3" />
                                        <span>Reply</span>
                                      </button>

                                      <button
                                        onClick={() =>
                                          handleMarkEmailStatus(item.id, isUnread ? "Read" : "Unread")
                                        }
                                        className="p-1 rounded-lg hover:bg-cream-200 text-forest-700 transition-colors cursor-pointer"
                                        title={isUnread ? "Mark as Read" : "Mark as Unread"}
                                      >
                                        <CheckCheck className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => handleDeleteReceivedEmail(item.id)}
                                        className="p-1 rounded-lg hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                                        title="Delete Message"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* SUB-VIEW 2: COMPOSE / EMAIL DISPATCHER */}
                {emailViewMode === "compose" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-cream-300 p-5 sm:p-7 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                        <h4 className="text-sm font-bold text-forest-900 flex items-center gap-2">
                          <Send className="w-4 h-4 text-forest-700" />
                          <span>Compose Outbound Message</span>
                        </h4>
                        <span className="text-[11px] text-forest-600 font-medium">
                          Powered by Resend
                        </span>
                      </div>

                      {emailSuccessMsg && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>{emailSuccessMsg}</div>
                        </div>
                      )}

                      {emailErrorMsg && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>{emailErrorMsg}</div>
                        </div>
                      )}

                      <form onSubmit={handleSendEmail} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1">
                            Select Email Template
                          </label>
                          <select
                            value={selectedTemplateId}
                            onChange={(e) => applyEmailTemplate(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
                          >
                            {EMAIL_TEMPLATES.map((tmpl) => (
                              <option key={tmpl.id} value={tmpl.id}>
                                {tmpl.name}
                              </option>
                            ))}
                            <option value="custom">Custom Message (Blank / Custom Reply)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-forest-900 mb-1">
                              Recipient Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={recipientEmail}
                              onChange={(e) => setRecipientEmail(e.target.value)}
                              placeholder="applicant@example.com"
                              className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-forest-900 mb-1">
                              Recipient Name
                            </label>
                            <input
                              type="text"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              placeholder="e.g. Marcus Sterling"
                              className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1">
                            Subject Line *
                          </label>
                          <input
                            type="text"
                            required
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-forest-900 mb-1">
                            Message Body *
                          </label>
                          <textarea
                            rows={8}
                            required
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-cream-300 text-xs text-forest-900 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-forest-600"
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <p className="text-[11px] text-forest-700/60">
                            Dispatched via Resend with sanctuary template.
                          </p>
                          <button
                            type="submit"
                            disabled={isSendingEmail}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-850 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-900 cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSendingEmail ? "Sending..." : "Dispatch Email"}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Quick Tips & Recent Sent preview */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-cream-50 rounded-2xl border border-cream-300 p-5 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
                          <span>Dispatching Tips</span>
                        </h4>
                        <p className="text-xs text-forest-700/80 leading-relaxed">
                          • Emails are branded with Feathered Haven’s official headers and sent from <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-cream-300">adoptions@fhpra.org</code>.
                        </p>
                        <p className="text-xs text-forest-700/80 leading-relaxed">
                          • Replying to an inquiry automatically logs a record in your Sent History.
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900">
                            Recent Sent ({emails.slice(0, 3).length})
                          </h4>
                          <button
                            onClick={() => setEmailViewMode("sent")}
                            className="text-xs text-forest-700 hover:text-forest-950 font-semibold cursor-pointer"
                          >
                            View All &rarr;
                          </button>
                        </div>

                        <div className="space-y-2">
                          {emails.slice(0, 3).map((m) => (
                            <div key={m.id} className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-forest-900 truncate max-w-[130px]">
                                  {m.recipientName || m.recipientEmail}
                                </span>
                                <span className="text-[10px] text-forest-600">
                                  {new Date(m.sentAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-[11px] text-forest-700 truncate">{m.subject}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-VIEW 3: SENT EMAIL HISTORY */}
                {emailViewMode === "sent" && (
                  <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-forest-900">
                          Sent Email History ({emails.length})
                        </h4>
                        <p className="text-xs text-forest-700/70">
                          Complete audit trail of all messages sent from the administrator portal.
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          const res = await fetch("/api/admin/send-email");
                          if (res.ok) setEmails(await res.json());
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-semibold border border-cream-300 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh Logs</span>
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                      {emails.length === 0 ? (
                        <p className="text-xs text-forest-700/60 text-center py-10">
                          No sent emails logged yet.
                        </p>
                      ) : (
                        emails.map((mail) => (
                          <div
                            key={mail.id}
                            className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-1.5 text-xs hover:border-cream-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-forest-900">
                                To: {mail.recipientName ? `${mail.recipientName} (${mail.recipientEmail})` : mail.recipientEmail}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  mail.status === "Delivered" || mail.status === "Sent"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {mail.status}
                              </span>
                            </div>

                            <p className="font-bold text-forest-850">{mail.subject}</p>
                            <p className="text-forest-700/80 text-[11px] whitespace-pre-wrap leading-relaxed bg-white/60 p-2.5 rounded-lg border border-cream-200">
                              {mail.message}
                            </p>
                            <div className="text-[10px] text-forest-600/70 flex justify-between pt-1">
                              <span>Template: {mail.templateUsed || "Custom"}</span>
                              <span>{new Date(mail.sentAt).toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: ADD / EDIT PARROT */}
      {isParrotModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-cream-300 max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-forest-900">
                {editingParrotId ? "Edit Parrot Profile" : "Add New Parrot to Sanctuary"}
              </h3>
              <button
                onClick={() => setIsParrotModalOpen(false)}
                className="text-forest-700 hover:text-forest-900 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParrot} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-900 mb-1">
                    Parrot Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parrotName}
                    onChange={(e) => setParrotName(e.target.value)}
                    placeholder="e.g. Rio"
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">
                    Species *
                  </label>
                  <select
                    value={parrotSpecies}
                    onChange={(e) => setParrotSpecies(e.target.value as ParrotSpecies)}
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="Macaw">Macaw</option>
                    <option value="Cockatoo">Cockatoo</option>
                    <option value="African Grey">African Grey</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Conure">Conure</option>
                    <option value="Cockatiel">Cockatiel</option>
                    <option value="Lovebird">Lovebird</option>
                    <option value="Budgie / Parakeet">Budgie / Parakeet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={parrotAge}
                    onChange={(e) => setParrotAge(e.target.value)}
                    placeholder="e.g. 4 years"
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-900 mb-1">
                    Status
                  </label>
                  <select
                    value={parrotStatus}
                    onChange={(e) => setParrotStatus(e.target.value as AdoptionStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending Application</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Photo (Upload local file or URL)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={parrotImageUrl}
                    onChange={(e) => setParrotImageUrl(e.target.value)}
                    placeholder="/birds/bird-1.jpeg or click Upload"
                    className="flex-1 px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 font-mono focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                  <button
                    type="button"
                    onClick={() => parrotFileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-900 font-bold cursor-pointer"
                  >
                    Upload
                  </button>
                  <input
                    ref={parrotFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleParrotImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Personality Traits (comma separated)
                </label>
                <input
                  type="text"
                  value={parrotPersonality}
                  onChange={(e) => setParrotPersonality(e.target.value)}
                  placeholder="Playful, Vocal, Cuddly"
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-900 mb-1">
                  Description / Story
                </label>
                <textarea
                  rows={3}
                  value={parrotDescription}
                  onChange={(e) => setParrotDescription(e.target.value)}
                  placeholder="Share rescue background, cage requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="pt-3 border-t border-cream-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsParrotModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-cream-200 text-forest-900 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-forest-850 text-cream-50 font-bold uppercase tracking-wider hover:bg-forest-900 cursor-pointer shadow-xs"
                >
                  {editingParrotId ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECT SUBMITTED ADOPTION FORM */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-cream-300 max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-forest-600">
                  Ref: {selectedApp.id}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-forest-900">
                  Application Review
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-forest-700 hover:text-forest-900 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-forest-900">
              <div className="bg-cream-50 p-4 rounded-xl border border-cream-200 space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="font-bold">Applicant:</span> {selectedApp.applicantName}</p>
                  <p><span className="font-bold">Parrot:</span> {selectedApp.parrotName || "Any bird"}</p>
                  <p><span className="font-bold">Email:</span> {selectedApp.email}</p>
                  <p><span className="font-bold">Phone:</span> {selectedApp.phone}</p>
                  <p><span className="font-bold">City/State:</span> {selectedApp.cityState || selectedApp.address || "N/A"}</p>
                  <p><span className="font-bold">Experience:</span> {selectedApp.experienceLevel}</p>
                </div>
                {selectedApp.notes && (
                  <p className="pt-1"><span className="font-bold">Notes:</span> {selectedApp.notes}</p>
                )}
              </div>

              {/* Attached Form Viewer Controls */}
              <div className="bg-sage-100 p-4 rounded-2xl border border-sage-300 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-forest-700 shrink-0" />
                    <span className="font-mono text-xs font-bold text-forest-900 truncate">
                      {selectedApp.submittedFormFileName || "Application_Form.pdf"}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider font-bold text-forest-600 bg-white px-2 py-0.5 rounded border border-sage-300">
                    PDF Document
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setPdfPreview({
                        url: selectedApp.submittedFormDataUrl || "/adoption-form.pdf",
                        fileName: selectedApp.submittedFormFileName || "Application_Form.pdf",
                        applicantName: selectedApp.applicantName,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-850 hover:bg-forest-900 text-cream-50 font-bold text-xs cursor-pointer shadow-xs transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View / Preview PDF</span>
                  </button>

                  <a
                    href={selectedApp.submittedFormDataUrl || "/adoption-form.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 text-forest-900 border border-cream-300 font-bold text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-forest-600" />
                    <span>Open in New Tab</span>
                  </a>

                  <a
                    href={selectedApp.submittedFormDataUrl || "/adoption-form.pdf"}
                    download={selectedApp.submittedFormFileName || "Application_Form.pdf"}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 text-forest-900 border border-cream-300 font-bold text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-forest-600" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="block font-bold">Update Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Pending", "In Review", "Approved", "Rejected"] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateApplicationStatus(selectedApp.id, st, appAdminNotes)}
                      className={`py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                        selectedApp.status === st
                          ? "bg-forest-850 text-cream-50"
                          : "bg-cream-100 hover:bg-cream-200 text-forest-900"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={appAdminNotes}
                  onChange={(e) => setAppAdminNotes(e.target.value)}
                  placeholder="Notes from veterinary check or phone call..."
                  className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-cream-300 text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="pt-3 border-t border-cream-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEmailForApplicant(selectedApp)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-850 text-cream-50 font-bold uppercase tracking-wider hover:bg-forest-900 cursor-pointer text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Applicant</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleUpdateApplicationStatus(selectedApp.id, selectedApp.status, appAdminNotes);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-2 rounded-full bg-cream-200 hover:bg-cream-300 text-forest-900 font-bold cursor-pointer text-[11px]"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 3: INLINE PDF VIEWER & PREVIEW */}
      {pdfPreview && (
        <div className="fixed inset-0 z-50 bg-forest-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-cream-300 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Top Toolbar */}
            <div className="p-3.5 sm:p-4 bg-forest-950 text-cream-100 flex items-center justify-between border-b border-forest-900 shrink-0">
              <div className="flex items-center gap-2.5 truncate max-w-xs sm:max-w-md">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <h3 className="font-bold text-xs sm:text-sm text-cream-50 truncate">
                    {pdfPreview.fileName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-cream-300 truncate">
                    Applicant: <span className="font-semibold text-white">{pdfPreview.applicantName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={pdfPreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-850 text-cream-200 text-xs font-semibold border border-forest-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-forest-300" />
                  <span className="hidden sm:inline">Open in Tab</span>
                </a>

                <a
                  href={pdfPreview.url}
                  download={pdfPreview.fileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-cream-50 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-forest-300" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  onClick={() => setPdfPreview(null)}
                  className="p-1.5 rounded-lg text-cream-300 hover:text-cream-50 hover:bg-forest-900 transition-colors cursor-pointer"
                  title="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Canvas / Iframe */}
            <div className="flex-1 w-full bg-cream-100 relative">
              <iframe
                src={`${pdfPreview.url}#toolbar=1&navpanes=0`}
                title={pdfPreview.fileName}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: RECEIVED EMAIL VIEWER & QUICK REPLY */}
      {selectedReceivedEmail && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-cream-300 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cream-200 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[11px] font-bold">
                    {selectedReceivedEmail.source}
                  </span>
                  {selectedReceivedEmail.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-cream-200 text-forest-700 text-[11px] font-medium">
                      {selectedReceivedEmail.category}
                    </span>
                  )}
                  {selectedReceivedEmail.status === "Unread" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Unread Message</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-cream-100 text-forest-600 text-[11px] font-medium border border-cream-200">
                      Status: {selectedReceivedEmail.status}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-black text-forest-900 tracking-tight mt-1">
                  {selectedReceivedEmail.subject}
                </h3>
              </div>

              <button
                onClick={() => setSelectedReceivedEmail(null)}
                className="p-1 rounded-full text-forest-700 hover:text-forest-950 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Info Card */}
            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest-850 text-cream-50 flex items-center justify-center font-black text-sm shrink-0">
                  {selectedReceivedEmail.fromName
                    ? selectedReceivedEmail.fromName.substring(0, 2).toUpperCase()
                    : selectedReceivedEmail.fromEmail.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-forest-900 text-sm">
                    {selectedReceivedEmail.fromName || "Website Guest"}
                  </p>
                  <p className="text-forest-700 font-mono text-[11px]">
                    {selectedReceivedEmail.fromEmail}
                  </p>
                </div>
              </div>

              <div className="text-forest-600 text-[11px] sm:text-right">
                <p>To: {selectedReceivedEmail.toEmail || "adoptions@fhpra.org"}</p>
                <p className="mt-0.5">{new Date(selectedReceivedEmail.receivedAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Message Content
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-cream-50/60 border border-cream-200 text-xs sm:text-sm text-forest-900 leading-relaxed font-sans whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedReceivedEmail.message}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-cream-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleMarkEmailStatus(
                      selectedReceivedEmail.id,
                      selectedReceivedEmail.status === "Unread" ? "Read" : "Unread"
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-850 font-bold text-xs border border-cream-300 transition-colors cursor-pointer"
                >
                  {selectedReceivedEmail.status === "Unread" ? "Mark as Read" : "Mark as Unread"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReceivedEmail(selectedReceivedEmail.id)}
                  className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceivedEmail(null)}
                  className="px-4 py-2 rounded-full bg-cream-200 hover:bg-cream-300 text-forest-900 font-bold cursor-pointer text-xs"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleReplyToReceivedEmail(selectedReceivedEmail)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-forest-850 text-cream-50 font-bold uppercase tracking-wider hover:bg-forest-900 cursor-pointer text-xs shadow-xs"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
