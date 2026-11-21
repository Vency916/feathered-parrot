import { Parrot, AdoptionApplication, HomepageSlot, SentEmailLog, ReceivedEmail } from "./types";
import { supabase } from "./supabaseClient";

// Seed Parrots using the actual uploaded bird photos
const initialParrots: Parrot[] = [
  {
    id: "parrot-1",
    name: "Rio",
    species: "Macaw",
    age: "4 years",
    gender: "Male",
    status: "Available",
    description: "Rio is a vibrant Scarlet & Blue Macaw who loves social interactions, puzzle enrichment, and cracking fresh walnuts.",
    personality: ["Playful", "Vocal", "Affectionate", "Curious"],
    imageUrl: "/birds/bird-1.jpeg",
    featuredOnHome: true,
    healthStatus: "Fully vaccinated, beak & feather certified",
    diet: "Organic pellets, fresh papaya, macadamia nuts",
    lifespan: "50-70 years",
    createdAt: new Date().toISOString(),
  },
  {
    id: "parrot-2",
    name: "Koko",
    species: "African Grey",
    age: "6 years",
    gender: "Female",
    status: "Available",
    description: "Koko is an intelligent African Grey with extensive vocabulary. She mimics whistling tunes and thrives in quiet, observant homes.",
    personality: ["Gentle", "Observant", "Super Smart"],
    imageUrl: "/birds/bird-2.jpeg",
    featuredOnHome: true,
    healthStatus: "Excellent condition, annual avian checkup complete",
    diet: "Harrison's high potency pellets, fresh greens",
    lifespan: "40-60 years",
    createdAt: new Date().toISOString(),
  },
  {
    id: "parrot-3",
    name: "Sunny",
    species: "Conure",
    age: "2 years",
    gender: "Female",
    status: "Available",
    description: "A friendly Sun Conure who loves snuggling into fleece blankets and showing off head-bobbing dance moves.",
    personality: ["Cuddly", "High Energy", "Friendly"],
    imageUrl: "/birds/bird-3.jpeg",
    featuredOnHome: true,
    healthStatus: "Microchipped, healthy plumage",
    diet: "Zupreem fruit blend, sweet potato chips",
    lifespan: "20-30 years",
    createdAt: new Date().toISOString(),
  },
  {
    id: "parrot-4",
    name: "Barnaby",
    species: "Cockatoo",
    age: "5 years",
    gender: "Male",
    status: "Available",
    description: "Barnaby is an Umbrella Cockatoo who thrives on human companionship, head scratches, and musical bells.",
    personality: ["Loving", "Social", "Playful"],
    imageUrl: "/birds/bird-4.jpeg",
    featuredOnHome: true,
    healthStatus: "Annual veterinary health check verified",
    diet: "Sprouted seeds, pellets, fresh greens",
    lifespan: "40-60 years",
    createdAt: new Date().toISOString(),
  },
  {
    id: "parrot-5",
    name: "Mango & Kiwi",
    species: "Lovebird",
    age: "3 years",
    gender: "Unknown",
    status: "Available",
    description: "A bonded pair that must be adopted together. They chatter merrily and groom each other all day long.",
    personality: ["Bonded Pair", "Chirpy", "Active"],
    imageUrl: "/birds/bird-5.jpeg",
    featuredOnHome: false,
    healthStatus: "Vet cleared, dewormed",
    diet: "Millet spray, leafy greens, small pellet mix",
    lifespan: "10-15 years",
    createdAt: new Date().toISOString(),
  },
  {
    id: "parrot-6",
    name: "Charlie",
    species: "Amazon",
    age: "7 years",
    gender: "Male",
    status: "Available",
    description: "Charlie is a cheerful Yellow-headed Amazon who enjoys singing opera melodies and foraging pine nuts.",
    personality: ["Vocal", "Entertaining", "Outgoing"],
    imageUrl: "/birds/bird-6.jpeg",
    featuredOnHome: false,
    healthStatus: "Healthy plumage, microchipped",
    diet: "Vegetable chops, pellets, seasonal berries",
    lifespan: "40-60 years",
    createdAt: new Date().toISOString(),
  },
];

// Seed Homepage Editable Slots with the actual uploaded bird photos
const initialSlots: HomepageSlot[] = [
  {
    id: "slot-1",
    slotKey: "hero_main",
    title: "Every parrot deserves a home that understands.",
    subtitle: "We help parrots move toward caring, prepared homes through a thoughtful adoption process built around each bird's individual needs.",
    imageUrl: "/birds/bird-1.jpeg",
    ctaText: "Explore our approach",
    ctaLink: "#who-we-are",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "slot-2",
    slotKey: "glimpse_1",
    title: "Flight Aviary Social Time",
    subtitle: "Sanctuary flight space and fresh foraging baskets.",
    imageUrl: "/birds/bird-2.jpeg",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "slot-3",
    slotKey: "glimpse_2",
    title: "Rehabilitation & Enrichment",
    subtitle: "Bonding time and trust-building exercises.",
    imageUrl: "/birds/bird-3.jpeg",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "slot-4",
    slotKey: "glimpse_3",
    title: "Community & Lifelong Care",
    subtitle: "Prepared households sharing life with companion birds.",
    imageUrl: "/birds/bird-4.jpeg",
    updatedAt: new Date().toISOString(),
  },
];

// Seed Applications
const initialApplications: AdoptionApplication[] = [
  {
    id: "APP-1001",
    applicantName: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    phone: "(555) 234-5678",
    cityState: "Portland, OR",
    parrotName: "Rio (Macaw)",
    experienceLevel: "5+ Years experienced aviculturist",
    notes: "Have built a dedicated 12x10ft sunroom aviary with full spectrum UV lighting.",
    submittedFormFileName: "Adoption_Application_Eleanor_Vance.pdf",
    submittedFormDataUrl: "/adoption-form.pdf",
    status: "Pending",
    adminNotes: "Strong candidate, verified avian experience.",
    submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "APP-1002",
    applicantName: "Marcus Sterling",
    email: "marcus.sterling@example.com",
    phone: "(555) 876-5432",
    cityState: "Seattle, WA",
    parrotName: "Koko (African Grey)",
    experienceLevel: "1-5 Years prior bird experience",
    notes: "Work from home full time as an architect. Able to provide 5+ hours daily interactive time.",
    submittedFormFileName: "Marcus_Sterling_Application.pdf",
    submittedFormDataUrl: "/adoption-form.pdf",
    status: "In Review",
    adminNotes: "Sent introductory review email.",
    submittedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
];

// Seed Sent Emails
const initialEmails: SentEmailLog[] = [];

// Seed Received Emails
const initialReceivedEmails: ReceivedEmail[] = [];

// Global in-memory storage for serverless runtime resilience
declare global {
  // eslint-disable-next-line no-var
  var __parrotDataStore: {
    parrots: Parrot[];
    slots: HomepageSlot[];
    applications: AdoptionApplication[];
    emails: SentEmailLog[];
    receivedEmails: ReceivedEmail[];
  } | undefined;
}

if (!globalThis.__parrotDataStore) {
  globalThis.__parrotDataStore = {
    parrots: [...initialParrots],
    slots: [...initialSlots],
    applications: [...initialApplications],
    emails: [],
    receivedEmails: [],
  };
} else {
  // Update slots and parrots with the real bird images if still on old placeholders
  globalThis.__parrotDataStore.parrots = [...initialParrots];
  globalThis.__parrotDataStore.slots = [...initialSlots];
  globalThis.__parrotDataStore.applications = [...initialApplications];
  globalThis.__parrotDataStore.emails = [];
  globalThis.__parrotDataStore.receivedEmails = [];
}

export const dataStore = globalThis.__parrotDataStore;

// ==========================================
// PARROTS DATA HELPERS
// ==========================================
export async function getParrots(): Promise<Parrot[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("parrots")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          species: d.species,
          age: d.age || "",
          gender: d.gender || "Unknown",
          status: d.status || "Available",
          description: d.description || "",
          personality: d.personality || [],
          imageUrl: d.image_url || "/birds/bird-1.jpeg",
          featuredOnHome: Boolean(d.featured_on_home),
          healthStatus: d.health_status,
          diet: d.diet,
          lifespan: d.lifespan,
          createdAt: d.created_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getParrots fallback:", err);
    }
  }
  return dataStore.parrots;
}

export async function getParrotById(id: string): Promise<Parrot | undefined> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("parrots").select("*").eq("id", id).single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          species: data.species,
          age: data.age || "",
          gender: data.gender || "Unknown",
          status: data.status || "Available",
          description: data.description || "",
          personality: data.personality || [],
          imageUrl: data.image_url || "/birds/bird-1.jpeg",
          featuredOnHome: Boolean(data.featured_on_home),
          healthStatus: data.health_status,
          diet: data.diet,
          lifespan: data.lifespan,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn("Supabase getParrotById fallback:", err);
    }
  }
  return dataStore.parrots.find((p) => p.id === id);
}

export async function addParrot(parrot: Omit<Parrot, "id" | "createdAt">): Promise<Parrot> {
  const newId = `parrot-${Date.now()}`;
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("parrots")
        .insert({
          id: newId,
          name: parrot.name,
          species: parrot.species,
          age: parrot.age,
          gender: parrot.gender,
          status: parrot.status,
          description: parrot.description,
          personality: parrot.personality,
          image_url: parrot.imageUrl,
          featured_on_home: parrot.featuredOnHome,
          health_status: parrot.healthStatus,
          diet: parrot.diet,
          lifespan: parrot.lifespan,
          created_at: now,
        })
        .select()
        .single();

      if (!error && data) {
        const created: Parrot = {
          ...parrot,
          id: data.id,
          createdAt: data.created_at,
        };
        dataStore.parrots.unshift(created);
        return created;
      }
    } catch (err) {
      console.warn("Supabase addParrot fallback:", err);
    }
  }

  const newParrot: Parrot = {
    ...parrot,
    id: newId,
    createdAt: now,
  };
  dataStore.parrots.unshift(newParrot);
  return newParrot;
}

export async function updateParrot(id: string, updates: Partial<Parrot>): Promise<Parrot | null> {
  if (supabase) {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.species !== undefined) dbUpdates.species = updates.species;
      if (updates.age !== undefined) dbUpdates.age = updates.age;
      if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.personality !== undefined) dbUpdates.personality = updates.personality;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
      if (updates.featuredOnHome !== undefined) dbUpdates.featured_on_home = updates.featuredOnHome;
      if (updates.healthStatus !== undefined) dbUpdates.health_status = updates.healthStatus;
      if (updates.diet !== undefined) dbUpdates.diet = updates.diet;
      if (updates.lifespan !== undefined) dbUpdates.lifespan = updates.lifespan;

      const { data, error } = await supabase
        .from("parrots")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated: Parrot = {
          id: data.id,
          name: data.name,
          species: data.species,
          age: data.age || "",
          gender: data.gender || "Unknown",
          status: data.status || "Available",
          description: data.description || "",
          personality: data.personality || [],
          imageUrl: data.image_url || "/birds/bird-1.jpeg",
          featuredOnHome: Boolean(data.featured_on_home),
          healthStatus: data.health_status,
          diet: data.diet,
          lifespan: data.lifespan,
          createdAt: data.created_at,
        };
        const idx = dataStore.parrots.findIndex((p) => p.id === id);
        if (idx !== -1) dataStore.parrots[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.warn("Supabase updateParrot fallback:", err);
    }
  }

  const index = dataStore.parrots.findIndex((p) => p.id === id);
  if (index === -1) return null;
  dataStore.parrots[index] = { ...dataStore.parrots[index], ...updates };
  return dataStore.parrots[index];
}

export async function deleteParrot(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from("parrots").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteParrot fallback:", err);
    }
  }
  const index = dataStore.parrots.findIndex((p) => p.id === id);
  if (index === -1) return false;
  dataStore.parrots.splice(index, 1);
  return true;
}

// ==========================================
// HOMEPAGE SLOTS HELPERS
// ==========================================
export async function getHomepageSlots(): Promise<HomepageSlot[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("homepage_slots")
        .select("*")
        .order("slot_key", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          slotKey: d.slot_key,
          title: d.title || "",
          subtitle: d.subtitle || "",
          imageUrl: d.image_url || "/birds/bird-1.jpeg",
          ctaText: d.cta_text,
          ctaLink: d.cta_link,
          updatedAt: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getHomepageSlots fallback:", err);
    }
  }
  return dataStore.slots;
}

export async function updateHomepageSlot(
  slotKey: string,
  updates: Partial<Omit<HomepageSlot, "id" | "slotKey">>
): Promise<HomepageSlot | null> {
  if (supabase) {
    try {
      const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
      if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
      if (updates.ctaText !== undefined) dbUpdates.cta_text = updates.ctaText;
      if (updates.ctaLink !== undefined) dbUpdates.cta_link = updates.ctaLink;

      const { data, error } = await supabase
        .from("homepage_slots")
        .update(dbUpdates)
        .eq("slot_key", slotKey)
        .select()
        .single();

      if (!error && data) {
        const updated: HomepageSlot = {
          id: data.id,
          slotKey: data.slot_key,
          title: data.title || "",
          subtitle: data.subtitle || "",
          imageUrl: data.image_url || "/birds/bird-1.jpeg",
          ctaText: data.cta_text,
          ctaLink: data.cta_link,
          updatedAt: data.updated_at,
        };
        const idx = dataStore.slots.findIndex((s) => s.slotKey === slotKey);
        if (idx !== -1) dataStore.slots[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.warn("Supabase updateHomepageSlot fallback:", err);
    }
  }

  const slot = dataStore.slots.find((s) => s.slotKey === slotKey);
  if (!slot) return null;
  Object.assign(slot, updates, { updatedAt: new Date().toISOString() });
  return slot;
}

// ==========================================
// ADOPTION APPLICATIONS HELPERS
// ==========================================
export async function getApplications(): Promise<AdoptionApplication[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          applicantName: d.applicant_name,
          email: d.email,
          phone: d.phone || "",
          parrotId: d.parrot_id,
          parrotName: d.parrot_name,
          cityState: d.city_state,
          address: d.address,
          experienceLevel: d.experience_level || "",
          housingType: d.housing_type,
          hasOtherPets: d.has_other_pets,
          petDetails: d.pet_details,
          notes: d.notes,
          submittedFormFileName: d.submitted_form_file_name,
          submittedFormDataUrl: d.submitted_form_data_url,
          status: d.status || "Pending",
          adminNotes: d.admin_notes,
          submittedAt: d.submitted_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getApplications fallback:", err);
    }
  }
  return dataStore.applications;
}

export async function getApplicationById(id: string): Promise<AdoptionApplication | undefined> {
  const apps = await getApplications();
  return apps.find((a) => a.id === id);
}

export async function submitApplication(
  data: Omit<AdoptionApplication, "id" | "submittedAt" | "status">
): Promise<AdoptionApplication> {
  const newId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from("applications")
        .insert({
          id: newId,
          applicant_name: data.applicantName,
          email: data.email,
          phone: data.phone,
          parrot_id: data.parrotId,
          parrot_name: data.parrotName,
          city_state: data.cityState,
          address: data.address,
          experience_level: data.experienceLevel,
          housing_type: data.housingType,
          has_other_pets: data.hasOtherPets,
          pet_details: data.petDetails,
          notes: data.notes,
          submitted_form_file_name: data.submittedFormFileName,
          submitted_form_data_url: data.submittedFormDataUrl,
          status: "Pending",
          submitted_at: now,
        })
        .select()
        .single();

      if (!error && dbData) {
        const app: AdoptionApplication = {
          ...data,
          id: dbData.id,
          status: "Pending",
          submittedAt: dbData.submitted_at,
        };
        dataStore.applications.unshift(app);
        return app;
      }
    } catch (err) {
      console.warn("Supabase submitApplication fallback:", err);
    }
  }

  const newApp: AdoptionApplication = {
    ...data,
    id: newId,
    status: "Pending",
    submittedAt: now,
  };
  dataStore.applications.unshift(newApp);
  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: AdoptionApplication["status"],
  adminNotes?: string
): Promise<AdoptionApplication | null> {
  if (supabase) {
    try {
      const dbUpdates: Record<string, unknown> = { status };
      if (adminNotes !== undefined) dbUpdates.admin_notes = adminNotes;

      const { data, error } = await supabase
        .from("applications")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated: AdoptionApplication = {
          id: data.id,
          applicantName: data.applicant_name,
          email: data.email,
          phone: data.phone || "",
          parrotId: data.parrot_id,
          parrotName: data.parrot_name,
          cityState: data.city_state,
          address: data.address,
          experienceLevel: data.experience_level || "",
          housingType: data.housing_type,
          hasOtherPets: data.has_other_pets,
          petDetails: data.pet_details,
          notes: data.notes,
          submittedFormFileName: data.submitted_form_file_name,
          submittedFormDataUrl: data.submitted_form_data_url,
          status: data.status,
          adminNotes: data.admin_notes,
          submittedAt: data.submitted_at,
        };
        const idx = dataStore.applications.findIndex((a) => a.id === id);
        if (idx !== -1) dataStore.applications[idx] = updated;
        return updated;
      }
    } catch (err) {
      console.warn("Supabase updateApplicationStatus fallback:", err);
    }
  }

  const app = dataStore.applications.find((a) => a.id === id);
  if (!app) return null;
  app.status = status;
  if (adminNotes !== undefined) {
    app.adminNotes = adminNotes;
  }
  return app;
}

// ==========================================
// SENT EMAILS HELPERS
// ==========================================
export async function getSentEmails(): Promise<SentEmailLog[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("sent_emails")
        .select("*")
        .order("sent_at", { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          recipientEmail: d.recipient_email,
          recipientName: d.recipient_name,
          subject: d.subject,
          message: d.message,
          templateUsed: d.template_used,
          status: d.status,
          sentAt: d.sent_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getSentEmails fallback:", err);
    }
  }
  return dataStore.emails;
}

export async function logSentEmail(email: Omit<SentEmailLog, "id" | "sentAt">): Promise<SentEmailLog> {
  const newId = `mail-${Date.now()}`;
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("sent_emails")
        .insert({
          id: newId,
          recipient_email: email.recipientEmail,
          recipient_name: email.recipientName,
          subject: email.subject,
          message: email.message,
          template_used: email.templateUsed,
          status: email.status,
          sent_at: now,
        })
        .select()
        .single();

      if (!error && data) {
        const record: SentEmailLog = {
          ...email,
          id: data.id,
          sentAt: data.sent_at,
        };
        dataStore.emails.unshift(record);
        return record;
      }
    } catch (err) {
      console.warn("Supabase logSentEmail fallback:", err);
    }
  }

  const record: SentEmailLog = {
    ...email,
    id: newId,
    sentAt: now,
  };
  dataStore.emails.unshift(record);
  return record;
}

// ==========================================
// RECEIVED EMAILS HELPERS
// ==========================================
export async function getReceivedEmails(): Promise<ReceivedEmail[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("received_emails")
        .select("*")
        .order("received_at", { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          fromEmail: d.from_email,
          fromName: d.from_name,
          toEmail: d.to_email,
          subject: d.subject,
          message: d.message,
          status: d.status,
          source: d.source,
          category: d.category,
          receivedAt: d.received_at,
        }));
      }
    } catch (err) {
      console.warn("Supabase getReceivedEmails fallback:", err);
    }
  }

  if (!dataStore.receivedEmails) {
    dataStore.receivedEmails = [];
  }
  return dataStore.receivedEmails;
}

export async function logReceivedEmail(
  email: Omit<ReceivedEmail, "id" | "receivedAt">
): Promise<ReceivedEmail> {
  const newId = `inbox-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("received_emails")
        .insert({
          id: newId,
          from_email: email.fromEmail,
          from_name: email.fromName,
          to_email: email.toEmail || "adoptions@fhpra.org",
          subject: email.subject,
          message: email.message,
          status: email.status || "Unread",
          source: email.source || "Contact Form",
          category: email.category || "General",
          received_at: now,
        })
        .select()
        .single();

      if (!error && data) {
        const record: ReceivedEmail = {
          ...email,
          id: data.id,
          receivedAt: data.received_at,
        };
        if (!dataStore.receivedEmails) dataStore.receivedEmails = [];
        dataStore.receivedEmails.unshift(record);
        return record;
      }
    } catch (err) {
      console.warn("Supabase logReceivedEmail fallback:", err);
    }
  }

  if (!dataStore.receivedEmails) {
    dataStore.receivedEmails = [];
  }
  const record: ReceivedEmail = {
    ...email,
    id: newId,
    receivedAt: now,
  };
  dataStore.receivedEmails.unshift(record);
  return record;
}

export async function updateReceivedEmailStatus(
  id: string,
  status: ReceivedEmail["status"]
): Promise<ReceivedEmail | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("received_emails")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        const updated: ReceivedEmail = {
          id: data.id,
          fromEmail: data.from_email,
          fromName: data.from_name,
          toEmail: data.to_email,
          subject: data.subject,
          message: data.message,
          status: data.status,
          source: data.source,
          category: data.category,
          receivedAt: data.received_at,
        };
        if (dataStore.receivedEmails) {
          const idx = dataStore.receivedEmails.findIndex((e) => e.id === id);
          if (idx !== -1) dataStore.receivedEmails[idx] = updated;
        }
        return updated;
      }
    } catch (err) {
      console.warn("Supabase updateReceivedEmailStatus fallback:", err);
    }
  }

  if (!dataStore.receivedEmails) return null;
  const email = dataStore.receivedEmails.find((e) => e.id === id);
  if (!email) return null;
  email.status = status;
  return email;
}

export async function deleteReceivedEmail(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from("received_emails").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteReceivedEmail fallback:", err);
    }
  }

  if (!dataStore.receivedEmails) return false;
  const index = dataStore.receivedEmails.findIndex((e) => e.id === id);
  if (index === -1) return false;
  dataStore.receivedEmails.splice(index, 1);
  return true;
}
