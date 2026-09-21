/* Terms of Service & Privacy Policy shown in the signup popup.
   Bump TERMS_VERSION whenever the text changes — the accepted version is
   recorded against the user's registration in the audit log. */

export const TERMS_VERSION = "2026-09-19";
export const TERMS_EFFECTIVE = "September 19, 2026";

export type LegalRole = "client" | "attorney";
export type LegalDoc = "terms" | "privacy";

export interface LegalSection {
  title: string;
  body: string[];
}

const TERMS_COMMON_INTRO: LegalSection[] = [
  {
    title: "1. Agreement to these terms",
    body: [
      "These Terms of Service are a binding agreement between you and ClientSignal. By creating an account you confirm that you have read, understood, and agree to these Terms and to our Privacy Policy. If you do not agree, do not create an account.",
      "You must be at least 18 years old and able to enter into a legally binding contract to use ClientSignal.",
    ],
  },
  {
    title: "2. ClientSignal is not a law firm",
    body: [
      "ClientSignal is a technology platform that connects people seeking legal help with independent, licensed attorneys. ClientSignal is not a law firm, does not provide legal advice, and is not a lawyer referral service.",
      "Nothing on the platform — including intake questions, case scoring, summaries, or automated messages — is legal advice. Using ClientSignal does not create an attorney-client relationship between you and ClientSignal.",
    ],
  },
];

const TERMS_CLIENT: LegalSection[] = [
  {
    title: "3. How matching works",
    body: [
      "When you submit an inquiry we review it, score it for completeness and fit, and route it to a verified attorney licensed in the relevant state and practice area. We do not guarantee that an attorney will accept your matter, and we do not guarantee any result or outcome.",
      "An attorney-client relationship is formed only between you and an attorney, and only when you both agree to it — normally by signing an engagement or retainer agreement. The attorney, not ClientSignal, is solely responsible for the legal services provided.",
      "ClientSignal is free for clients. Any legal fees are agreed directly between you and your attorney.",
    ],
  },
  {
    title: "4. Consent to be contacted",
    body: [
      "By creating an account and submitting an inquiry, you consent to be contacted about it by ClientSignal and by your matched attorney by phone call, text message (SMS), email, and in-app message, including through automated technology, at the contact details you provide. Message and data rates may apply. Consent is not a condition of purchasing anything.",
      "You can opt out of text messages at any time by replying STOP, and you can change your notification preferences in Settings.",
    ],
  },
  {
    title: "5. Your information and documents",
    body: [
      "You agree to provide information that is accurate and complete to the best of your knowledge. You authorize ClientSignal to share your inquiry, contact details, and any documents you upload with the attorney you are matched to so they can evaluate your matter.",
      "We never sell your inquiry to multiple firms. Your matter is shared only with your matched attorney.",
      "Information you send before an attorney agrees to represent you may not be protected by attorney-client privilege. Avoid sharing more detail than the intake asks for until you are speaking with your attorney.",
    ],
  },
  {
    title: "6. Emergencies and deadlines",
    body: [
      "ClientSignal is not an emergency service. If you are in danger, call 911. Legal claims are subject to strict deadlines (statutes of limitations); submitting an inquiry does not pause or extend any deadline. You remain responsible for protecting your own legal rights until an attorney has agreed to represent you.",
    ],
  },
];

const TERMS_ATTORNEY: LegalSection[] = [
  {
    title: "3. Eligibility and verification",
    body: [
      "You represent that you are an attorney licensed and in good standing in every jurisdiction you list, and that the bar number, firm, and practice information you provide is accurate. You authorize ClientSignal to verify your license and disciplinary history with state bar records and other public sources, at signup and on an ongoing basis.",
      "You must tell us promptly about any suspension, disbarment, public discipline, or lapse in malpractice coverage. We may suspend or remove any account that fails verification or no longer meets our standards.",
    ],
  },
  {
    title: "4. Leads and professional responsibility",
    body: [
      "Leads delivered to you are exclusive: we do not sell the same inquiry to another firm. We do not guarantee the volume, quality, or conversion of leads, and lead scores are estimates, not assurances.",
      "You are solely responsible for your own compliance with the Rules of Professional Conduct in each jurisdiction where you practice, including rules on advertising, solicitation, conflicts of interest, fee sharing, confidentiality, and client communication. Fees paid to ClientSignal are for marketing and technology services; they are not a share of legal fees and are not contingent on the outcome of any matter.",
      "You are responsible for running your own conflict checks and for deciding, in your independent professional judgment, whether to accept any matter. ClientSignal does not direct or control your legal work.",
    ],
  },
  {
    title: "5. Handling client information",
    body: [
      "Inquiry data, contact details, and documents are provided to you solely to evaluate and respond to that prospective client. You must treat this information as confidential, consistent with your duties to prospective clients, and you may not resell, share, or use it for unrelated marketing.",
      "You agree to contact leads only through lawful means and to honor opt-out requests, including under the TCPA and applicable state law.",
    ],
  },
  {
    title: "6. Subscriptions and billing",
    body: [
      "Paid plans are billed in advance on a recurring basis at the price shown at checkout, and renew automatically until cancelled. You can cancel at any time from Billing; cancellation takes effect at the end of the current billing period. Except where required by law or stated in our lead-credit policy, fees are non-refundable.",
      "We may change pricing with at least 30 days' notice before your next renewal.",
    ],
  },
];

const TERMS_COMMON_OUTRO: LegalSection[] = [
  {
    title: "7. Connected apps",
    body: [
      "You may choose to connect third-party services (for example, cloud storage, calendars, practice-management or e-signature tools). When you do, you authorize ClientSignal to exchange data with that service as described at the time you connect. Third-party services are governed by their own terms and privacy policies, and you can disconnect them at any time.",
    ],
  },
  {
    title: "8. Acceptable use",
    body: [
      "You agree not to: submit false or misleading information; impersonate another person; use the platform for any unlawful purpose; harass other users; attempt to access accounts or data that are not yours; scrape, reverse engineer, or interfere with the platform; or use it to send spam.",
    ],
  },
  {
    title: "9. Your account",
    body: [
      "You are responsible for keeping your password confidential and for activity under your account. Tell us immediately if you suspect unauthorized access. We may suspend or terminate accounts that violate these Terms. You can close your account at any time from Settings.",
    ],
  },
  {
    title: "10. Disclaimers and limitation of liability",
    body: [
      "The platform is provided \"as is\" and \"as available\" without warranties of any kind, to the fullest extent permitted by law. ClientSignal does not endorse or guarantee any attorney or client, and is not responsible for the acts, omissions, advice, or work product of any user.",
      "To the fullest extent permitted by law, ClientSignal will not be liable for indirect, incidental, special, consequential, or punitive damages, and our total liability for any claim relating to the platform is limited to the greater of $100 or the amount you paid us in the 12 months before the claim arose.",
    ],
  },
  {
    title: "11. Changes and contact",
    body: [
      "We may update these Terms from time to time. If we make material changes we will notify you by email or in the app before they take effect. Continuing to use ClientSignal after changes take effect means you accept the updated Terms.",
      "Questions about these Terms? Contact us at legal@clientsignal.com.",
    ],
  },
];

const PRIVACY_COMMON: LegalSection[] = [
  {
    title: "1. Information we collect",
    body: [
      "Account information: your name, email address, phone number, and password (stored only as a secure hash).",
      "Technical information: IP address, browser and device details, and security logs of account activity such as sign-ins.",
    ],
  },
];

const PRIVACY_CLIENT: LegalSection[] = [
  {
    title: "2. Information about your legal matter",
    body: [
      "We collect what you tell us in the intake — the type of legal issue, what happened, where, and when — along with documents and messages you upload or send. Some of this may be sensitive (for example, details about injuries, immigration status, family circumstances, or criminal charges). We collect it only to match you with an attorney and support your case.",
    ],
  },
  {
    title: "3. How we use and share it",
    body: [
      "We use your information to score and route your inquiry, connect you with a verified attorney, send case updates, keep the platform secure, and meet our legal obligations.",
      "We share your inquiry and documents only with your matched attorney, and with service providers who help us run the platform (such as hosting, email, and SMS delivery) under contractual confidentiality obligations. We do not sell your personal information, and we do not share your inquiry with multiple firms.",
    ],
  },
];

const PRIVACY_ATTORNEY: LegalSection[] = [
  {
    title: "2. Professional information",
    body: [
      "We collect your bar number, jurisdictions of licensure, firm details, practice areas, biography, and verification documents, and we retrieve public licensing and disciplinary records from state bar sources. Billing details are handled by our payment processor; we do not store full card numbers.",
    ],
  },
  {
    title: "3. How we use and share it",
    body: [
      "We use your information to verify your license, match you with relevant inquiries, display your professional profile to matched clients, process billing, measure response times and lead outcomes, and keep the platform secure.",
      "Your name, firm, practice areas, and verification status are shown to clients you are matched with. We share data with service providers who help us run the platform under contractual confidentiality obligations. We do not sell your personal information.",
    ],
  },
];

const PRIVACY_OUTRO: LegalSection[] = [
  {
    title: "4. Connected apps",
    body: [
      "If you connect a third-party service, we access only the data needed for the feature you enabled, and only while the connection is active. Disconnecting stops further access. The third party's handling of your data is governed by its own privacy policy.",
    ],
  },
  {
    title: "5. Security and retention",
    body: [
      "Data is encrypted in transit and at rest, access is restricted to those who need it, and account activity is logged. We keep your information for as long as your account is active and as needed to comply with legal, tax, and professional-record obligations, then delete or anonymize it.",
    ],
  },
  {
    title: "6. Your choices and rights",
    body: [
      "You can access and update your details in Settings, change notification preferences, opt out of texts by replying STOP, and request a copy or deletion of your data. Depending on where you live (for example, California), you may have additional rights to know, correct, delete, and limit the use of your personal information. We will not discriminate against you for exercising them.",
      "To make a request, contact privacy@clientsignal.com.",
    ],
  },
];

export function getLegalSections(doc: LegalDoc, role: LegalRole): LegalSection[] {
  if (doc === "terms") {
    return [...TERMS_COMMON_INTRO, ...(role === "attorney" ? TERMS_ATTORNEY : TERMS_CLIENT), ...TERMS_COMMON_OUTRO];
  }
  return [...PRIVACY_COMMON, ...(role === "attorney" ? PRIVACY_ATTORNEY : PRIVACY_CLIENT), ...PRIVACY_OUTRO];
}
