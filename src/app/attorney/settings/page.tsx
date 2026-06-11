"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Avatar, Field } from "@/components/ui";

const PRACTICE_AREAS = [
  "Personal Injury",
  "Family Law",
  "Criminal Law",
  "Immigration",
  "Employment Law",
];

export default function SettingsPage() {
  const [areas, setAreas] = useState<string[]>(["Personal Injury", "Employment Law"]);
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);

  const toggleArea = (a: string) =>
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  return (
    <AppLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>Settings</h1>

      {/* profile */}
      <div className="card" style={{ padding: "28px 30px", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 22 }}>Profile</h3>
        <div className="row" style={{ gap: 24, marginBottom: 28 }}>
          <Avatar name="Sarah Mitchell" size={72} />
          <div className="stack" style={{ gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>Sarah Mitchell</span>
            <span style={{ fontSize: 14, color: "var(--text-3)" }}>Mitchell & Cole LLP</span>
            <button style={{ fontSize: 13, fontWeight: 600, color: "var(--signal)", marginTop: 4 }}>
              Change photo
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Full name" placeholder="Sarah Mitchell" defaultValue="Sarah Mitchell" />
          <Field label="Email" type="email" placeholder="sarah@mitchellcole.com" defaultValue="sarah@mitchellcole.com" />
          <Field label="Phone" type="tel" placeholder="(512) 555-0100" defaultValue="(512) 555-0100" />
          <Field label="Bar number" placeholder="TX #24087" defaultValue="TX #24087" />
          <Field label="Firm name" placeholder="Mitchell & Cole LLP" defaultValue="Mitchell & Cole LLP" />
          <Field label="City" placeholder="Austin, TX" defaultValue="Austin, TX" />
        </div>
        <div style={{ marginTop: 22 }}>
          <button className="btn btn-signal btn-sm">Save changes</button>
        </div>
      </div>

      {/* practice areas */}
      <div className="card" style={{ padding: "28px 30px", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>Practice areas</h3>
        <p style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 18 }}>
          Select the practice areas you want to receive leads for.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          {PRACTICE_AREAS.map((a) => {
            const on = areas.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleArea(a)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 99,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: on ? "var(--pine)" : "transparent",
                  color: on ? "#fff" : "var(--text-2)",
                  border: on ? "1.5px solid var(--pine)" : "1.5px solid var(--line-2)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* lead alerts */}
      <div className="card" style={{ padding: "28px 30px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>Lead alerts</h3>
        <p style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 22 }}>
          Choose how you want to be notified when a new lead is matched.
        </p>
        <div className="stack" style={{ gap: 16 }}>
          {([
            { label: "SMS", desc: "Get a text for every new lead", val: sms, set: setSms },
            { label: "Email", desc: "Receive an email summary", val: email, set: setEmail },
            { label: "Push notification", desc: "Browser push alerts", val: push, set: setPush },
          ] as const).map((t) => (
            <div key={t.label} className="row between" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <div>
                <div style={{ fontWeight: 650, fontSize: 14.5, color: "var(--ink)" }}>{t.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-3)" }}>{t.desc}</div>
              </div>
              <button
                onClick={() => t.set(!t.val)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 99,
                  background: t.val ? "var(--signal)" : "var(--line-2)",
                  position: "relative",
                  transition: "background .2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: t.val ? 23 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    transition: "left .2s var(--ease)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
