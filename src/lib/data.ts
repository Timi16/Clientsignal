export const CASE_TYPES: Record<string, { label: string; color: string; tint: string }> = {
  injury:      { label: "Personal Injury", color: "#DC2626", tint: "var(--coral-tint)" },
  family:      { label: "Family Law",      color: "#7C3AED", tint: "rgba(124,58,237,0.10)" },
  criminal:    { label: "Criminal Defense", color: "#0B1F3A", tint: "rgba(11,31,58,0.08)" },
  immigration: { label: "Immigration",     color: "#2563EB", tint: "var(--blue-tint)" },
  employment:  { label: "Employment",      color: "#16A34A", tint: "var(--verified-tint)" },
  business:    { label: "Business & Contracts", color: "#0891B2", tint: "rgba(8,145,178,0.10)" },
};

export interface Lead {
  id: string; name: string; type: string; quality: number; urgency: number;
  city: string; time: string; summary: string; value: string; phone: string;
  consent: boolean; docs: number; status: string; channel: string;
}

export const LEADS: Lead[] = [
  { id: "LD-4471", name: "Marcus Webb", type: "injury", quality: 92, urgency: 88, city: "Austin, TX", time: "2 min ago", summary: "Rear-ended at a red light on I-35, taken to ER with neck and lower-back pain. Other driver was cited. Has police report and photos.", value: "$18K–45K", phone: "(512) 555-0192", consent: true, docs: 3, status: "new", channel: "Google Ads" },
  { id: "LD-4470", name: "Priya Nair", type: "immigration", quality: 84, urgency: 71, city: "San Jose, CA", time: "14 min ago", summary: "H-1B holder, employer filing for green card stalled. Needs guidance on options before status expires in 90 days.", value: "$4K–9K", phone: "(408) 555-0148", consent: true, docs: 5, status: "new", channel: "Organic" },
  { id: "LD-4468", name: "Dana Okafor", type: "family", quality: 78, urgency: 64, city: "Atlanta, GA", time: "31 min ago", summary: "Considering divorce, two minor children, jointly-owned home. Wants to understand custody and asset division.", value: "$6K–15K", phone: "(404) 555-0176", consent: true, docs: 1, status: "viewed", channel: "Referral" },
  { id: "LD-4465", name: "Tom Reyes", type: "criminal", quality: 88, urgency: 95, city: "Phoenix, AZ", time: "1 hr ago", summary: "Arrested on DUI charge last night, arraignment in 5 days. No prior record. Urgent — needs representation immediately.", value: "$3K–8K", phone: "(602) 555-0133", consent: true, docs: 2, status: "viewed", channel: "Google Ads" },
  { id: "LD-4461", name: "Helen Cho", type: "employment", quality: 73, urgency: 52, city: "Seattle, WA", time: "2 hr ago", summary: "Terminated after reporting safety violations. Believes it was retaliation. Has emails and HR correspondence.", value: "$10K–30K", phone: "(206) 555-0117", consent: true, docs: 4, status: "responded", channel: "Organic" },
  { id: "LD-4458", name: "Greg Saunders", type: "business", quality: 66, urgency: 38, city: "Denver, CO", time: "4 hr ago", summary: "Co-founder dispute over equity split at a 3-person startup. No formal operating agreement was signed.", value: "$8K–20K", phone: "(303) 555-0188", consent: true, docs: 0, status: "responded", channel: "Referral" },
];

export interface Attorney {
  name: string; firm: string; bar: string; specialties: string[];
  status: string; rating: string; leads: number; responseTime: string; joined: string;
}

export const ATTORNEYS: Attorney[] = [
  { name: "Sarah Mitchell", firm: "Mitchell & Cole LLP", bar: "TX #24087", specialties: ["injury", "employment"], status: "approved", rating: "green", leads: 47, responseTime: "3m", joined: "Mar 2026" },
  { name: "David Park", firm: "Park Immigration Law", bar: "CA #301442", specialties: ["immigration"], status: "approved", rating: "green", leads: 31, responseTime: "8m", joined: "Apr 2026" },
  { name: "Renee Adams", firm: "Adams Family Law", bar: "GA #559210", specialties: ["family"], status: "pending", rating: "yellow", leads: 0, responseTime: "—", joined: "May 2026" },
  { name: "Carlos Ruiz", firm: "Ruiz Defense Group", bar: "AZ #029318", specialties: ["criminal"], status: "review", rating: "yellow", leads: 0, responseTime: "—", joined: "May 2026" },
];

export const INTEGRATIONS = [
  { name: "Clio", desc: "Sync leads to your Clio Grow pipeline", cat: "CRM", connected: true, color: "#1E64D7" },
  { name: "MyCase", desc: "Create matters from accepted leads", cat: "CRM", connected: false, color: "#0EA5A5" },
  { name: "Lawmatics", desc: "Trigger intake automations", cat: "Marketing", connected: false, color: "#6D4AFF" },
  { name: "Calendly", desc: "Auto-book consults from messages", cat: "Scheduling", connected: true, color: "#1A1A1A" },
  { name: "Twilio", desc: "Custom SMS alert routing", cat: "Comms", connected: false, color: "#E1153C" },
  { name: "Zapier", desc: "Connect 6,000+ apps", cat: "Automation", connected: false, color: "#FF4F00" },
];

export const PORTRAITS: Record<string, string> = {
  "Sarah Mitchell": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&crop=faces",
  "David Park": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces",
  "Renee Adams": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop&crop=faces",
  "Carlos Ruiz": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=faces",
  "Alex Reed": "https://images.unsplash.com/photo-1463453091185-61582044d556?w=160&h=160&fit=crop&crop=faces",
  "Marcus Webb": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces",
  "Priya Nair": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces",
  "Dana Okafor": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=160&h=160&fit=crop&crop=faces",
  "Tom Reyes": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&h=160&fit=crop&crop=faces",
  "Helen Cho": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=160&h=160&fit=crop&crop=faces",
  "Greg Saunders": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces",
  "Elena Reyes": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&h=160&fit=crop&crop=faces",
  "David Okonkwo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=faces",
};

export const TESTIMONIALS = [
  { name: "Sarah Mitchell", role: "Partner · Mitchell & Cole LLP", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=750&fit=crop&crop=faces", quote: "We respond to matched leads in under four minutes. ClientSignal paid for itself in the first week — the lead quality is simply better.", area: "Personal Injury", stars: 5 },
  { name: "Andre Coleman", role: "Founder · Coleman Defense", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop&crop=faces", quote: "Every lead is verified and exclusive. I'm not fighting nine other firms for the same client anymore — it's just mine.", area: "Criminal Defense", stars: 5 },
  { name: "Claire Donovan", role: "Managing Attorney · Donovan Family Law", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=750&fit=crop&crop=faces", quote: "The intake scoring tells me exactly where to spend my time. My consult-to-retainer rate is up 40% since we switched.", area: "Family Law", stars: 5 },
  { name: "Imani Brooks", role: "Client · matched in Atlanta", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=750&fit=crop&crop=faces", quote: "I described what happened once and a real, licensed attorney called me within minutes. It took the fear out of the whole thing.", area: "Employment", stars: 5 },
  { name: "Thomas Reyes", role: "Partner · Reyes & Associates", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=faces", quote: "The CRM sync into Clio is seamless. Accepted leads land as matters automatically — zero copy-paste.", area: "Immigration", stars: 5 },
  { name: "Jasmine Hale", role: "Solo Practitioner", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=750&fit=crop&crop=faces", quote: "As a solo, this is the marketing department I could never afford. Predictable, qualified clients every week.", area: "Estate Planning", stars: 5 },
];

export const INTAKE_CONFIG: Record<string, { q: string; opts: string[]; extra: string; urgent: string }> = {
  injury:      { q: "What kind of injury occurred?", opts: ["Car / motor vehicle accident", "Slip & fall", "Workplace injury", "Medical malpractice", "Product defect"], extra: "When did the incident happen?", urgent: "Were you treated by a doctor or hospital?" },
  family:      { q: "What does your situation involve?", opts: ["Divorce", "Child custody", "Child / spousal support", "Adoption", "Domestic protection order"], extra: "Are there minor children involved?", urgent: "Is there an upcoming court date?" },
  criminal:    { q: "What are you facing?", opts: ["DUI / DWI", "Drug charge", "Assault", "Theft / property", "Other charge"], extra: "Have you been arrested or charged?", urgent: "Is there a hearing or arraignment scheduled?" },
  immigration: { q: "What do you need help with?", opts: ["Green card / residency", "Visa (work / family)", "Citizenship", "Deportation defense", "Asylum"], extra: "What is your current status?", urgent: "Is there a filing or status deadline?" },
  employment:  { q: "What happened at work?", opts: ["Wrongful termination", "Discrimination", "Harassment", "Wage / overtime dispute", "Retaliation"], extra: "Are you currently employed there?", urgent: "Have you filed any internal complaint?" },
  business:    { q: "What does your matter involve?", opts: ["Contract drafting / review", "Business formation", "Partnership dispute", "Breach of contract", "Intellectual property"], extra: "Is there a signed agreement?", urgent: "Is there a deadline or pending dispute?" },
};

export const CASE_STATUS: Record<string, { label: string; color: string; tint: string; dot: string }> = {
  pending: { label: "Finding attorney", color: "var(--amber)", tint: "var(--amber-tint)", dot: "var(--amber)" },
  matched: { label: "Attorney matched", color: "var(--signal)", tint: "var(--blue-tint)", dot: "var(--signal)" },
  active:  { label: "In progress", color: "var(--verified)", tint: "var(--verified-tint)", dot: "var(--verified)" },
  closed:  { label: "Closed", color: "var(--text-3)", tint: "var(--paper-2)", dot: "var(--text-3)" },
};

export interface ClientCase {
  id: string; type: string; matter: string; city: string; opened: string;
  status: string; stage: number; strength: number; atty: string | null; unread: number;
  summary: string;
  docs: { name: string; status: string; file: string | null; req: boolean }[];
}

export const CLIENT_CASES: ClientCase[] = [
  {
    id: "CS-4471", type: "injury", matter: "Car / motor vehicle accident", city: "Austin, TX", opened: "Today",
    status: "active", stage: 5, strength: 92, atty: "mitchell", unread: 1,
    summary: "Rear-ended at a red light on I-35; treated at the ER for neck and lower-back pain. The other driver was cited.",
    docs: [
      { name: "Photos of injuries", status: "done", file: "injuries_01.jpg", req: false },
      { name: "Photos of vehicle damage", status: "done", file: "vehicle_damage.jpg", req: false },
      { name: "Police report", status: "done", file: "police_report.pdf", req: true },
      { name: "Medical records / ER intake", status: "requested", file: null, req: true },
      { name: "Insurance correspondence", status: "missing", file: null, req: false },
    ],
  },
  {
    id: "CS-4460", type: "employment", matter: "Wrongful termination", city: "Austin, TX", opened: "3 days ago",
    status: "matched", stage: 4, strength: 81, atty: "okonkwo", unread: 0,
    summary: "Terminated two weeks after raising a safety complaint. Believes it was retaliation; has emails and HR correspondence.",
    docs: [
      { name: "Termination letter", status: "done", file: "termination.pdf", req: true },
      { name: "Employment contract", status: "done", file: "contract.pdf", req: true },
      { name: "Relevant emails / messages", status: "requested", file: null, req: false },
      { name: "Pay stubs", status: "missing", file: null, req: false },
    ],
  },
  {
    id: "CS-4452", type: "immigration", matter: "Green card / residency", city: "Austin, TX", opened: "1 week ago",
    status: "pending", stage: 3, strength: 74, atty: null, unread: 0,
    summary: "Employer-sponsored green card application stalled; needs guidance on options before current status expires.",
    docs: [
      { name: "Passport / ID", status: "done", file: "passport.pdf", req: true },
      { name: "Current visa documents", status: "requested", file: null, req: true },
      { name: "Employer sponsorship letter", status: "missing", file: null, req: false },
    ],
  },
  {
    id: "CS-4310", type: "family", matter: "Child custody consultation", city: "Austin, TX", opened: "2 months ago",
    status: "closed", stage: 7, strength: 88, atty: "adams", unread: 0,
    summary: "Sought guidance on a joint-custody arrangement. Matter resolved — representation completed.",
    docs: [
      { name: "Custody agreement", status: "done", file: "custody_final.pdf", req: true },
    ],
  },
];

export const CLIENT_ATTYS: Record<string, { name: string; firm: string; years: number; bar: string; rating: string; responses: string; areas: string[]; bio: string }> = {
  mitchell: { name: "Sarah Mitchell", firm: "Mitchell & Cole LLP", years: 12, bar: "TX #24087", rating: "4.9", responses: "~4 min", areas: ["injury", "employment"], bio: "Board-certified personal-injury attorney with 12 years recovering compensation for accident victims across Central Texas. Mitchell & Cole has settled over $40M in injury claims." },
  okonkwo: { name: "David Okonkwo", firm: "Okonkwo Employment Law", years: 9, bar: "TX #31204", rating: "4.8", responses: "~11 min", areas: ["employment"], bio: "Employee-side litigator focused on wrongful termination, discrimination and wage disputes. Recovered settlements for 300+ Texas workers." },
  adams: { name: "Renee Adams", firm: "Adams Family Law", years: 11, bar: "GA #559210", rating: "4.9", responses: "~8 min", areas: ["family"], bio: "Family-law attorney focused on custody, divorce, support, and protective-order matters. Adams Family Law is known for practical negotiation and careful court preparation for parents." },
  reyes: { name: "Elena Reyes", firm: "Reyes Immigration Group", years: 15, bar: "TX #19882", rating: "5.0", responses: "~7 min", areas: ["immigration"], bio: "Immigration specialist handling visas, green cards and deportation defense, with a 94% approval rate across 1,200+ cases." },
};

export const RATING: Record<string, [string, string, string]> = {
  green: ["Green", "var(--verified)", "var(--verified-tint)"],
  yellow: ["Yellow", "var(--amber)", "var(--amber-tint)"],
  red: ["Red", "var(--coral)", "var(--coral-tint)"],
};
