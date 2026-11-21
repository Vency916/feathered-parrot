import { Parrot, AdoptionApplication, HomepageSlot, SentEmailLog, ReceivedEmail } from "./types";

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

// Parrots Data Helpers
export async function getParrots(): Promise<Parrot[]> {
  return dataStore.parrots;
}

export async function getParrotById(id: string): Promise<Parrot | undefined> {
  return dataStore.parrots.find((p) => p.id === id);
}

export async function addParrot(parrot: Omit<Parrot, "id" | "createdAt">): Promise<Parrot> {
  const newParrot: Parrot = {
    ...parrot,
    id: `parrot-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  dataStore.parrots.unshift(newParrot);
  return newParrot;
}

export async function updateParrot(id: string, updates: Partial<Parrot>): Promise<Parrot | null> {
  const index = dataStore.parrots.findIndex((p) => p.id === id);
  if (index === -1) return null;
  dataStore.parrots[index] = { ...dataStore.parrots[index], ...updates };
  return dataStore.parrots[index];
}

export async function deleteParrot(id: string): Promise<boolean> {
  const index = dataStore.parrots.findIndex((p) => p.id === id);
  if (index === -1) return false;
  dataStore.parrots.splice(index, 1);
  return true;
}

// Homepage Slots Helpers
export async function getHomepageSlots(): Promise<HomepageSlot[]> {
  return dataStore.slots;
}

export async function updateHomepageSlot(
  slotKey: string,
  updates: Partial<Omit<HomepageSlot, "id" | "slotKey">>
): Promise<HomepageSlot | null> {
  const slot = dataStore.slots.find((s) => s.slotKey === slotKey);
  if (!slot) return null;
  Object.assign(slot, updates, { updatedAt: new Date().toISOString() });
  return slot;
}

// Applications Helpers
export async function getApplications(): Promise<AdoptionApplication[]> {
  return dataStore.applications;
}

export async function getApplicationById(id: string): Promise<AdoptionApplication | undefined> {
  return dataStore.applications.find((a) => a.id === id);
}

export async function submitApplication(
  data: Omit<AdoptionApplication, "id" | "submittedAt" | "status">
): Promise<AdoptionApplication> {
  const newApp: AdoptionApplication = {
    ...data,
    id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "Pending",
    submittedAt: new Date().toISOString(),
  };
  dataStore.applications.unshift(newApp);
  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: AdoptionApplication["status"],
  adminNotes?: string
): Promise<AdoptionApplication | null> {
  const app = dataStore.applications.find((a) => a.id === id);
  if (!app) return null;
  app.status = status;
  if (adminNotes !== undefined) {
    app.adminNotes = adminNotes;
  }
  return app;
}

// Emails Helpers
export async function getSentEmails(): Promise<SentEmailLog[]> {
  return dataStore.emails;
}

export async function logSentEmail(email: Omit<SentEmailLog, "id" | "sentAt">): Promise<SentEmailLog> {
  const record: SentEmailLog = {
    ...email,
    id: `mail-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
  dataStore.emails.unshift(record);
  return record;
}

// Received Emails Helpers
export async function getReceivedEmails(): Promise<ReceivedEmail[]> {
  if (!dataStore.receivedEmails) {
    dataStore.receivedEmails = [];
  }
  return dataStore.receivedEmails;
}

export async function logReceivedEmail(
  email: Omit<ReceivedEmail, "id" | "receivedAt">
): Promise<ReceivedEmail> {
  if (!dataStore.receivedEmails) {
    dataStore.receivedEmails = [];
  }
  const record: ReceivedEmail = {
    ...email,
    id: `inbox-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    receivedAt: new Date().toISOString(),
  };
  dataStore.receivedEmails.unshift(record);
  return record;
}

export async function updateReceivedEmailStatus(
  id: string,
  status: ReceivedEmail["status"]
): Promise<ReceivedEmail | null> {
  if (!dataStore.receivedEmails) return null;
  const email = dataStore.receivedEmails.find((e) => e.id === id);
  if (!email) return null;
  email.status = status;
  return email;
}

export async function deleteReceivedEmail(id: string): Promise<boolean> {
  if (!dataStore.receivedEmails) return false;
  const index = dataStore.receivedEmails.findIndex((e) => e.id === id);
  if (index === -1) return false;
  dataStore.receivedEmails.splice(index, 1);
  return true;
}
