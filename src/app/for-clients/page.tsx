"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/ui";
import { MarketingNav, Footer } from "@/components/marketing";
import { CASE_TYPES } from "@/lib/data";

export default function ForClients() {
  const router = useRouter();
  const go = (p: string) => router.push(p);
  const areas = Object.entries(CASE_TYPES);
  return (
    <div id="m-scroll" className="thin-scroll" style={{ height: "100%", overflowY: "auto", background: "var(--paper)" }}>
      <MarketingNav audience="client" />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -180, left: -120, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, var(--gold-tint) 0%, transparent 62%)", pointerEvents: "none" }} />
        <div className="wrap" style={{ position: "relative", paddingTop: 64, paddingBottom: 70 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 26 }}>
              <span className="pill rise" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)", alignSelf: "flex-start" }}><span className="pulse-dot" /> Free for you — always</span>
              <h1 className="display rise" style={{ fontSize: "clamp(40px,6vw,72px)", animationDelay: ".1s" }}>
                The right attorney,<br /><span style={{ fontStyle: "italic", color: "var(--pine)" }}>found for you</span><span style={{ color: "var(--signal-deep)" }}>.</span>
              </h1>
              <p className="rise" style={{ fontSize: "clamp(17px,2vw,20px)", color: "var(--text-2)", lineHeight: 1.55, maxWidth: 470, animationDelay: ".18s" }}>
                Tell us what happened once. We match you with a verified, licensed attorney who handles your kind of case — and they reach out fast, usually within minutes. No fees, no spam.
              </p>
              <div className="row rise" style={{ gap: 14, flexWrap: "wrap", animationDelay: ".26s" }}>
                <button className="btn btn-pine btn-lg" onClick={() => go("/client/signup")}><Icon name="scale" size={19} /> Get started</button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("/client/login")}><Icon name="user" size={18} /> I already have an account</button>
              </div>
              <div className="row rise" style={{ gap: 26, marginTop: 6, animationDelay: ".34s", flexWrap: "wrap" }}>
                {[["100%", "free for clients"], ["~4 min", "to first response"], ["Verified", "licensed attorneys only"]].map(([n, l]) => (
                  <div key={l} className="stack" style={{ gap: 2 }}><strong className="mono" style={{ fontSize: 21, color: "var(--ink)" }}>{n}</strong><span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{l}</span></div>
                ))}
              </div>
            </div>
            {/* how it works card */}
            <div className="card rise" style={{ padding: 28, boxShadow: "var(--sh-lg)", animationDelay: ".22s" }}>
              <span className="eyebrow" style={{ marginBottom: 18, display: "block" }}>How it works</span>
              <div className="stack" style={{ gap: 4 }}>
                {[
                  ["pen", "Describe your situation", "A short, guided form — adapts to your case type."],
                  ["shield", "We verify & match you", "Routed to a licensed attorney who handles your case."],
                  ["phone", "They reach out fast", "Talk directly and decide if it's the right fit."],
                  ["grid", "Track everything in one place", "Status, documents and messages in your dashboard."],
                ].map(([ic, t, d], i) => (
                  <div key={t} className="row" style={{ gap: 14, padding: "13px 0", borderBottom: i < 3 ? "1px solid var(--line)" : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--blue-tint)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={ic} size={19} color="var(--signal)" /></div>
                    <div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 15 }}>{t}</strong><span style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.4 }}>{d}</span></div>
                  </div>
                ))}
              </div>
              <button className="btn btn-signal" style={{ width: "100%", marginTop: 18 }} onClick={() => go("/client/signup")}>Get started — it&apos;s free <Icon name="arrowR" size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* PRACTICE AREAS */}
      <section style={{ padding: "90px 0", background: "var(--card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 14, marginBottom: 40, maxWidth: 560 }}>
            <span className="eyebrow">Practice areas</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.5vw,46px)" }}>What kind of help do you need?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="feat-grid">
            {areas.map(([k, t]) => (
              <button key={k} onClick={() => go("/client/signup")} className="card feat-card" style={{ padding: 22, textAlign: "left", display: "flex", alignItems: "center", gap: 15 }}>
                <span style={{ width: 46, height: 46, borderRadius: 12, background: t.tint, display: "grid", placeItems: "center", flex: "none" }}><span style={{ width: 15, height: 15, borderRadius: "50%", background: t.color }} /></span>
                <div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 16 }}>{t.label}</strong><span style={{ fontSize: 13, color: "var(--text-3)" }}>Get matched →</span></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section style={{ padding: "90px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 22 }}>
              <span className="eyebrow">Safe &amp; private</span>
              <h2 className="display" style={{ fontSize: "clamp(28px,4vw,44px)" }}>Your information stays protected.</h2>
              <div className="stack" style={{ gap: 16 }}>
                {[
                  ["lock", "Bank-level encryption", "Everything you share is encrypted and stored securely."],
                  ["shield", "Verified attorneys only", "Every attorney's license & identity is confirmed before they join."],
                  ["eye", "Never sold or spammed", "Your details go only to your matched attorney — never to a list."],
                ].map(([ic, t, d]) => (
                  <div key={t} className="row" style={{ gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--verified-tint)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={ic} size={20} color="var(--verified)" /></div>
                    <div className="stack" style={{ gap: 3 }}><strong style={{ fontSize: 16 }}>{t}</strong><span style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.5 }}>{d}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 22, overflow: "hidden", boxShadow: "var(--sh-lg)", minHeight: 360, position: "relative" }}>
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&h=800&fit=crop" alt="Attorney meeting a client" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "20px 0 100px" }}>
        <div className="wrap">
          <div className="gridlines" style={{ background: "var(--pine)", borderRadius: 26, padding: "70px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div className="stack" style={{ gap: 22, position: "relative", maxWidth: 600, margin: "0 auto" }}>
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)", color: "#fff" }}>Let&apos;s get you <span style={{ fontStyle: "italic", color: "var(--gold-soft)" }}>help</span>.</h2>
              <p style={{ fontSize: 18, color: "rgba(234,240,249,0.78)", lineHeight: 1.5 }}>It takes a few minutes and it&apos;s completely free. The sooner you start, the sooner the right attorney can help.</p>
              <div className="row" style={{ gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-gold btn-lg" onClick={() => go("/client/signup")}>Get started</button>
                <button className="btn btn-ghost-light btn-lg" onClick={() => go("/client/login")}>Log in</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
