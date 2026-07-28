import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { BarLookupService, BarLookupResult } from './bar-lookup.service';

/* ── US Bar Number Patterns (state → regex) ─────────────────── */
const BAR_PATTERNS: Record<string, RegExp> = {
  AL: /^\d{4,6}$/,
  AK: /^\d{4,7}$/,
  AZ: /^[\w-]{5,15}$/,
  AR: /^\d{4,7}$/,
  CA: /^\d{5,7}$/,
  CO: /^\d{4,6}$/,
  CT: /^\d{5,6}$/,
  DE: /^\d{3,6}$/,
  DC: /^\d{5,7}$/,
  FL: /^\d{5,7}$/,
  GA: /^\d{5,7}$/,
  HI: /^\d{4,6}$/,
  ID: /^\d{3,6}$/,
  IL: /^\d{6,7}$/,
  IN: /^\d{4,7}$/,
  IA: /^\d{4,7}$/,
  KS: /^\d{4,6}$/,
  KY: /^\d{4,6}$/,
  LA: /^\d{4,6}$/,
  ME: /^\d{3,6}$/,
  MD: /^\d{4,10}$/,
  MA: /^\d{5,7}$/,
  MI: /^[Pp]?\d{4,6}$/,
  MN: /^\d{4,7}$/,
  MS: /^\d{3,6}$/,
  MO: /^\d{4,7}$/,
  MT: /^\d{3,6}$/,
  NE: /^\d{4,6}$/,
  NV: /^\d{4,6}$/,
  NH: /^\d{4,6}$/,
  NJ: /^\d{5,9}$/,
  NM: /^\d{4,6}$/,
  NY: /^\d{5,7}$/,
  NC: /^\d{4,6}$/,
  ND: /^\d{4,6}$/,
  OH: /^\d{5,8}$/,
  OK: /^\d{4,6}$/,
  OR: /^\d{5,7}$/,
  PA: /^\d{5,7}$/,
  RI: /^\d{3,6}$/,
  SC: /^\d{4,7}$/,
  SD: /^\d{3,6}$/,
  TN: /^\d{4,6}$/,
  TX: /^\d{7,8}$/,
  UT: /^\d{4,7}$/,
  VT: /^\d{3,6}$/,
  VA: /^\d{5,7}$/,
  WA: /^\d{4,6}$/,
  WV: /^\d{4,6}$/,
  WI: /^\d{6,7}$/,
  WY: /^\d{3,6}$/,
};

const VALID_STATES = new Set(Object.keys(BAR_PATTERNS));
const VALID_SPECIALTIES = new Set(['injury', 'family', 'criminal', 'immigration', 'employment']);
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'trashmail.com', 'sharklasers.com', 'guerrillamailblock.com',
  'grr.la', 'dispostable.com', '10minutemail.com', 'temp-mail.org',
]);

export interface SystemCheckResult {
  barFormatValid: boolean;
  validState: boolean;
  specialtiesValid: boolean;
  bioLengthOk: boolean;
  noDuplicateBar: boolean;
  emailDomainOk: boolean;
  allPassed: boolean;
  failures: string[];
}

export interface AiAnalysisResult {
  legitimacy: number;
  consistency: number;
  riskFlags: string[];
  documentFlags: string[];
  recommendation: 'approve' | 'review' | 'reject';
  reasoning: string;
}

export interface VerificationResult {
  decision: 'approve' | 'review' | 'reject';
  trustRating: 'green' | 'yellow' | 'red';
  method: 'ai-auto' | 'ai-review' | 'ai-reject';
  systemChecks: SystemCheckResult;
  aiAnalysis: AiAnalysisResult | null;
  barLookup: BarLookupResult | null;
  decidedAt: string;
  model: string;
}

@Injectable()
export class VerificationAiService {
  private readonly logger = new Logger(VerificationAiService.name);
  private groq: Groq | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly barLookup: BarLookupService,
  ) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.groq = new Groq({ apiKey });
      this.logger.log('Groq AI verification engine initialized');
    } else {
      this.logger.warn('GROQ_API_KEY not set — AI verification disabled, falling back to manual review');
    }
  }

  /* ── Layer 1: System Checks ──────────────────────────────── */

  runSystemChecks(data: {
    barNumber: string;
    state?: string;
    specialties?: string[];
    bio?: string;
    email?: string;
    existingBarNumbers: string[];
  }): SystemCheckResult {
    const failures: string[] = [];

    // Bar number format check
    const barDigits = data.barNumber.replace(/[^a-zA-Z0-9]/g, '');
    const stateCode = (data.state || '').toUpperCase();
    const pattern = BAR_PATTERNS[stateCode];
    const barFormatValid = !!(barDigits && (!pattern || pattern.test(barDigits)));
    if (!barFormatValid) failures.push(`Bar number "${data.barNumber}" does not match expected format for ${stateCode || 'unknown state'}`);

    // Valid state
    const validState = !!stateCode && VALID_STATES.has(stateCode);
    if (!validState) failures.push(`Invalid or missing state: "${data.state}"`);

    // Specialties valid
    const specialtiesValid = !!(data.specialties?.length && data.specialties.every(s => VALID_SPECIALTIES.has(s)));
    if (!specialtiesValid) failures.push('No valid specialties selected');

    // Bio length
    const bioLengthOk = !!(data.bio && data.bio.trim().length >= 50);
    if (!bioLengthOk) failures.push(`Bio too short (${data.bio?.trim().length || 0} chars, minimum 50)`);

    // Duplicate bar number
    const noDuplicateBar = !data.existingBarNumbers.includes(data.barNumber);
    if (!noDuplicateBar) failures.push('Bar number already registered in the system');

    // Email domain
    let emailDomainOk = true;
    if (data.email) {
      const domain = data.email.split('@')[1]?.toLowerCase();
      if (domain && DISPOSABLE_DOMAINS.has(domain)) {
        emailDomainOk = false;
        failures.push(`Disposable email domain detected: ${domain}`);
      }
    }

    return {
      barFormatValid,
      validState,
      specialtiesValid,
      bioLengthOk,
      noDuplicateBar,
      emailDomainOk,
      allPassed: failures.length === 0,
      failures,
    };
  }

  /* ── Layer 2: Groq AI Analysis ───────────────────────────── */

  async runAiAnalysis(data: {
    name: string;
    barNumber: string;
    bio?: string;
    yearsExperience?: number;
    city?: string;
    state?: string;
    firmName?: string;
    specialties?: string[];
    documentMetadata?: { fileName: string; mimeType: string; sizeBytes: number }[];
  }): Promise<AiAnalysisResult | null> {
    if (!this.groq) return null;

    const docSection = data.documentMetadata?.length
      ? `\nUploaded Documents:\n${data.documentMetadata.map(d =>
          `- ${d.fileName} (${d.mimeType}, ${(d.sizeBytes / 1024).toFixed(1)} KB)`
        ).join('\n')}`
      : '\nNo documents uploaded.';

    const prompt = `You are a legal industry verification system for ClientSignal, a legal marketplace platform. Analyze this attorney profile submission and determine if it appears legitimate.

Attorney Profile:
- Name: ${data.name || 'Not provided'}
- Bar Number: ${data.barNumber}
- State: ${data.state || 'Not provided'}
- City: ${data.city || 'Not provided'}
- Firm: ${data.firmName || 'Solo practitioner'}
- Years of Experience: ${data.yearsExperience ?? 'Not provided'}
- Practice Areas: ${data.specialties?.join(', ') || 'None listed'}
- Bio: ${data.bio || 'Not provided'}
${docSection}

Evaluate and return a JSON object with these exact fields:
{
  "legitimacy": <0-100 score — does this profile appear to be a real attorney? Check for: plausible bio, bar number consistency, reasonable experience claims>,
  "consistency": <0-100 score — do the details align? Years of experience vs specialties, city/state match, bio matches practice areas>,
  "riskFlags": [<array of specific red flag strings, empty if none. Examples: "Bio appears copy-pasted/generic", "Years of experience inconsistent with claimed specialties", "Firm name appears fabricated">],
  "documentFlags": [<array of document-related concerns, empty if none. Examples: "File type not a valid legal document format", "File suspiciously small for claimed document type", "File name suggests template/stock document">],
  "recommendation": "<approve|review|reject>",
  "reasoning": "<1-2 sentence explanation of your decision>"
}

Rules:
- Score legitimacy based on whether the profile reads like a real attorney, not perfection
- Flag obvious fakes (gibberish bio, impossible experience claims, suspicious patterns)
- A minimal but honest profile should still score 60+ on legitimacy
- If documents are uploaded, check that file names and types make sense for legal credentials (bar certificates, licenses should be PDF/image, reasonable file sizes)
- Tiny files (<1KB) claiming to be documents are suspicious
- Only recommend "reject" for clearly fraudulent submissions
- Recommend "review" for borderline cases that need human eyes

Return ONLY the JSON object, no markdown, no explanation outside the JSON.`;

    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) {
        this.logger.warn('Groq returned empty response');
        return null;
      }

      const parsed = JSON.parse(raw) as AiAnalysisResult;

      // Validate the response has expected fields
      if (
        typeof parsed.legitimacy !== 'number' ||
        typeof parsed.consistency !== 'number' ||
        !Array.isArray(parsed.riskFlags) ||
        !['approve', 'review', 'reject'].includes(parsed.recommendation)
      ) {
        this.logger.warn('Groq returned malformed response', raw);
        return null;
      }

      this.logger.log(
        `AI verification: legitimacy=${parsed.legitimacy} consistency=${parsed.consistency} ` +
        `flags=${parsed.riskFlags.length} recommendation=${parsed.recommendation}`,
      );

      return parsed;
    } catch (err) {
      this.logger.error('Groq AI analysis failed', (err as Error).message);
      return null;
    }
  }

  /* ── Layer 3: Decision Logic ─────────────────────────────── */

  async verify(data: {
    name: string;
    barNumber: string;
    bio?: string;
    yearsExperience?: number;
    city?: string;
    state?: string;
    firmName?: string;
    specialties?: string[];
    email?: string;
    existingBarNumbers: string[];
    documentMetadata?: { fileName: string; mimeType: string; sizeBytes: number }[];
  }): Promise<VerificationResult> {
    // Layer 1
    const systemChecks = this.runSystemChecks({
      barNumber: data.barNumber,
      state: data.state,
      specialties: data.specialties,
      bio: data.bio,
      email: data.email,
      existingBarNumbers: data.existingBarNumbers,
    });

    // If critical system checks fail, reject immediately
    if (!systemChecks.noDuplicateBar) {
      return {
        decision: 'reject',
        trustRating: 'red',
        method: 'ai-reject',
        systemChecks,
        aiAnalysis: null,
        decidedAt: new Date().toISOString(),
        model: 'system-checks-only',
      };
    }

    // Layer 2
    const aiAnalysis = await this.runAiAnalysis({
      name: data.name,
      barNumber: data.barNumber,
      bio: data.bio,
      yearsExperience: data.yearsExperience,
      city: data.city,
      state: data.state,
      firmName: data.firmName,
      specialties: data.specialties,
      documentMetadata: data.documentMetadata,
    });

    // Layer 3: Combine results
    if (!systemChecks.allPassed && !aiAnalysis) {
      // System checks failed and no AI available — flag for review
      return {
        decision: 'review',
        trustRating: 'yellow',
        method: 'ai-review',
        systemChecks,
        aiAnalysis: null,
        decidedAt: new Date().toISOString(),
        model: 'system-checks-only',
      };
    }

    if (aiAnalysis) {
      const hasDocFlags = (aiAnalysis.documentFlags?.length || 0) > 0;
      const hasCriticalFlags = aiAnalysis.riskFlags.some(f =>
        /fraud|fake|fabricat|stolen|impersonat/i.test(f),
      );

      // Auto-reject: AI says reject OR critical risk flags
      if (aiAnalysis.recommendation === 'reject' || hasCriticalFlags || aiAnalysis.legitimacy < 40) {
        return {
          decision: 'reject',
          trustRating: 'red',
          method: 'ai-reject',
          systemChecks,
          aiAnalysis,
          decidedAt: new Date().toISOString(),
          model: 'llama-3.3-70b-versatile',
        };
      }

      // Auto-approve: high scores, no flags, system checks pass
      if (
        systemChecks.allPassed &&
        aiAnalysis.legitimacy >= 70 &&
        aiAnalysis.consistency >= 60 &&
        aiAnalysis.riskFlags.length === 0 &&
        !hasDocFlags &&
        aiAnalysis.recommendation === 'approve'
      ) {
        return {
          decision: 'approve',
          trustRating: 'green',
          method: 'ai-auto',
          systemChecks,
          aiAnalysis,
          decidedAt: new Date().toISOString(),
          model: 'llama-3.3-70b-versatile',
        };
      }

      // Everything else: flag for human review
      return {
        decision: 'review',
        trustRating: 'yellow',
        method: 'ai-review',
        systemChecks,
        aiAnalysis,
        decidedAt: new Date().toISOString(),
        model: 'llama-3.3-70b-versatile',
      };
    }

    // No AI available, system checks passed — approve with yellow trust
    if (systemChecks.allPassed) {
      return {
        decision: 'approve',
        trustRating: 'yellow',
        method: 'ai-auto',
        systemChecks,
        aiAnalysis: null,
        decidedAt: new Date().toISOString(),
        model: 'system-checks-only',
      };
    }

    return {
      decision: 'review',
      trustRating: 'yellow',
      method: 'ai-review',
      systemChecks,
      aiAnalysis: null,
      decidedAt: new Date().toISOString(),
      model: 'system-checks-only',
    };
  }
}
