-- ========================================================
-- FEATHERED HAVEN SANCTUARY - SUPABASE DATABASE SCHEMA
-- ========================================================

-- 1. PARROTS TABLE
CREATE TABLE IF NOT EXISTS parrots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  age TEXT,
  gender TEXT DEFAULT 'Unknown',
  status TEXT NOT NULL DEFAULT 'Available',
  description TEXT,
  personality TEXT[] DEFAULT '{}',
  image_url TEXT,
  featured_on_home BOOLEAN DEFAULT false,
  health_status TEXT,
  diet TEXT,
  lifespan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. HOMEPAGE SLOTS (CUSTOMIZABLE SPACES)
CREATE TABLE IF NOT EXISTS homepage_slots (
  id TEXT PRIMARY KEY,
  slot_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ADOPTION APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  parrot_id TEXT,
  parrot_name TEXT,
  city_state TEXT,
  address TEXT,
  experience_level TEXT,
  housing_type TEXT,
  has_other_pets BOOLEAN DEFAULT false,
  pet_details TEXT,
  notes TEXT,
  submitted_form_file_name TEXT,
  submitted_form_data_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RECEIVED EMAILS & INQUIRIES INBOX
CREATE TABLE IF NOT EXISTS received_emails (
  id TEXT PRIMARY KEY,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT DEFAULT 'adoptions@fhpra.org',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Unread',
  source TEXT DEFAULT 'Contact Form',
  category TEXT DEFAULT 'General',
  received_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SENT EMAILS HISTORY
CREATE TABLE IF NOT EXISTS sent_emails (
  id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  template_used TEXT,
  status TEXT NOT NULL DEFAULT 'Sent',
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SEED INITIAL PARROTS (IF EMPTY)
INSERT INTO parrots (id, name, species, age, gender, status, description, personality, image_url, featured_on_home, health_status, diet, lifespan)
VALUES 
  ('parrot-1', 'Rio', 'Macaw', '4 years', 'Male', 'Available', 'Rio is a vibrant Scarlet & Blue Macaw who loves social interactions, puzzle enrichment, and cracking fresh walnuts.', ARRAY['Playful', 'Vocal', 'Affectionate', 'Curious'], '/birds/bird-1.jpeg', true, 'Fully vaccinated, beak & feather certified', 'Organic pellets, fresh papaya, macadamia nuts', '50-70 years'),
  ('parrot-2', 'Koko', 'African Grey', '6 years', 'Female', 'Available', 'Koko is an intelligent African Grey with extensive vocabulary. She mimics whistling tunes and thrives in quiet, observant homes.', ARRAY['Gentle', 'Observant', 'Super Smart'], '/birds/bird-2.jpeg', true, 'Excellent condition, annual avian checkup complete', 'Harrison''s high potency pellets, fresh greens', '40-60 years'),
  ('parrot-3', 'Sunny', 'Conure', '2 years', 'Female', 'Available', 'A friendly Sun Conure who loves snuggling into fleece blankets and showing off head-bobbing dance moves.', ARRAY['Cuddly', 'High Energy', 'Friendly'], '/birds/bird-3.jpeg', true, 'Microchipped, healthy plumage', 'Zupreem fruit blend, sweet potato chips', '20-30 years'),
  ('parrot-4', 'Barnaby', 'Cockatoo', '5 years', 'Male', 'Available', 'Barnaby is an Umbrella Cockatoo who thrives on human companionship, head scratches, and musical bells.', ARRAY['Loving', 'Social', 'Playful'], '/birds/bird-4.jpeg', true, 'Annual veterinary health check verified', 'Sprouted seeds, pellets, fresh greens', '40-60 years'),
  ('parrot-5', 'Mango & Kiwi', 'Lovebird', '3 years', 'Unknown', 'Available', 'A bonded pair that must be adopted together. They chatter merrily and groom each other all day long.', ARRAY['Bonded Pair', 'Chirpy', 'Active'], '/birds/bird-5.jpeg', false, 'Vet cleared, dewormed', 'Millet spray, leafy greens, small pellet mix', '10-15 years'),
  ('parrot-6', 'Charlie', 'Amazon', '7 years', 'Male', 'Available', 'Charlie is a cheerful Yellow-headed Amazon who enjoys singing opera melodies and foraging pine nuts.', ARRAY['Vocal', 'Entertaining', 'Outgoing'], '/birds/bird-6.jpeg', false, 'Healthy plumage, microchipped', 'Vegetable chops, pellets, seasonal berries', '40-60 years')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED HOMEPAGE SLOTS (IF EMPTY)
INSERT INTO homepage_slots (id, slot_key, title, subtitle, image_url, cta_text, cta_link)
VALUES
  ('slot-1', 'hero_main', 'Every parrot deserves a home that understands', 'Thoughtful adoption placements built around each bird''s individual needs.', '/birds/bird-1.jpeg', 'Explore our approach', '#approach'),
  ('slot-2', 'glimpse_1', 'Safe Spaces & Social Living', 'Quiet corners, ample space, and gentle human guidance.', '/birds/bird-2.jpeg', NULL, NULL),
  ('slot-3', 'glimpse_2', 'Enrichment & Lifelong Health', 'Nutrition, veterinary oversight, and cognitive toys.', '/birds/bird-3.jpeg', NULL, NULL),
  ('slot-4', 'glimpse_3', 'Community & Lifelong Care', 'Prepared households sharing life with companion birds.', '/birds/bird-4.jpeg', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 8. STORAGE BUCKET FOR UPLOADED APPLICATION PDFS & PHOTOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to attachments bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'attachments');

-- Allow service role full upload access
CREATE POLICY "Service Role Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'attachments');
