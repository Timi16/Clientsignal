import { Injectable } from '@nestjs/common';

/**
 * Scoring engine -- replicates and extends the frontend formula from intake-form.tsx:
 *   score = 55 + desc_bonus + docs*5 + urgent_bonus + consent_bonus
 *
 * Quality score factors: description detail, document count, consent, channel quality
 * Urgency score factors: urgent flag, practice area defaults, sub-type severity
 */

const CHANNEL_QUALITY: Record<string, number> = {
  'Google Ads': 8,
  'Referral': 10,
  'Organic': 5,
  'Social': 3,
  'Direct': 4,
};

const PRACTICE_URGENCY_BASE: Record<string, number> = {
  injury: 60,
  criminal: 75,
  family: 45,
  immigration: 50,
  employment: 40,
};

const VALUE_ESTIMATES: Record<string, string> = {
  injury: '$10K–45K',
  family: '$5K–15K',
  criminal: '$3K–10K',
  immigration: '$4K–12K',
  employment: '$8K–30K',
};

@Injectable()
export class ScoringService {
  score(data: {
    practiceArea: string;
    subType?: string;
    description?: string;
    urgent: boolean;
    consent: boolean;
    channel?: string;
    docCount: number;
  }): { qualityScore: number; urgencyScore: number; estimatedValue: string } {
    // Quality score (0-100)
    let quality = 55;
    const descLen = data.description?.length || 0;
    quality += Math.min(descLen > 50 ? 10 : Math.floor(descLen / 5), 10);
    quality += Math.min(data.docCount * 5, 15);
    quality += data.consent ? 5 : 0;
    quality += CHANNEL_QUALITY[data.channel || ''] || 3;
    quality = Math.min(quality, 100);

    // Urgency score (0-100)
    let urgency = PRACTICE_URGENCY_BASE[data.practiceArea] || 50;
    urgency += data.urgent ? 25 : 0;
    urgency = Math.min(urgency, 100);

    const estimatedValue = VALUE_ESTIMATES[data.practiceArea] || '$5K–20K';

    return { qualityScore: quality, urgencyScore: urgency, estimatedValue };
  }
}
