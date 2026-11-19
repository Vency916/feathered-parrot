# AuraParrot Sanctuary & Adoption Website 🦜

A modern, full-stack **Parrot Adoption Website & Sanctuary Management Suite** built with **Next.js (App Router)**, **Tailwind CSS**, and **TypeScript**, specifically architected for seamless deployment on **Vercel**.

---

## 🌟 Key Highlights & Features

### 1. 🌿 Green & Cream Aesthetic
- Custom palette featuring rich forest greens (`#1B4332`, `#2D6A4F`, `#40916C`), soft foliage tones, and warm, soothing cream surfaces (`#FDFBF7`, `#F7F3E8`).
- Clean, accessible typography and responsive layout for mobile, tablet, and desktop.

### 2. 🖼️ Homepage Image Upload Spaces
- Dedicated slots on the homepage that the admin can customize and upload new images to directly from the Admin Panel:
  - **Space 1: Hero Main Banner** (Spotlight hero image & call-to-actions)
  - **Space 2: Spotlight Feature** (Special rescue highlight)
  - **Space 3: Care Story** (Rehabilitation story & matching guidance)
  - **Space 4: Sanctuary Aviaries** (Flight aviary facilities & community gallery)

### 3. 📄 Complete Guest Adoption Flow
1. **Browse Parrots:** Explore available rescue companions with live filtering by species, age, and personality traits.
2. **Download Official Form:** One-click dynamic PDF generation via `jsPDF` creates an official, printable **AuraParrot Adoption Application Form** with comprehensive sections for housing, experience, veterinary references, and Teflon/PTFE safety agreements.
3. **Submit Filled Form:** Guests upload their completed form (PDF, PNG, JPG, or DOCX) alongside their contact details. The document is converted to a base64 data stream to ensure reliable transmission without ephemeral filesystem issues on serverless lambdas.
4. **Instant Confirmation:** Generates a unique Application Reference Code (e.g. `APP-1002`) and confirmation notice.

### 4. 🛡️ Comprehensive Admin Panel (`/admin`)
- **Protected Access:** Secure login at `/admin/login` with cookie-backed sessions.
- **Overview Dashboard:** Live counters for total parrots, pending applications, active homepage slots, and sent emails.
- **Parrot Management:**
  - Create, edit, and delete parrot listings.
  - Image upload directly from local device or image URL.
  - Set personality tags, species, age, health, and toggle "Homepage Featured" status.
- **Homepage Spaces Manager:**
  - Visual editor with file upload to swap any of the 4 homepage image spaces in real time.
- **Adoption Submissions Inbox:**
  - View all guest applications with status indicators (*Pending, In Review, Approved, Rejected*).
  - Inspect applicant living conditions, pet details, and experience.
  - **One-click download/preview of the guest's uploaded form file**.
  - Add internal private admin notes.
  - Quick action: **"Send Email to Applicant"** opens the email dispatcher with the applicant's email and details pre-filled.
- **Direct Email Dispatcher Suite (Resend Integration):**
  - Compose and dispatch emails directly to applicants or custom recipients from the admin panel.
  - Built-in pre-written templates:
    - *Application Received & Under Review*
    - *Schedule Meet & Greet / Virtual Home Check*
    - *Adoption Approved - Congratulations!*
    - *Home Environment & Aviary Photos Needed*
    - *Custom Message*
  - Automatically records all sent emails in a persistent **Sent Email History** log with delivery timestamps and statuses.
  - Works out of the box in simulated mode when no API key is provided, and sends actual emails when `RESEND_API_KEY` is added.

