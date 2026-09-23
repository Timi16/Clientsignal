/* Connector catalog for the attorney and client connector directories.
   `name` is the stable identifier stored against the account, so don't rename
   an entry without migrating saved connections. */

import LOGOS from "./connector-logos.json";

export interface Connector {
  name: string;
  desc: string;
  cat: string;
  color: string;
  /** What ClientSignal exchanges with the app — shown in the connect dialog */
  access: string[];
  popular?: boolean;
}

type Row = [name: string, desc: string, color: string, popular?: boolean];

/* Default data-access copy per category, so each row stays a one-liner */
const ATTORNEY_ACCESS: Record<string, string[]> = {
  "Practice management": ["Create contacts and matters from accepted leads", "Sync lead status and intake answers", "Read matter stage to update your ClientSignal pipeline"],
  "CRM & intake": ["Push new leads and intake answers", "Sync lead status both ways", "Trigger your intake automations"],
  "Reception & calls": ["Send new-lead alerts for call-back", "Log call outcomes on the lead", "Attribute inbound calls to ClientSignal leads"],
  "E-signature": ["Send engagement letters for signature", "Track signature status on the lead", "Store the signed copy with the case"],
  "Documents & storage": ["Create a folder per accepted lead", "Copy client-uploaded documents into it", "Attach files from your storage to messages"],
  "Calendar & scheduling": ["Read your availability", "Book consultations from the message thread", "Send calendar invites to the client"],
  "Communication": ["Send lead alerts and case notifications", "Log conversations on the lead", "Start calls or meetings from a lead"],
  "Billing & payments": ["Create a client record when a lead is retained", "Send retainer payment requests", "Report retained revenue in Analytics"],
  "Legal research": ["Open research from a lead with case type and jurisdiction pre-filled", "Save research links to case notes"],
  "Courts & e-filing": ["Link dockets to a case", "Receive filing and hearing alerts", "Add court dates to the case timeline"],
  "Marketing & ads": ["Report qualified-lead conversions back to the channel", "Attribute leads to campaigns", "Sync audiences for follow-up"],
  "Automation": ["Send lead and case events to your workflows", "Receive actions back from your workflows"],
  "Immigration": ["Create a client and case from an accepted lead", "Pre-fill forms from intake answers", "Sync case status to the client timeline"],
};

const CLIENT_ACCESS: Record<string, string[]> = {
  "Documents & storage": ["Choose specific files to add to your case", "We only read files you pick — never your whole drive"],
  "Email & calendar": ["Add consultations and court dates to your calendar", "Send case updates to your inbox"],
  "Messaging & alerts": ["Send you case updates and attorney replies", "You can mute or disconnect at any time"],
  "Video meetings": ["Create meeting links for consultations with your attorney", "Add the link to your calendar invite"],
  "E-signature": ["Receive engagement letters and forms to sign", "Keep signed copies in your Documents"],
  "Identity verification": ["Confirm your identity once", "Share only the verified result with your attorney — not your ID images"],
  "Payments": ["Pay retainers and invoices your attorney sends", "ClientSignal never stores your full card or bank details"],
  "Records & evidence": ["Import only the records you select", "Shared with your matched attorney only"],
  "Scanning": ["Import scans straight into your case Documents"],
};

function build(groups: Record<string, Row[]>, access: Record<string, string[]>): Connector[] {
  return Object.entries(groups).flatMap(([cat, rows]) =>
    rows.map(([name, desc, color, popular]) => ({ name, desc, cat, color, access: access[cat] ?? [], popular })),
  );
}

/* ================= Attorney connectors ================= */
export const ATTORNEY_CONNECTORS: Connector[] = build({
  "Practice management": [
    ["Clio", "Sync leads to your Clio Grow pipeline and open matters in Clio Manage", "#1E64D7", true],
    ["MyCase", "Create matters from accepted leads", "#0EA5A5", true],
    ["PracticePanther", "Turn accepted leads into contacts and matters", "#2F80ED"],
    ["Smokeball", "Open a matter with intake details pre-filled", "#F05A28"],
    ["Filevine", "Create projects from retained leads", "#00A3E0", true],
    ["Litify", "Push intakes into Litify on Salesforce", "#1B5EA7"],
    ["CASEpeer", "Personal-injury case management sync", "#0B7A75"],
    ["Rocket Matter", "Create matters and contacts automatically", "#E5352B"],
    ["CosmoLex", "Matters, trust accounting, and billing in one sync", "#0072BC"],
    ["CARET Legal", "Create matters in CARET Legal (formerly Zola Suite)", "#C8102E"],
    ["Actionstep", "Start an Actionstep workflow from a retained lead", "#00B2A9"],
    ["LEAP", "Open a LEAP matter with client details filled in", "#F7941D"],
    ["SmartAdvocate", "Create cases from accepted leads", "#1F4E8C"],
    ["Neos", "Sync intakes to Neos (formerly Needles)", "#5B2D8E"],
    ["CloudLex", "Personal-injury matters created from leads", "#0091D5"],
    ["Centerbase", "Matters and contacts for mid-size firms", "#D7282F"],
  ],
  "CRM & intake": [
    ["Lawmatics", "Trigger intake automations", "#6D4AFF", true],
    ["Law Ruler", "Send leads into Law Ruler intake campaigns", "#0D6EFD"],
    ["Lead Docket", "Route ClientSignal leads into Lead Docket", "#1C75BC"],
    ["Salesforce", "Create leads and opportunities in Salesforce", "#00A1E0", true],
    ["HubSpot", "Add contacts and deals to your HubSpot pipeline", "#FF7A59"],
    ["Zoho CRM", "Sync leads and contact status", "#E42527"],
    ["Pipedrive", "Create deals from accepted leads", "#1A1A1A"],
    ["Intaker", "Combine chat intakes with ClientSignal leads", "#3B5BDB"],
    ["Typeform", "Send follow-up questionnaires to new leads", "#262627"],
    ["Jotform", "Collect extra intake forms and signatures", "#FF6100"],
  ],
  "Reception & calls": [
    ["Smith.ai", "Have receptionists call new leads within minutes", "#1D9BF0", true],
    ["Ruby", "Live receptionists follow up on matched leads", "#C8102E"],
    ["CallRail", "Call tracking and attribution for lead calls", "#0FA47F", true],
    ["LEX Reception", "24/7 legal answering service hand-off", "#22409A"],
    ["Answering Legal", "After-hours intake for urgent leads", "#1E88E5"],
    ["Posh", "Virtual receptionists for lead call-backs", "#7B3FE4"],
  ],
  "E-signature": [
    ["DocuSign", "Send engagement letters for e-signature", "#4C00FF", true],
    ["Dropbox Sign", "Retainers signed from the message thread", "#0061FE"],
    ["Adobe Acrobat Sign", "Send agreements for signature with Adobe", "#EB1000"],
    ["PandaDoc", "Generate and send fee agreements", "#248567"],
    ["SignNow", "Simple signatures for retainers and releases", "#0F62FE"],
  ],
  "Documents & storage": [
    ["Google Drive", "Save client documents to a Drive folder per case", "#1FA463", true],
    ["Dropbox", "Copy case documents into Dropbox", "#0061FE"],
    ["Box", "Secure document storage per matter", "#0061D5"],
    ["OneDrive", "Store case files in OneDrive", "#0078D4"],
    ["SharePoint", "File client documents to your firm's SharePoint", "#038387"],
    ["NetDocuments", "Profile documents into NetDocuments workspaces", "#0F4C81"],
    ["iManage", "File to iManage Work matters", "#E4002B"],
    ["Notion", "Log leads and case notes to a Notion database", "#1A1A1A"],
  ],
  "Calendar & scheduling": [
    ["Calendly", "Auto-book consults from messages", "#006BFF", true],
    ["Google Calendar", "Show availability and book consultations", "#4285F4", true],
    ["Outlook Calendar", "Book consultations on your Microsoft 365 calendar", "#0078D4"],
    ["Acuity Scheduling", "Let matched clients self-schedule", "#1A1A1A"],
    ["Cal.com", "Open-source scheduling for consults", "#292929"],
    ["LawTap", "Online booking built for law firms", "#00A79D"],
  ],
  "Communication": [
    ["Twilio", "Custom SMS alert routing", "#E1153C"],
    ["Slack", "Post new-lead alerts to a Slack channel", "#611F69", true],
    ["Microsoft Teams", "Lead alerts and consult meetings in Teams", "#5059C9"],
    ["Zoom", "Create video consultations in one click", "#0B5CFF", true],
    ["Google Meet", "Add Meet links to booked consultations", "#00897B"],
    ["Gmail", "Send and log lead emails from your Gmail", "#D93025"],
    ["Outlook", "Send and log lead emails from Outlook", "#0F6CBD"],
    ["RingCentral", "Click-to-call leads and log the outcome", "#FF8800"],
    ["Dialpad", "Call leads and keep transcripts with the case", "#7C52FF"],
    ["OpenPhone", "Shared firm number for calls and texts", "#6439F5"],
    ["WhatsApp Business", "Message clients who prefer WhatsApp", "#128C7E"],
    ["Case Status", "Push case updates to the Case Status client app", "#2F6FED"],
  ],
  "Billing & payments": [
    ["LawPay", "Collect retainers with trust-compliant payments", "#00539B", true],
    ["Stripe", "Take retainer and consultation payments", "#635BFF"],
    ["QuickBooks Online", "Create customers and invoices for retained clients", "#2CA01C", true],
    ["Xero", "Sync retained clients and invoices", "#13B5EA"],
    ["Confido Legal", "Legal payments with trust accounting safeguards", "#1B3A57"],
    ["Headnote", "Compliant e-payments and AR automation", "#2D6CDF"],
    ["TimeSolv", "Start time tracking when a lead is retained", "#0077C8"],
    ["Bill4Time", "Create clients and projects for billing", "#F26522"],
    ["Affirm", "Offer clients pay-over-time for legal fees", "#4A4AF4"],
  ],
  "Legal research": [
    ["Westlaw", "Jump into Westlaw research from a lead", "#F5821F"],
    ["Lexis+", "Open LexisNexis research with jurisdiction pre-set", "#E8171F"],
    ["Fastcase", "Research case law from your lead view", "#1B75BB"],
    ["CoCounsel", "AI legal assistant for case review", "#0A2540"],
    ["vLex", "Global case law and Vincent AI research", "#1E3A8A"],
    ["CourtListener", "Free case law and docket search", "#B53C2C"],
    ["Trellis", "State trial court records and judge analytics", "#0E7C66"],
    ["Bloomberg Law", "Dockets, research, and practical guidance", "#1A1A1A"],
  ],
  "Courts & e-filing": [
    ["PACER", "Link federal dockets to a case", "#1F3A68"],
    ["Docket Alarm", "Docket tracking and hearing alerts", "#D64541"],
    ["One Legal", "E-file and serve documents in supported courts", "#0067B1"],
    ["File & ServeXpress", "E-filing and e-service", "#00548F"],
    ["InfoTrack", "E-filing, service of process, and court searches", "#E4002B"],
    ["Odyssey eFile", "File into Tyler Odyssey courts", "#004B87"],
    ["ABC Legal", "Order service of process and track status", "#F36F21"],
    ["LawToolBox", "Rules-based court deadline calculation", "#2E7D32"],
  ],
  "Immigration": [
    ["Docketwise", "Create immigration cases and pre-fill USCIS forms", "#2563EB"],
    ["INSZoom", "Sync clients and cases to INSZoom", "#0B5FA5"],
    ["LollyLaw", "Immigration case management sync", "#EC4899"],
    ["eImmigration", "Forms and case tracking by Cerenade", "#00796B"],
  ],
  "Marketing & ads": [
    ["Google Ads", "Send qualified-lead conversions back to Google Ads", "#4285F4", true],
    ["Meta Ads", "Report conversions to Facebook and Instagram campaigns", "#0866FF"],
    ["Google Analytics", "Track lead and retained events in GA4", "#E37400"],
    ["Google Business Profile", "Request reviews from closed clients", "#1A73E8"],
    ["Mailchimp", "Add closed clients to newsletters (with consent)", "#1A1A1A"],
    ["Birdeye", "Automate review requests after a case closes", "#1976D2"],
    ["Avvo", "Show your Avvo rating on your ClientSignal profile", "#00447C"],
    ["Martindale-Hubbell", "Display peer ratings on your profile", "#8A1538"],
  ],
  "Automation": [
    ["Zapier", "Connect 6,000+ apps", "#FF4F00", true],
    ["Make", "Build visual multi-step automations", "#6D00CC"],
    ["n8n", "Self-hosted workflow automation", "#EA4B71"],
    ["Webhooks", "Send lead and case events to any URL", "#334155"],
    ["Power Automate", "Microsoft 365 workflows for your firm", "#0066FF"],
  ],
}, ATTORNEY_ACCESS);

/* ================= Client connectors ================= */
export const CLIENT_CONNECTORS: Connector[] = build({
  "Documents & storage": [
    ["Google Drive", "Add documents to your case straight from Drive", "#1FA463", true],
    ["Dropbox", "Pick files from Dropbox to share with your attorney", "#0061FE"],
    ["OneDrive", "Upload case documents from OneDrive", "#0078D4"],
    ["iCloud Drive", "Add files saved on your iPhone or Mac", "#3693F3", true],
    ["Box", "Share files from your Box account", "#0061D5"],
    ["Google Photos", "Add photos of injuries, damage, or the scene", "#EA4335", true],
    ["iCloud Photos", "Pick evidence photos from your photo library", "#F59E0B"],
  ],
  "Email & calendar": [
    ["Gmail", "Get case updates in Gmail and forward emails as evidence", "#D93025", true],
    ["Outlook", "Get case updates in Outlook", "#0F6CBD"],
    ["Yahoo Mail", "Get case updates in Yahoo Mail", "#6001D2"],
    ["Google Calendar", "Consultations and court dates on your calendar", "#4285F4", true],
    ["Apple Calendar", "Add consultations and deadlines to iCloud Calendar", "#FF3B30"],
    ["Outlook Calendar", "Consultations and court dates in Outlook", "#0078D4"],
  ],
  "Messaging & alerts": [
    ["SMS", "Text alerts when your attorney replies", "#16A34A", true],
    ["WhatsApp", "Case updates on WhatsApp", "#128C7E", true],
    ["Telegram", "Case updates on Telegram", "#229ED9"],
    ["Messenger", "Case updates on Facebook Messenger", "#0084FF"],
  ],
  "Video meetings": [
    ["Zoom", "Meet your attorney over Zoom", "#0B5CFF", true],
    ["Google Meet", "Video consultations with Google Meet", "#00897B"],
    ["Microsoft Teams", "Video consultations in Teams", "#5059C9"],
    ["FaceTime", "Consultation links for iPhone, iPad, and Mac", "#34C759"],
  ],
  "E-signature": [
    ["DocuSign", "Sign your engagement letter from your phone", "#4C00FF", true],
    ["Dropbox Sign", "Sign retainers and releases online", "#0061FE"],
    ["Adobe Acrobat Sign", "Sign agreements with Adobe", "#EB1000"],
  ],
  "Identity verification": [
    ["ID.me", "Verify your identity once, securely", "#2E8540"],
    ["Persona", "Quick ID check with your phone camera", "#4F46E5"],
    ["CLEAR", "Verify with your CLEAR identity", "#041E42"],
  ],
  "Payments": [
    ["Apple Pay", "Pay retainers with Apple Pay", "#1A1A1A"],
    ["Google Pay", "Pay retainers with Google Pay", "#4285F4"],
    ["PayPal", "Pay legal fees with PayPal", "#003087"],
    ["Plaid", "Securely link your bank for ACH payments", "#111111"],
    ["Affirm", "Pay legal fees over time", "#4A4AF4"],
    ["Klarna", "Split legal fees into instalments", "#FF8FB4"],
  ],
  "Records & evidence": [
    ["MyChart", "Share medical records for an injury claim", "#C8102E", true],
    ["Apple Health Records", "Share health records from your iPhone", "#FF2D55"],
    ["ADP", "Share pay stubs and W-2s for wage or employment claims", "#D0271D"],
    ["Gusto", "Share pay stubs and employment documents", "#F45D48"],
    ["Workday", "Share pay and employment history", "#0875E1"],
    ["Paychex", "Share pay stubs and tax forms", "#004B8D"],
    ["USCIS Case Status", "Track your USCIS receipt numbers on your timeline", "#003366"],
    ["CBP I-94", "Import your I-94 travel history", "#1B4F72"],
    ["EOIR Case Status", "Track immigration court hearing dates", "#2C3E50"],
    ["Uber", "Share trip records for a rideshare accident", "#1A1A1A"],
    ["Lyft", "Share ride history for a rideshare accident", "#FF00BF"],
    ["Credit Karma", "Share a credit report for debt or identity-theft matters", "#008600"],
  ],
  "Scanning": [
    ["Adobe Scan", "Scan paper documents with your phone", "#EB1000"],
    ["Microsoft Lens", "Scan letters, tickets, and forms", "#0F6CBD"],
    ["Genius Scan", "Turn paperwork into clean PDFs", "#F97316"],
    ["CamScanner", "Scan and upload documents", "#1BBF83"],
  ],
}, CLIENT_ACCESS);

/** File-name form of a connector name; keep in sync with scripts/fetch-connector-logos.mjs */
export function connectorSlug(name: string): string {
  return name.toLowerCase().replace(/&/g, " and ").replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Path to the connector's logo under /public, or null when only the initials tile exists */
export function connectorLogo(name: string): string | null {
  const ext = (LOGOS as Record<string, string>)[connectorSlug(name)];
  return ext ? `/connectors/${connectorSlug(name)}.${ext}` : null;
}

export function connectorCategories(list: Connector[]): string[] {
  return Array.from(new Set(list.map(c => c.cat)));
}
