"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./icons";
import { Mark, Logo } from "./ui";

/* ===== MarketingNav ===== */
export function MarketingNav({ audience = "home" }: { audience?: "home" | "client" | "attorney" }) {
  const router = useRouter();
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
  const links: [string, string][] = [["Home", "/"], ["For Clients", "/for-clients"], ["For Attorneys", "/for-attorneys"]];

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
            <Link key={label} href={path}
              style={{ padding: "8px 16px", fontSize: 14.5, fontWeight: 500, color: "var(--text-2)", borderRadius: "var(--r-sm)", transition: "color .2s, background .2s" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--ink)"; (e.target as HTMLElement).style.background = "var(--pine-tint)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--text-2)"; (e.target as HTMLElement).style.background = "transparent"; }}
            >{label}</Link>
          ))}
        </div>
        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push(loginDest)}>Log in</button>
          <button className="btn btn-signal btn-sm" onClick={() => router.push(startDest)}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}

/* ===== HeroTagCloud ===== */
const TAG_ITEMS = [
  "Personal Injury", "DUI Defense", "Immigration", "Family Law", "Employment", "Business",
  "Estate Planning", "Real Estate", "Tax Law", "Bankruptcy", "Medical Malpractice", "Workers' Comp",
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
const SUB_TIERS = [
  {
    name: "Starter", price: "$149", period: "/mo", desc: "For solo practitioners testing the waters.",
    features: ["Up to 15 leads / month", "Email + SMS alerts", "Lead scoring", "Basic CRM sync", "Email support"],
    cta: "Start free trial", highlight: false,
  },
  {
    name: "Growth", price: "$349", period: "/mo", desc: "For growing firms ready to scale intake.",
    features: ["Up to 60 leads / month", "Priority matching", "Advanced scoring & analytics", "Full CRM integrations", "Dedicated Slack channel", "Custom intake builder"],
    cta: "Start free trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "", desc: "For multi-attorney firms with volume needs.",
    features: ["Unlimited leads", "SLA-backed routing", "API access & webhooks", "White-label intake forms", "Quarterly business reviews", "Dedicated account manager"],
    cta: "Contact sales", highlight: false,
  },
];

const PPL_TIERS = [
  {
    name: "Basic", price: "$75", period: "/lead", desc: "Pay only when you accept a lead.",
    features: ["No monthly commitment", "Verified & exclusive leads", "Lead scoring", "Email alerts", "Basic dashboard"],
    cta: "Get started", highlight: false,
  },
  {
    name: "Pro", price: "$55", period: "/lead", desc: "Committed volume, lower cost per lead.",
    features: ["10-lead minimum / month", "Priority matching", "Full analytics", "CRM integrations", "SMS + email alerts", "Intake builder"],
    cta: "Get started", highlight: true,
  },
  {
    name: "Volume", price: "$40", period: "/lead", desc: "High-volume firms with dedicated routing.",
    features: ["30+ leads / month", "SLA-backed delivery", "API access", "Custom routing rules", "Account manager", "Quarterly reviews"],
    cta: "Contact sales", highlight: false,
  },
];

export function Pricing() {
  const router = useRouter();
  const [mode, setMode] = useState<"sub" | "ppl">("sub");
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
          Subscription
        </button>
        <button onClick={() => setMode("ppl")} style={{
          padding: "10px 24px", borderRadius: "var(--r-pill)", fontSize: 14, fontWeight: 600,
          background: mode === "ppl" ? "var(--card)" : "transparent",
          color: mode === "ppl" ? "var(--ink)" : "var(--text-3)",
          boxShadow: mode === "ppl" ? "var(--sh-sm)" : "none",
          transition: "all .2s",
          border: "none", cursor: "pointer",
        }}>
          Pay per lead
        </button>
      </div>

      {/* Cards */}
      <div className="pricing-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, width: "100%",
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
                Popular
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
              onClick={() => router.push(t.cta === "Contact sales" ? "/demo" : "/get-started")}
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
const FAQ_ITEMS = [
  { q: "How are leads generated?", a: "Leads come from clients who submit their case details through our verified intake system. Every lead is real, consent-verified, and exclusive to one attorney." },
  { q: "Are leads shared with other attorneys?", a: "No. Every lead on ClientSignal is exclusive. Once a lead is matched to your firm, no other attorney will receive it." },
  { q: "What practice areas do you cover?", a: "We currently cover Personal Injury, Family Law, Criminal Defense, Immigration, Employment Law, and Business & Contracts, with more areas launching soon." },
  { q: "How does the scoring system work?", a: "Our AI scores each lead on quality (case strength, documentation, urgency) and match fit (practice area, location, firm capacity). You see the score before you accept." },
  { q: "Can I cancel anytime?", a: "Yes. Subscription plans are month-to-month with no long-term contracts. Pay-per-lead plans have no commitment at all." },
  { q: "How do CRM integrations work?", a: "We integrate with Clio, MyCase, Lawmatics, and 6,000+ apps via Zapier. Accepted leads sync automatically as new matters or contacts." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

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
              The modern intake and lead-routing platform for attorneys.
              Verified leads, scored cases, delivered instantly.
            </p>
          </div>
          {/* Product col */}
          <div className="stack" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,240,249,0.4)", marginBottom: 4 }}>Product</span>
            {[
              ["For Attorneys", "/for-attorneys"],
              ["For Clients", "/for-clients"],
              ["Pricing", "/pricing"],
              ["Integrations", "/for-attorneys"],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="foot-link" style={{ fontSize: 14, color: "rgba(234,240,249,0.7)", transition: "color .2s" }}>{label}</Link>
            ))}
          </div>
          {/* Company col */}
          <div className="stack" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,240,249,0.4)", marginBottom: 4 }}>Company</span>
            {[
              ["About", "/"],
              ["Careers", "/"],
              ["Blog", "/"],
              ["Contact", "/demo"],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="foot-link" style={{ fontSize: 14, color: "rgba(234,240,249,0.7)", transition: "color .2s" }}>{label}</Link>
            ))}
          </div>
          {/* Legal col */}
          <div className="stack" style={{ gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(234,240,249,0.4)", marginBottom: 4 }}>Legal</span>
            {[
              ["Privacy Policy", "/"],
              ["Terms of Service", "/"],
              ["Bar Compliance", "/"],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="foot-link" style={{ fontSize: 14, color: "rgba(234,240,249,0.7)", transition: "color .2s" }}>{label}</Link>
            ))}
          </div>
        </div>
        {/* Bottom */}
        <div className="row between" style={{
          marginTop: 56, paddingTop: 24,
          borderTop: "1px solid rgba(234,240,249,0.1)",
        }}>
          <span style={{ fontSize: 13, color: "rgba(234,240,249,0.35)" }}>
            &copy; 2026 ClientSignal, Inc. All rights reserved.
          </span>
          <div className="row" style={{ gap: 20 }}>
            <span style={{ fontSize: 13, color: "rgba(234,240,249,0.35)" }}>SOC 2 Type II</span>
            <span style={{ fontSize: 13, color: "rgba(234,240,249,0.35)" }}>ABA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
