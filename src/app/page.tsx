"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Mark, Logo, ScoreRing, Verified, Avatar, Photo, CaseTag } from "@/components/ui";
import { LEADS, TESTIMONIALS, CASE_TYPES } from "@/lib/data";
import { MarketingNav, Step, Footer } from "@/components/marketing";

/* ===== HomeProductPreview (fake app window with lead inbox) ===== */
function HomeProductPreview() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % LEADS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const lead = LEADS[active];
  const ct = CASE_TYPES[lead.type] || { label: lead.type, color: "var(--text-2)", tint: "var(--pine-tint)" };

  return (
    <div className="card rise" style={{
      borderRadius: 18, overflow: "hidden",
      boxShadow: "var(--sh-lg)", maxWidth: 540, width: "100%",
      animationDelay: ".2s",
    }}>
      {/* Title bar */}
      <div className="row between" style={{
        padding: "12px 18px", borderBottom: "1px solid var(--line)",
        background: "var(--paper)",
      }}>
        <div className="row" style={{ gap: 8 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>Lead Inbox</span>
        <div style={{ width: 40 }} />
      </div>
      {/* Lead list */}
      <div style={{ padding: 0 }}>
        {LEADS.slice(0, 4).map((l, i) => {
          const ct2 = CASE_TYPES[l.type] || { label: l.type, color: "var(--text-2)", tint: "var(--pine-tint)" };
          return (
            <div key={l.id}
              onClick={() => setActive(i)}
              className="row"
              style={{
                padding: "14px 18px", gap: 14,
                cursor: "pointer",
                background: i === active ? "var(--signal-tint)" : "var(--card)",
                borderBottom: "1px solid var(--line)",
                transition: "background .2s",
              }}
            >
              <Avatar name={l.name} size={38} />
              <div className="stack" style={{ flex: 1, gap: 3, minWidth: 0 }}>
                <div className="row between">
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{l.name}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{l.time}</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span className="pill" style={{
                    background: ct2.tint, color: ct2.color,
                    padding: "3px 9px", fontSize: 11,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ct2.color }} />
                    {ct2.label}
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.city}
                  </span>
                </div>
              </div>
              <ScoreRing value={l.quality} size={40} stroke={4} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== TrustStrip ===== */
function TrustStrip() {
  const badges = [
    { icon: "shield", text: "ABA Compliant" },
    { icon: "lock", text: "SOC 2 Type II" },
    { icon: "check", text: "Exclusive Leads" },
    { icon: "bolt", text: "< 3 min Delivery" },
    { icon: "star", text: "4.9 Attorney Rating" },
  ];
  return (
    <div className="row" style={{
      justifyContent: "center", gap: 40,
      padding: "28px 0",
      borderTop: "1px solid var(--line)",
      borderBottom: "1px solid var(--line)",
      flexWrap: "wrap",
    }}>
      {badges.map((b) => (
        <div key={b.text} className="row" style={{ gap: 9 }}>
          <Icon name={b.icon} size={18} color="var(--text-3)" />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.02em" }}>{b.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ===== Testimonial Card ===== */
function TestimonialCard({ t, i }: { t: typeof TESTIMONIALS[0]; i: number }) {
  return (
    <div className="tcard card stack" style={{
      overflow: "hidden", flex: "none", width: 340,
      animationDelay: `${i * 0.12}s`,
    }}>
      <Photo src={t.photo} name={t.name} w="100%" h={220} radius={0} kenburns />
      <div className="stack" style={{ padding: "22px 24px", gap: 14, flex: 1 }}>
        <div className="row" style={{ gap: 3 }}>
          {Array.from({ length: t.stars }).map((_, j) => (
            <Icon key={j} name="star" size={15} color="var(--gold)" />
          ))}
        </div>
        <p style={{ fontSize: 14.5, color: "var(--text-1)", lineHeight: 1.65, fontStyle: "italic", flex: 1 }}>
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="stack" style={{ gap: 3 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{t.name}</span>
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{t.role}</span>
        </div>
      </div>
    </div>
  );
}

/* ===== Page ===== */
export default function HomePage() {
  const router = useRouter();

  return (
    <div id="m-scroll" style={{ height: "100vh", overflow: "auto" }}>
      <MarketingNav audience="home" />

      {/* Hero */}
      <section style={{ padding: "80px 0 60px", background: "var(--paper)" }}>
        <div className="wrap hero-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
        }}>
          <div className="stack rise" style={{ gap: 28 }}>
            <div className="row" style={{ gap: 8 }}>
              <span className="pulse-dot" />
              <span className="mono" style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--signal)" }}>Now accepting attorneys</span>
            </div>
            <h1 className="display" style={{ fontSize: 52, color: "var(--ink)" }}>
              Legal leads,<br />routed in <span style={{ color: "var(--signal)" }}>seconds</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 480 }}>
              ClientSignal matches verified clients with licensed attorneys instantly.
              AI-scored intake, exclusive leads, and seamless CRM delivery.
            </p>
            <div className="row" style={{ gap: 14 }}>
              <button className="btn btn-signal btn-lg" onClick={() => router.push("/get-started")}>
                Get Started <Icon name="arrowR" size={18} />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => router.push("/demo")}>
                Book a Demo
              </button>
            </div>
          </div>
          <HomeProductPreview />
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: "var(--card)" }}>
        <div className="wrap">
          <TrustStrip />
        </div>
      </section>

      {/* Two paths */}
      <section style={{ padding: "88px 0", background: "var(--card)" }}>
        <div className="wrap stack" style={{ gap: 56, alignItems: "center" }}>
          <div className="stack" style={{ textAlign: "center", gap: 14, maxWidth: 560 }}>
            <span className="eyebrow" style={{ color: "var(--signal)" }}>Two sides, one platform</span>
            <h2 className="display" style={{ fontSize: 38, color: "var(--ink)" }}>Built for both sides of legal</h2>
            <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.7 }}>
              Whether you need an attorney or you are one, ClientSignal connects you faster than anything else.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, width: "100%" }}>
            {/* Client card */}
            <div className="card feat-card stack" style={{ padding: 40, gap: 22 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "var(--blue-tint)", display: "grid", placeItems: "center",
              }}>
                <Icon name="user" size={26} color="var(--signal)" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>For Clients</h3>
              <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.65 }}>
                Describe your legal situation once. Get matched with a licensed, vetted attorney in your area within minutes — not days.
              </p>
              <ul className="stack" style={{ gap: 10 }}>
                {["Free to submit your case", "Verified, licensed attorneys only", "Secure, encrypted communication", "Track your case in real time"].map(f => (
                  <li key={f} className="row" style={{ gap: 10 }}>
                    <Icon name="check" size={16} color="var(--verified)" stroke={2.5} />
                    <span style={{ fontSize: 14, color: "var(--text-1)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="btn btn-signal" style={{ alignSelf: "flex-start", marginTop: 6 }} onClick={() => router.push("/for-clients")}>
                Learn more <Icon name="arrowR" size={16} />
              </button>
            </div>
            {/* Attorney card */}
            <div className="card feat-card stack" style={{ padding: 40, gap: 22 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "var(--gold-tint)", display: "grid", placeItems: "center",
              }}>
                <Icon name="scale" size={26} color="var(--gold-deep)" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>For Attorneys</h3>
              <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.65 }}>
                Stop chasing cold leads. Receive pre-screened, AI-scored clients matched to your practice area and location.
              </p>
              <ul className="stack" style={{ gap: 10 }}>
                {["Exclusive — leads are never shared", "AI quality scoring before you accept", "Instant CRM sync (Clio, MyCase, etc.)", "Verified client consent & documents"].map(f => (
                  <li key={f} className="row" style={{ gap: 10 }}>
                    <Icon name="check" size={16} color="var(--verified)" stroke={2.5} />
                    <span style={{ fontSize: 14, color: "var(--text-1)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button className="btn btn-pine" style={{ alignSelf: "flex-start", marginTop: 6 }} onClick={() => router.push("/for-attorneys")}>
                Learn more <Icon name="arrowR" size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (dark) */}
      <section style={{
        padding: "88px 0", background: "var(--pine-deep)", position: "relative", overflow: "hidden",
      }} className="gridlines">
        <div className="wrap stack" style={{ gap: 56, position: "relative", zIndex: 1 }}>
          <div className="stack" style={{ textAlign: "center", gap: 14, alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold-soft)" }}>How it works</span>
            <h2 className="display" style={{ fontSize: 38, color: "#fff" }}>From intake to retainer in four steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
            {[
              { n: 1, icon: "file", title: "Client submits intake", desc: "A person with a legal need fills out our guided intake form — verified identity, real details, consent on file." },
              { n: 2, icon: "bolt", title: "AI scores & routes", desc: "Our model scores case quality, urgency, and value, then matches to the best-fit attorney in real time." },
              { n: 3, icon: "bell", title: "Attorney gets the lead", desc: "You receive an exclusive, scored lead via SMS, email, and dashboard — with full case context." },
              { n: 4, icon: "phone", title: "Connect & retain", desc: "Respond directly, book a consult, and convert. The lead syncs to your CRM automatically." },
            ].map(s => (
              <div key={s.n} className="stack rise" style={{ gap: 16, animationDelay: `${s.n * 0.1}s` }}>
                <div className="row" style={{ gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(37,99,235,0.15)", color: "var(--signal-glow)",
                    display: "grid", placeItems: "center",
                    fontWeight: 700, fontSize: 16, fontFamily: "var(--mono)", flex: "none",
                  }}>
                    {s.n}
                  </div>
                  <Icon name={s.icon} size={22} color="var(--gold-soft)" />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: "rgba(234,240,249,0.65)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "88px 0", background: "var(--paper)", overflow: "hidden" }}>
        <div className="wrap stack" style={{ gap: 48 }}>
          <div className="stack" style={{ textAlign: "center", gap: 14, alignItems: "center" }}>
            <span className="eyebrow" style={{ color: "var(--signal)" }}>Testimonials</span>
            <h2 className="display" style={{ fontSize: 38, color: "var(--ink)" }}>Trusted by attorneys and clients</h2>
          </div>
          <div className="row" style={{
            gap: 24, overflowX: "auto", paddingBottom: 8,
            scrollSnapType: "x mandatory",
          }}>
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} t={t} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section style={{ padding: "72px 0", background: "var(--card)" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {[
              { icon: "shield", title: "Verified & Exclusive", desc: "Every lead is identity-verified and sent to exactly one attorney. No shared leads, no bidding wars." },
              { icon: "bolt", title: "AI-Powered Scoring", desc: "Our models score quality, urgency, and case value before the lead reaches you — so you know what's worth your time." },
              { icon: "plug", title: "Seamless Integrations", desc: "One-click sync with Clio, MyCase, Calendly, and 6,000+ apps via Zapier. No manual data entry." },
            ].map(c => (
              <div key={c.title} className="card feat-card stack" style={{ padding: 32, gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "var(--signal-tint)", display: "grid", placeItems: "center",
                }}>
                  <Icon name={c.icon} size={24} color="var(--signal)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>{c.title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section style={{
        padding: "72px 0",
        background: "linear-gradient(135deg, var(--signal) 0%, var(--signal-deep) 100%)",
      }}>
        <div className="wrap stack" style={{ alignItems: "center", textAlign: "center", gap: 24 }}>
          <h2 className="display" style={{ fontSize: 36, color: "#fff" }}>Ready to transform your intake?</h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", maxWidth: 480 }}>
            Join hundreds of attorneys receiving verified, exclusive leads every week.
          </p>
          <div className="row" style={{ gap: 14 }}>
            <button className="btn btn-lg" style={{ background: "#fff", color: "var(--signal-deep)", fontWeight: 700 }} onClick={() => router.push("/get-started")}>
              Get Started Free <Icon name="arrowR" size={18} />
            </button>
            <button className="btn btn-ghost-light btn-lg" onClick={() => router.push("/demo")}>
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
