"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./icons";
import { Mark, Logo } from "./ui";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-selector";

/* ===== MarketingNav ===== */
export function MarketingNav({ audience = "home" }: { audience?: "home" | "client" | "attorney" }) {
  const router = useRouter();
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.querySelector("#m-scroll") as HTMLElement | null;
    const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 20);
    const target: HTMLElement | Window = el || window;
    target.addEventListener("scroll", onScroll);
    return () => target.removeEventListener("scroll", onScroll);
  }, []);
  const loginDest = audience === "client" ? "/client/login" : audience === "attorney" ? "/attorney/login" : "/login";
  const startDest = audience === "client" ? "/client/signup" : audience === "attorney" ? "/attorney/signup" : "/get-started";
  const links: [string, string][] = [[t.nav.home, "/"], [t.nav.forClients, "/for-clients"], [t.nav.forAttorneys, "/for-attorneys"]];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(246,248,252,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "background .35s, border-color .35s, backdrop-filter .35s",
    }}>
      <div className="wrap row between" style={{ height: 64 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Logo size={28} />
        </Link>
        <div className="row m-nav-links" style={{ gap: 6 }}>
          {links.map(([label, path]) => (
            <Link key={path} href={path}
              style={{ padding: "8px 16px", fontSize: 14.5, fontWeight: 500, color: "var(--text-2)", borderRadius: "var(--r-sm)", transition: "color .2s, background .2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--ink)"; (e.target as HTMLElement).style.background = "var(--pine-tint)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--text-2)"; (e.target as HTMLElement).style.background = "transparent"; }}
            >{label}</Link>
          ))}
        </div>
        <div className="row" style={{ gap: 10 }}>
          <LanguageSwitcher />
          <button className="btn btn-ghost btn-sm" onClick={() => router.push(loginDest)}>{t.nav.logIn}</button>
          <button className="btn btn-signal btn-sm" onClick={() => router.push(startDest)}>{t.nav.startFreeTrial}</button>
        </div>
      </div>
    </nav>
  );
}

/* ===== HeroTagCloud ===== */
const TAG_ITEMS = [
  "Personal Injury", "Criminal Law", "Immigration", "Family Law", "Employment Law",
  "Auto Accidents", "DUI / DWI", "Custody", "Asylum", "Wrongful Termination",
];

export function HeroTagCloud() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520, height: 320, margin: "0 auto" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
        <Mark size={64} live />
      </div>
      {TAG_ITEMS.map((tag, i) => {
        const angle = (i / TAG_ITEMS.length) * 2 * Math.PI - Math.PI / 2;
        const rx = 200, ry = 130;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        return (
          <span key={tag} className="rise" style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-pill)",
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-2)",
            whiteSpace: "nowrap",
            boxShadow: "var(--sh-sm)",
            animationDelay: `${i * 0.06}s`,
            zIndex: 1,
          }}>
            {tag}
          </span>
        );
      })}
    </div>
  );
}

/* ===== Step ===== */
export function Step({ n, icon, title, desc, accent }: { n: number; icon: string; title: string; desc: string; accent?: string }) {
  return (
    <div className="stack" style={{ gap: 16, flex: 1 }}>
      <div className="row between">
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: accent || "var(--pine-tint)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name={icon} size={24} color="var(--pine)" />
        </div>
        <span className="display" style={{ fontSize: 44, color: "var(--line-2)", lineHeight: 1 }}>0{n}</span>
      </div>
      <h3 style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</h3>
      <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

/* ===== Pricing ===== */
export function Pricing() {
  const router = useRouter();
  const { t: tr } = useI18n();
  const [mode, setMode] = useState<"sub" | "ppl">("sub");

  const SUB_TIERS = [
    {
      name: tr.pricingTiers.entry, price: "$49-$79", period: "/lead", desc: tr.pricingTiers.entryDesc,
      features: [tr.pricingTiers.basicIntake, tr.pricingTiers.clientMessaging, tr.pricingTiers.caseNotes, tr.pricingTiers.basicAnalytics, tr.pricingTiers.limitedLeads],
      cta: tr.nav.startFreeTrial, highlight: false, isSales: false,
    },
    {
      name: tr.pricingTiers.growth, price: "$149-$249", period: "/lead", desc: tr.pricingTiers.growthDesc,
      features: [tr.pricingTiers.everythingInEntry, tr.pricingTiers.smartIntakeAutomation, tr.pricingTiers.eSignature, tr.pricingTiers.unlimitedLeads, tr.pricingTiers.dashboardAnalytics, tr.pricingTiers.referralAccess],
      cta: tr.nav.startFreeTrial, highlight: true, isSales: false,
    },
    {
      name: tr.pricingTiers.premium, price: "$399-$699", period: "/lead", desc: tr.pricingTiers.premiumDesc,
      features: [tr.pricingTiers.everythingInGrowth, tr.pricingTiers.aiDocSummarization, tr.pricingTiers.advancedAnalytics, tr.pricingTiers.teamManagement, tr.pricingTiers.customTemplates, tr.pricingTiers.apiAccess, tr.pricingTiers.clientPortal],
      cta: tr.pricingTiers.contactSales, highlight: false, isSales: true,
    },
    {
      name: tr.pricingTiers.optionalLeads, price: "Area-based", period: "", desc: tr.pricingTiers.optionalLeadsDesc,
      features: ["PI: $89-$200 per lead", "Immigration: $39-$60 per lead", "Family Law: $30-$80 per lead", "Criminal Law: $40-$120 per lead"],
      cta: tr.nav.bookADemo, highlight: false, isSales: true,
    },
  ];

  const PPL_TIERS = [
    {
      name: tr.caseTypes.injury, price: "$89-$200", period: "/lead", desc: "High-value injury leads with documents and liability screening.",
      features: ["Incident timeline", "Police report and photo prompts", "Medical treatment indicators", "Insurance and liability checks"],
      cta: tr.nav.getStarted, highlight: false, isSales: false,
    },
    {
      name: tr.caseTypes.immigration + " + " + tr.caseTypes.family, price: "$30-$80", period: "/lead", desc: "Qualified status, safety, hearing, and family-complexity leads.",
      features: ["Immigration status screening", "Safe-contact prompts", "Court-date urgency", "Document upload checklist"],
      cta: tr.nav.getStarted, highlight: true, isSales: false,
    },
    {
      name: tr.caseTypes.criminal + " + " + tr.caseTypes.employment, price: "$40-$120", period: "/lead", desc: "Urgent defense and workplace leads routed by deadlines.",
      features: ["Custody and hearing flags", "Charge and court details", "Workplace evidence prompts", "Immediate alert routing"],
      cta: tr.pricingTiers.contactSales, highlight: false, isSales: true,
    },
  ];

  const tiers = mode === "sub" ? SUB_TIERS : PPL_TIERS;

  return (
    <div className="stack" style={{ gap: 40, alignItems: "center" }}>
      {/* Toggle */}
      <div className="row" style={{
        background: "var(--paper-2)", borderRadius: "var(--r-pill)", padding: 4, gap: 2,
      }}>
        <button onClick={() => setMode("sub")} style={{
          padding: "10px 24px", borderRadius: "var(--r-pill)", fontSize: 14, fontWeight: 600,
          background: mode === "sub" ? "var(--card)" : "transparent",
          color: mode === "sub" ? "var(--ink)" : "var(--text-3)",
          boxShadow: mode === "sub" ? "var(--sh-sm)" : "none",
          transition: "all .2s",
          border: "none", cursor: "pointer",
        }}>
          {tr.pricing.packages}
        </button>
        <button onClick={() => setMode("ppl")} style={{
          padding: "10px 24px", borderRadius: "var(--r-pill)", fontSize: 14, fontWeight: 600,
          background: mode === "ppl" ? "var(--card)" : "transparent",
          color: mode === "ppl" ? "var(--ink)" : "var(--text-3)",
          boxShadow: mode === "ppl" ? "var(--sh-sm)" : "none",
          transition: "all .2s",
          border: "none", cursor: "pointer",
        }}>
          {tr.pricing.practiceAreaLeads}
        </button>
      </div>

      {/* Cards */}
      <div className="pricing-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, width: "100%",
      }}>
        {tiers.map((t) => (
          <div key={t.name} className="card stack" style={{
            padding: 32, gap: 24, position: "relative", overflow: "hidden",
            border: t.highlight ? "2px solid var(--signal)" : "1px solid var(--line)",
          }}>
            {t.highlight && (
              <div style={{
                position: "absolute", top: 16, right: -32,
                background: "var(--signal)", color: "#fff",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "5px 40px", transform: "rotate(45deg)",
              }}>
                {tr.pricingTiers.popular}
              </div>
            )}
            <div className="stack" style={{ gap: 8 }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>{t.name}</span>
              <div className="row" style={{ alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1 }}>{t.price}</span>
                {t.period && <span style={{ fontSize: 15, color: "var(--text-3)" }}>{t.period}</span>}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-2)" }}>{t.desc}</p>
            </div>
            <div className="stack" style={{ gap: 12 }}>
              {t.features.map((f) => (
                <div key={f} className="row" style={{ gap: 10 }}>
                  <Icon name="check" size={16} color="var(--verified)" stroke={2.5} />
                  <span style={{ fontSize: 14, color: "var(--text-1)" }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              className={`btn ${t.highlight ? "btn-signal" : "btn-ghost"}`}
              style={{ width: "100%", marginTop: "auto" }}
              onClick={() => router.push(t.isSales ? "/demo" : "/get-started")}
            >
              {t.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== FAQ ===== */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { t: tr } = useI18n();

  const FAQ_ITEMS = [
    { q: tr.faq.q1, a: tr.faq.a1 },
    { q: tr.faq.q2, a: tr.faq.a2 },
    { q: tr.faq.q3, a: tr.faq.a3 },
    { q: tr.faq.q4, a: tr.faq.a4 },
    { q: tr.faq.q5, a: tr.faq.a5 },
    { q: tr.faq.q6, a: tr.faq.a6 },
  ];

  return (
    <div className="stack" style={{ gap: 2, maxWidth: 720, margin: "0 auto", width: "100%" }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} style={{
          borderBottom: "1px solid var(--line)",
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="row between"
            style={{
              width: "100%", padding: "20px 0", textAlign: "left",
              cursor: "pointer", background: "none", border: "none",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", flex: 1 }}>{item.q}</span>
            <Icon name={open === i ? "chevD" : "chevR"} size={18} color="var(--text-3)" />
          </button>
          <div style={{
            maxHeight: open === i ? 200 : 0,
            overflow: "hidden",
            transition: "max-height .35s var(--ease)",
          }}>
            <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7, paddingBottom: 20 }}>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Footer ===== */
export function Footer() {
  const { t: tr } = useI18n();
  return (
    <footer style={{
      background: "var(--pine-deep)", color: "var(--on-pine)", padding: "72px 0 40px",
    }}>
      <div className="wrap">
        <div className="footer-grid" style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48,
        }}>
          {/* Brand col */}
          <div className="stack" style={{ gap: 18 }}>
            <Link href="/" aria-label="Go to home" style={{ display: "flex", alignSelf: "flex-start" }}>
              <Logo light size={26} sub />
            </Link>
            <p style={{ fontSize: 14, color: "rgba(234,240,249,0.55)", lineHeight: 1.7, maxWidth: 280 }}>
              {tr.footer.tagline}
            </p>
          </div>
          {/* Product col */}
          <div className="stack" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,240,249,0.4)", marginBottom: 4 }}>{tr.footer.product}</span>
            {[
              [tr.nav.forAttorneys, "/for-attorneys"],
              [tr.nav.forClients, "/for-clients"],
              [tr.forAttorneys.pricing, "/pricing"],
              ["Integrations", "/for-attorneys"],
            ].map(([label, href]) => (
              <Link key={href + label} href={href} className="foot-link" style={{ fontSize: 14, color: "rgba(234,240,249,0.7)", transition: "color .2s" }}>{label}</Link>
            ))}
          </div>
          {/* Company col */}
          <div className="stack" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,240,249,0.4)", marginBottom: 4 }}>{tr.footer.company}</span>
            {[
              [tr.footer.about, "/"],
              [tr.footer.careers, "/"],
              [tr.footer.blog, "/"],
              [tr.footer.contact, "/demo"],
            ].map(([label, href]) => (
              <Link key={href + label} href={href} className="foot-link" style={{ fontSize: 14, color: "rgba(234,240,249,0.7)", transition: "color .2s" }}>{label}</Link>
            ))}
          </div>
          {/* Legal col */}
          <div className="stack" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,240,249,0.4)", marginBottom: 4 }}>{tr.footer.legal}</span>
            {[
              [tr.footer.privacyPolicy, "/"],
              [tr.footer.termsOfService, "/"],
              [tr.footer.barCompliance, "/"],
            ].map(([label, href]) => (
              <Link key={href + label} href={href} className="foot-link" style={{ fontSize: 14, color: "rgba(234,240,249,0.7)", transition: "color .2s" }}>{label}</Link>
            ))}
          </div>
        </div>
        {/* Bottom */}
        <div className="row between" style={{
          marginTop: 56, paddingTop: 24,
          borderTop: "1px solid rgba(234,240,249,0.1)",
        }}>
          <span style={{ fontSize: 13, color: "rgba(234,240,249,0.35)" }}>
            &copy; 2026 ClientSignal, Inc. {tr.footer.allRightsReserved}
          </span>
          <div className="row" style={{ gap: 20 }}>
            <span style={{ fontSize: 13, color: "rgba(234,240,249,0.35)" }}>SOC 2 Type II</span>
            <span style={{ fontSize: 13, color: "rgba(234,240,249,0.35)" }}>{tr.footer.abaCompliant}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
