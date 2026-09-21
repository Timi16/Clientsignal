#!/usr/bin/env node
/* Downloads a logo for every connector into public/connectors/ and writes
   src/lib/connector-logos.json (the list the UI uses to decide logo vs.
   initials tile). Re-run after adding a connector:

     node scripts/fetch-connector-logos.mjs            # only missing logos
     node scripts/fetch-connector-logos.mjs --force    # re-download everything

   Add the new connector's website to DOMAINS below first. */

import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/connectors");
const MANIFEST = path.join(ROOT, "src/lib/connector-logos.json");
const FORCE = process.argv.includes("--force");
const MIN_PX = 48; // anything smaller looks blurry in a 44–48px tile on retina

/* Keep in sync with connectorSlug() in src/lib/connectors.ts */
export const slug = (name) => name.toLowerCase().replace(/&/g, " and ").replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Connector name -> website. Generic entries (SMS, Webhooks) are left out on purpose. */
const DOMAINS = {
  // practice management
  "Clio": "clio.com", "MyCase": "mycase.com", "PracticePanther": "practicepanther.com", "Smokeball": "smokeball.com",
  "Filevine": "filevine.com", "Litify": "litify.com", "CASEpeer": "casepeer.com", "Rocket Matter": "rocketmatter.com",
  "CosmoLex": "cosmolex.com", "CARET Legal": "caretlegal.com", "Actionstep": "actionstep.com", "LEAP": "leap.us",
  "SmartAdvocate": "smartadvocate.com", "Neos": "assemblysoftware.com", "CloudLex": "cloudlex.com", "Centerbase": "centerbase.com",
  // crm & intake
  "Lawmatics": "lawmatics.com", "Law Ruler": "lawruler.com", "Lead Docket": "leaddocket.com", "Salesforce": "salesforce.com",
  "HubSpot": "hubspot.com", "Zoho CRM": "zoho.com", "Pipedrive": "pipedrive.com", "Intaker": "intaker.com",
  "Typeform": "typeform.com", "Jotform": "jotform.com",
  // reception
  "Smith.ai": "smith.ai", "Ruby": "ruby.com", "CallRail": "callrail.com", "LEX Reception": "lexreception.com",
  "Answering Legal": "answeringlegal.com", "Posh": "posh.com",
  // e-signature
  "DocuSign": "docusign.com", "Dropbox Sign": "sign.dropbox.com", "Adobe Acrobat Sign": "acrobat.adobe.com",
  "PandaDoc": "pandadoc.com", "SignNow": "signnow.com",
  // documents
  "Google Drive": "drive.google.com", "Dropbox": "dropbox.com", "Box": "box.com", "OneDrive": "onedrive.live.com",
  "SharePoint": "sharepoint.com", "NetDocuments": "netdocuments.com", "iManage": "imanage.com", "Notion": "notion.so",
  "iCloud Drive": "icloud.com", "Google Photos": "photos.google.com", "iCloud Photos": "icloud.com",
  // calendar
  "Calendly": "calendly.com", "Google Calendar": "calendar.google.com", "Outlook Calendar": "outlook.live.com",
  "Acuity Scheduling": "acuityscheduling.com", "Cal.com": "cal.com", "LawTap": "lawtap.com", "Apple Calendar": "icloud.com",
  // communication
  "Twilio": "twilio.com", "Slack": "slack.com", "Microsoft Teams": "teams.microsoft.com", "Zoom": "zoom.us",
  "Google Meet": "meet.google.com", "Gmail": "mail.google.com", "Outlook": "outlook.live.com", "RingCentral": "ringcentral.com",
  "Dialpad": "dialpad.com", "OpenPhone": "openphone.com", "WhatsApp Business": "business.whatsapp.com", "WhatsApp": "whatsapp.com",
  "Case Status": "casestatus.com", "Telegram": "telegram.org", "Messenger": "messenger.com", "Yahoo Mail": "mail.yahoo.com",
  "FaceTime": "facetime.apple.com",
  // billing & payments
  "LawPay": "lawpay.com", "Stripe": "stripe.com", "QuickBooks Online": "quickbooks.intuit.com", "Xero": "xero.com",
  "Confido Legal": "confidolegal.com", "Headnote": "headnote.com", "TimeSolv": "timesolv.com", "Bill4Time": "bill4time.com",
  "Affirm": "affirm.com", "Apple Pay": "apple.com", "Google Pay": "pay.google.com", "PayPal": "paypal.com",
  "Plaid": "plaid.com", "Klarna": "klarna.com",
  // research
  "Westlaw": "westlaw.com", "Lexis+": "lexisnexis.com", "Fastcase": "fastcase.com", "CoCounsel": "casetext.com",
  "vLex": "vlex.com", "CourtListener": "courtlistener.com", "Trellis": "trellis.law", "Bloomberg Law": "bloomberglaw.com",
  // courts
  "PACER": "pacer.uscourts.gov", "Docket Alarm": "docketalarm.com", "One Legal": "onelegal.com",
  "File & ServeXpress": "fileandservexpress.com", "InfoTrack": "infotrack.com", "Odyssey eFile": "tylertech.com",
  "ABC Legal": "abclegal.com", "LawToolBox": "lawtoolbox.com",
  // immigration
  "Docketwise": "docketwise.com", "INSZoom": "inszoom.com", "LollyLaw": "lollylaw.com", "eImmigration": "eimmigration.com",
  // marketing
  "Google Ads": "ads.google.com", "Meta Ads": "meta.com", "Google Analytics": "analytics.google.com",
  "Google Business Profile": "business.google.com", "Mailchimp": "mailchimp.com", "Birdeye": "birdeye.com",
  "Avvo": "avvo.com", "Martindale-Hubbell": "martindale.com",
  // automation
  "Zapier": "zapier.com", "Make": "make.com", "n8n": "n8n.io", "Power Automate": "powerautomate.microsoft.com",
  // client: identity, records, scanning
  "ID.me": "id.me", "Persona": "withpersona.com", "CLEAR": "clearme.com",
  "MyChart": "mychart.org", "Apple Health Records": "apple.com", "ADP": "adp.com", "Gusto": "gusto.com",
  "Workday": "workday.com", "Paychex": "paychex.com", "USCIS Case Status": "uscis.gov", "CBP I-94": "cbp.gov",
  "EOIR Case Status": "justice.gov", "Uber": "uber.com", "Lyft": "lyft.com", "Credit Karma": "creditkarma.com",
  "Adobe Scan": "adobe.com", "Microsoft Lens": "microsoft.com", "Genius Scan": "thegrizzlylabs.com", "CamScanner": "camscanner.com",
};

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

/** Width of a PNG from its IHDR chunk, or 0 if the buffer isn't a PNG */
function pngWidth(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return 0;
  return buf.readUInt32BE(16);
}

async function get(url, tries = 3) {
  for (let t = 0; t < tries; t++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA, accept: "*/*" }, redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (res.status === 429 || res.status >= 500) { await new Promise(r => setTimeout(r, 1500 * (t + 1))); continue; }
      return res.ok ? res : null;
    } catch {
      await new Promise(r => setTimeout(r, 800 * (t + 1)));
    }
  }
  return null;
}

async function tryPng(url) {
  const res = await get(url);
  if (!res) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  const w = pngWidth(buf);
  return w >= MIN_PX ? { buf, w, url } : null;
}

/** PNG icons the site itself declares: <link rel="apple-touch-icon|icon" href="...png"> */
async function declaredIcons(domain) {
  const res = await get(`https://${domain}/`, 1);
  if (!res) return [];
  const html = (await res.text()).slice(0, 400000);
  const out = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/rel=["'][^"']*icon[^"']*["']/i.test(tag)) continue;
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href || !/\.png(\?|$)/i.test(href)) continue;
    try { out.push({ url: new URL(href, res.url).href, apple: /apple-touch/i.test(tag) }); } catch {}
  }
  return out.sort((a, b) => Number(b.apple) - Number(a.apple)).map(o => o.url).slice(0, 5);
}

async function fetchLogo(domain) {
  const bare = domain.replace(/^www\./, "");
  let best = null;
  const consider = async (url) => {
    const hit = await tryPng(url);
    if (hit && (!best || hit.w > best.w)) best = hit;
    return best && best.w >= 120;
  };
  if (await consider(`https://www.google.com/s2/favicons?domain=${bare}&sz=256`)) return best;
  if (await consider(`https://${bare}/apple-touch-icon.png`)) return best;
  for (const url of await declaredIcons(bare)) if (await consider(url)) return best;
  return best;
}

await mkdir(OUT, { recursive: true });
const report = { ok: [], skipped: [], failed: [] };
const entries = Object.entries(DOMAINS);

for (let i = 0; i < entries.length; i += 4) {
  await Promise.all(entries.slice(i, i + 4).map(async ([name, domain]) => {
    const file = path.join(OUT, `${slug(name)}.png`);
    if (!FORCE && existsSync(file)) return report.skipped.push(name);
    const logo = await fetchLogo(domain);
    if (!logo) return report.failed.push(`${name} (${domain})`);
    await writeFile(file, logo.buf);
    report.ok.push(`${name} ${logo.w}px`);
  }));
}

const slugs = (await readdir(OUT)).filter(f => f.endsWith(".png")).map(f => f.slice(0, -4)).sort();
await writeFile(MANIFEST, JSON.stringify(slugs, null, 2) + "\n");

console.log(`downloaded ${report.ok.length}, already had ${report.skipped.length}, failed ${report.failed.length}`);
if (report.failed.length) console.log("no usable logo (initials tile will be used):\n  " + report.failed.join("\n  "));
console.log(`manifest: ${slugs.length} logos -> ${path.relative(ROOT, MANIFEST)}`);
