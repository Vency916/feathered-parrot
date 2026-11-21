export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: (name?: string, parrot?: string) => string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "received",
    name: "Application Received & Under Review",
    subject: "Feathered Haven: We Received Your Adoption Application!",
    body: (name?: string, parrot?: string) => `Dear ${name || "Applicant"},

Thank you for your interest in adopting from Feathered Haven Parrot Rescue${parrot ? ` for ${parrot}` : ""}!

We have received your completed adoption form and our avian care committee is currently reviewing your home environment and experience details. 

Next Steps:
1. Committee review (takes 24-48 hours).
2. Avian veterinary check (if applicable).
3. We will invite you for a virtual or in-person sanctuary meet-and-greet.

If you have any questions in the meantime or need to update your application, please reply directly to this email.

Warm regards,
The Feathered Haven Adoption Committee
adoptions@fhpra.org`,
  },
  {
    id: "interview",
    name: "Schedule Meet & Greet / Virtual Home Check",
    subject: "Feathered Haven: Invitation to Schedule Your Adoption Meet & Greet",
    body: (name?: string, parrot?: string) => `Dear ${name || "Applicant"},

Great news! Your preliminary adoption application${parrot ? ` for ${parrot}` : ""} has been pre-approved!

We would love to invite you to schedule a 30-minute Meet & Greet session with our team and the bird. During this session, you'll meet the avian caregiver, discuss dietary and housing preparations, and interact with the parrot.

Please let us know your availability over the upcoming weekend (Saturday or Sunday between 10:00 AM - 4:00 PM), or reply with dates that work best for your schedule.

Looking forward to welcoming you!

Best regards,
Feathered Haven Rescue Team`,
  },
  {
    id: "approved",
    name: "Adoption Approved - Congratulations!",
    subject: "Feathered Haven: Congratulations! Your Parrot Adoption is Approved!",
    body: (name?: string, parrot?: string) => `Dear ${name || "Applicant"},

We are thrilled to inform you that your application to adopt ${parrot || "your companion bird"} has been fully APPROVED!

Our team was deeply impressed with your commitment to high-standard avian care, balanced nutrition, and safe flight space. 

Final Adoption Steps:
1. Finalize adoption agreement & medical records transfer.
2. Schedule adoption handover day at the sanctuary.
3. Receive our starter care package (sample Harrison's pellet pack, foraging toys, and emergency avian vet booklet).

Please reply to this email to coordinate your bird's homecoming date!

Congratulations and welcome to the flock!

Warmly,
The Feathered Haven Sanctuary Flock`,
  },
  {
    id: "clarification",
    name: "Home Environment & Aviary Photos Needed",
    subject: "Feathered Haven: Quick Follow-up Regarding Your Adoption Application",
    body: (name?: string, parrot?: string) => `Dear ${name || "Applicant"},

Thank you for submitting your adoption application${parrot ? ` for ${parrot}` : ""}.

Before our veterinary committee finalizes approval, could you kindly provide a few quick photos of your intended cage setup, room arrangement (ensuring no ceiling fans or open hazards), and perches?

You can reply directly to this email and attach the photos.

Thank you for your cooperation in ensuring the highest safety standard for our feathered companions!

Sincerely,
Feathered Haven Rescue Team`,
  },
];
