"use client";

import { useState } from "react";
import ClientLayout, { ME } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { inpStyle } from "@/components/ui";

export default function ClientSettings() {
  const [prefs, setPrefs] = useState({ sms: true, email: true, updates: true });

  return (
    <ClientLayout title="Settings">
      <div style={{ maxWidth: 720 }}>
        <div className="card" style={{ padding: 24, marginBottom: 18 }}>
          <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Your details</strong>
          <div className="row" style={{ gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}><label className="stack" style={{ gap: 7 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Full name</span><input defaultValue={ME.name} style={inpStyle} /></label></div>
            <div style={{ flex: 1 }}><label className="stack" style={{ gap: 7 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Phone</span><input defaultValue="(512) 555-0192" style={inpStyle} /></label></div>
          </div>
          <label className="stack" style={{ gap: 7 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Email</span><input defaultValue="marcus.webb@email.com" style={inpStyle} /></label>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 18 }}>
          <strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>Notifications</strong>
          <p style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 14 }}>How should we update you about your case?</p>
          <div className="stack" style={{ gap: 4 }}>
            {([["sms", "Text messages", "Case updates & attorney replies by SMS"], ["email", "Email", "A copy of every update by email"], ["updates", "Status changes", "Notify me when my case moves forward"]] as [string, string, string][]).map(([k, l, d]) => (
              <div key={k} className="row between" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                <div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 14.5 }}>{l}</strong><span style={{ fontSize: 13, color: "var(--text-3)" }}>{d}</span></div>
                <button onClick={() => setPrefs(p => ({ ...p, [k]: !p[k as keyof typeof p] }))} style={{ width: 46, height: 27, borderRadius: 999, background: prefs[k as keyof typeof prefs] ? "var(--signal)" : "var(--line-2)", padding: 3, transition: "background .2s" }}><span style={{ display: "block", width: 21, height: 21, borderRadius: "50%", background: "#fff", transform: prefs[k as keyof typeof prefs] ? "translateX(19px)" : "none", transition: "transform .2s var(--ease)" }} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>Privacy &amp; consent</strong>
          <div className="stack" style={{ gap: 12, marginTop: 12 }}>
            {([["Consent to be contacted by my matched attorney", true], ["Share my inquiry & documents with my verified attorney", true], ["Allow ClientSignal to use my data to sell to other firms", false]] as [string, boolean][]).map(([l, on]) => (
              <div key={l as string} className="row" style={{ gap: 11 }}><Icon name={on ? "check" : "x"} size={17} color={on ? "var(--verified)" : "var(--text-3)"} stroke={2.5} /><span style={{ fontSize: 14, color: "var(--text-2)" }}>{l as string}</span></div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 18, color: "var(--coral)", borderColor: "var(--coral)" }}>Download or delete my data</button>
        </div>
      </div>
    </ClientLayout>
  );
}
