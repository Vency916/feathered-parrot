export type ParrotSpecies = 
  | "Macaw"
  | "Cockatoo"
  | "African Grey"
  | "Amazon"
  | "Conure"
  | "Cockatiel"
  | "Lovebird"
  | "Budgie / Parakeet"
  | "Other";

export type AdoptionStatus = "Available" | "Pending" | "Adopted";

export interface Parrot {
  id: string;
  name: string;
  species: ParrotSpecies;
  age: string;
  gender: "Male" | "Female" | "Unknown";
  status: AdoptionStatus;
  description: string;
  personality: string[];
  imageUrl: string;
  featuredOnHome: boolean;
  healthStatus?: string;
  diet?: string;
  lifespan?: string;
  createdAt: string;
}

export type ApplicationStatus = "Pending" | "In Review" | "Approved" | "Rejected";

export interface AdoptionApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  parrotId?: string;
  parrotName?: string;
  cityState?: string;
  address?: string;
  experienceLevel: string;
  housingType?: string;
  hasOtherPets?: boolean;
  petDetails?: string;
  notes?: string;
  submittedFormFileName?: string;
  submittedFormDataUrl?: string; // Base64 data URL of the uploaded filled form (PDF / image)
  status: ApplicationStatus;
  adminNotes?: string;
  submittedAt: string;
}

export interface HomepageSlot {
  id: string;
  slotKey: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  updatedAt: string;
}

export interface SentEmailLog {
  id: string;
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  message: string;
  templateUsed?: string;
  sentAt: string;
  status: "Sent" | "Delivered" | "Simulated (No API Key)";
}

export interface ReceivedEmail {
  id: string;
  fromEmail: string;
  fromName?: string;
  toEmail?: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: "Unread" | "Read" | "Replied";
  source: "Contact Form" | "Adoption Inquiry" | "Inbound Email" | "Website Visitor";
  category?: "General" | "Adoption Inquiry" | "Donations" | "Support";
}
