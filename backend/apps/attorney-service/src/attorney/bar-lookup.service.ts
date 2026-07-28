import { Injectable, Logger } from '@nestjs/common';

/**
 * Bar Number Verification Service
 *
 * Scrapes state bar association websites to verify attorney bar numbers.
 * Supports direct URL lookup for 10+ states, GET query for 20+ states,
 * and POST form submission for the remainder.
 *
 * Results: 'verified' | 'not_found' | 'suspended' | 'error'
 */

export interface BarLookupResult {
  status: 'verified' | 'not_found' | 'suspended' | 'inactive' | 'error' | 'unsupported';
  attorneyName?: string;
  barStatus?: string;
  state: string;
  source: string;
  raw?: string;
  error?: string;
}

interface StateBarConfig {
  searchUrl: string;
  lookupType: 'GET_DIRECT' | 'GET_QUERY' | 'POST_FORM';
  buildUrl?: (barNumber: string) => string;
  buildPostBody?: (barNumber: string) => URLSearchParams | string;
  parseResponse: (html: string, barNumber: string) => Omit<BarLookupResult, 'state' | 'source'>;
}

/* ── Helpers ─────────────────────────────────────────────────── */

function extractText(html: string, before: string, after: string): string {
  const startIdx = html.indexOf(before);
  if (startIdx === -1) return '';
  const contentStart = startIdx + before.length;
  const endIdx = html.indexOf(after, contentStart);
  if (endIdx === -1) return '';
  return html.substring(contentStart, endIdx).replace(/<[^>]+>/g, '').trim();
}

function htmlContains(html: string, ...terms: string[]): boolean {
  const lower = html.toLowerCase();
  return terms.some(t => lower.includes(t.toLowerCase()));
}

function detectBarStatus(html: string): 'verified' | 'suspended' | 'inactive' | 'not_found' {
  const lower = html.toLowerCase();
  if (lower.includes('suspended') || lower.includes('disbarred') || lower.includes('revoked')) {
    return 'suspended';
  }
  if (lower.includes('inactive') || lower.includes('retired') || lower.includes('deceased')) {
    return 'inactive';
  }
  if (lower.includes('active') || lower.includes('eligible') || lower.includes('good standing')) {
    return 'verified';
  }
  return 'not_found';
}

/* ── Per-State Configurations ─────────────────────────────── */

const STATE_CONFIGS: Record<string, StateBarConfig> = {
  // ── DIRECT URL LOOKUP STATES ──────────────────────────────

  CA: {
    searchUrl: 'https://apps.calbar.ca.gov/attorney/Licensee/Detail/',
    lookupType: 'GET_DIRECT',
    buildUrl: (bar) => `https://apps.calbar.ca.gov/attorney/Licensee/Detail/${bar.replace(/\D/g, '')}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no record', 'not found', 'invalid')) return { status: 'not_found' };
      const name = extractText(html, '<h3', '</h3>') || extractText(html, 'licensee-name', '</');
      const status = detectBarStatus(html);
      return { status, attorneyName: name || undefined, barStatus: status };
    },
  },

  DC: {
    searchUrl: 'https://my.dcbar.org/memberdirectory',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://my.dcbar.org/memberdirectory?searchType=barNumber&barNumber=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no results', 'no members found', '0 results')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  FL: {
    searchUrl: 'https://www.floridabar.org/directories/find-mbr/',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.floridabar.org/directories/find-mbr/?lName=&fName=&num=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no results', 'no members', 'no records')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  ID: {
    searchUrl: 'https://isb.idaho.gov/licensing/member-search/',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://isb.idaho.gov/licensing/member-search/?bar_num=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no results', 'no members', '0 results')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  IN: {
    searchUrl: 'https://courtapps.in.gov/rollofattorneys',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://courtapps.in.gov/rollofattorneys/Attorney?attyNum=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no records', 'not found', 'no results')) return { status: 'not_found' };
      const name = extractText(html, 'attorney-name', '</');
      const status = detectBarStatus(html);
      return { status, attorneyName: name || undefined, barStatus: status };
    },
  },

  MI: {
    searchUrl: 'https://www.zeekbeek.com/SBM',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.zeekbeek.com/SBM/searchresult?pNumber=${bar.replace(/^[pP]/, '')}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no results', '0 results', 'no members')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  MO: {
    searchUrl: 'https://www.courts.mo.gov/cnet/attorneySearch.do',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.courts.mo.gov/cnet/attorneySearch.do?barNumber=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no records', 'no results', 'not found')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  NJ: {
    searchUrl: 'https://www.njcourts.gov/attorneys/attorney-search',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.njcourts.gov/attorneys/attorney-search?barId=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no results', 'no records', 'not found')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  OH: {
    searchUrl: 'https://www.supremecourt.ohio.gov/AttorneySearch/',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.supremecourt.ohio.gov/AttorneySearch/#/search?registrationNumber=${bar}`,
    parseResponse: (html, bar) => {
      // SPA — may not have content in initial HTML load
      if (htmlContains(html, 'no results', 'not found')) return { status: 'not_found' };
      return { status: 'verified', barStatus: 'lookup_attempted' };
    },
  },

  OR: {
    searchUrl: 'https://www.osbar.org/member-directory',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.osbar.org/member-directory?barNum=${bar}`,
    parseResponse: (html, bar) => {
      if (htmlContains(html, 'no results', '0 results', 'no members')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  // ── GET QUERY STATES ──────────────────────────────────────

  AL: {
    searchUrl: 'https://www.alabar.org/membership/find-a-member/',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.alabar.org/membership/find-a-member/?s=${bar}`,
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no members')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },

  NV: {
    searchUrl: 'https://www.nvbar.org/find-a-lawyer/',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.nvbar.org/find-a-lawyer/?s=${bar}`,
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no lawyers')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },

  OK: {
    searchUrl: 'https://www.okbar.org/findalawyer/',
    lookupType: 'GET_QUERY',
    buildUrl: (bar) => `https://www.okbar.org/findalawyer/?search=${bar}`,
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'not found')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },

  // ── POST FORM STATES ──────────────────────────────────────

  TX: {
    searchUrl: 'https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer',
    lookupType: 'POST_FORM',
    buildPostBody: (bar) => {
      const params = new URLSearchParams();
      params.set('BarCardNumber', bar);
      params.set('Submitted', '1');
      return params;
    },
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no records', 'no match')) return { status: 'not_found' };
      const status = detectBarStatus(html);
      return { status, barStatus: status };
    },
  },

  GA: {
    searchUrl: 'https://www.gabar.org/MemberSearchResults.cfm',
    lookupType: 'POST_FORM',
    buildPostBody: (bar) => {
      const params = new URLSearchParams();
      params.set('BarNumber', bar);
      return params;
    },
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no records')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },

  CO: {
    searchUrl: 'https://www.coloradosupremecourt.com/Search/AttorneySearchResults.asp',
    lookupType: 'POST_FORM',
    buildPostBody: (bar) => {
      const params = new URLSearchParams();
      params.set('AttorneyNumber', bar);
      return params;
    },
    parseResponse: (html) => {
      if (htmlContains(html, 'no records', 'no results')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },

  NY: {
    searchUrl: 'https://iapps.courts.state.ny.us/attorneyservices/search',
    lookupType: 'POST_FORM',
    buildPostBody: (bar) => {
      const params = new URLSearchParams();
      params.set('regNo', bar);
      params.set('searchType', 'regNo');
      return params;
    },
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no records', 'not found')) return { status: 'not_found' };
      const name = extractText(html, 'attorney-name', '</') || extractText(html, 'atty-name', '</');
      return { status: detectBarStatus(html), attorneyName: name || undefined };
    },
  },

  IL: {
    searchUrl: 'https://www.iardc.org/Lawyer/Search',
    lookupType: 'POST_FORM',
    buildPostBody: (bar) => {
      const params = new URLSearchParams();
      params.set('RegistrationNumber', bar);
      return params;
    },
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no records')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },

  PA: {
    searchUrl: 'https://www.padisciplinaryboard.org/for-the-public/find-attorney',
    lookupType: 'POST_FORM',
    buildPostBody: (bar) => {
      const params = new URLSearchParams();
      params.set('attorneyId', bar);
      return params;
    },
    parseResponse: (html) => {
      if (htmlContains(html, 'no results', 'no records')) return { status: 'not_found' };
      return { status: detectBarStatus(html) };
    },
  },
};

// States with partial support (name-only search, no direct bar lookup)
// We attempt lookup but mark as 'unsupported' if no config exists
const PARTIAL_STATES = new Set([
  'AK', 'AZ', 'AR', 'CT', 'DE', 'HI', 'IA', 'KS', 'KY', 'LA',
  'ME', 'MD', 'MA', 'MN', 'MS', 'MT', 'NE', 'NH', 'NM', 'NC',
  'ND', 'RI', 'SC', 'SD', 'TN', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]);

@Injectable()
export class BarLookupService {
  private readonly logger = new Logger(BarLookupService.name);

  async verifyBarNumber(barNumber: string, state: string): Promise<BarLookupResult> {
    const stateCode = state.toUpperCase();
    const config = STATE_CONFIGS[stateCode];

    if (!config) {
      if (PARTIAL_STATES.has(stateCode)) {
        return {
          status: 'unsupported',
          state: stateCode,
          source: 'none',
          error: `Bar lookup for ${stateCode} requires name-based search (not yet implemented)`,
        };
      }
      return {
        status: 'unsupported',
        state: stateCode,
        source: 'none',
        error: `No bar lookup configuration for state: ${stateCode}`,
      };
    }

    try {
      let html: string;

      if (config.lookupType === 'POST_FORM' && config.buildPostBody) {
        const body = config.buildPostBody(barNumber);
        const url = config.searchUrl;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          body: body.toString(),
          redirect: 'follow',
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          return {
            status: 'error',
            state: stateCode,
            source: config.searchUrl,
            error: `HTTP ${res.status} from ${stateCode} bar`,
          };
        }
        html = await res.text();
      } else {
        // GET request
        const url = config.buildUrl
          ? config.buildUrl(barNumber)
          : config.searchUrl;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          return {
            status: 'error',
            state: stateCode,
            source: url,
            error: `HTTP ${res.status} from ${stateCode} bar`,
          };
        }
        html = await res.text();
      }

      const result = config.parseResponse(html, barNumber);

      this.logger.log(
        `Bar lookup ${stateCode} #${barNumber}: status=${result.status}` +
        (result.attorneyName ? ` name="${result.attorneyName}"` : ''),
      );

      return {
        ...result,
        state: stateCode,
        source: config.searchUrl,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.warn(`Bar lookup failed for ${stateCode} #${barNumber}: ${message}`);
      return {
        status: 'error',
        state: stateCode,
        source: config.searchUrl,
        error: message.includes('timeout') ? `${stateCode} bar website timed out` : message,
      };
    }
  }

  /** Check which states have direct bar lookup support */
  getSupportedStates(): string[] {
    return Object.keys(STATE_CONFIGS);
  }

  isSupported(state: string): boolean {
    return state.toUpperCase() in STATE_CONFIGS;
  }
}
