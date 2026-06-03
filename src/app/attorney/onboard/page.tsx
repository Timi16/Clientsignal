"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo, Field, LField, inpStyle } from "@/components/ui";
import { CASE_TYPES } from "@/lib/data";

const STEPS = [
  { label: "Firm profile", icon: "building" },
  { label: "Practice areas", icon: "scale" },
  { label: "Service locations", icon: "flag" },
  { label: "Licence verification", icon: "shield" },
  { label: "Lead preferences", icon: "bolt" },
  { label: "Billing setup", icon: "card" },
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>(["Texas"]);
  const [volume, setVolume] = useState("5-15");
  const [maxBudget, setMaxBudget] = useState("$500");

  const next = () => {
    setDone((prev) => (prev.includes(step) ? prev : [...prev, step]));
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.push("/attorney/verify-status");
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleArea = (k: string) =>
    setAreas((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const toggleState = (s: string) =>
    setStates((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <div className="auth-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "100vh" }}>
      {/* step rail */}
      <aside
        style={{
          background: "var(--pine-deep)",
          padding: "36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <Logo light size={28} sub />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(234,240,249,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
          Setup progress
        </div>
        <div className="stack" style={{ gap: 4 }}>
          {STEPS.map((s, i) => {
            const isDone = done.includes(i);
            const isActive = step === i;
            const isFuture = !isDone && !isActive;
            return (
              <button
                key={i}
                onClick={() => {
                  if (isDone || isActive) setStep(i);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: isDone
                    ? "var(--gold-soft)"
                    : isActive
                    ? "#fff"
                    : "rgba(234,240,249,0.3)",
                  background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                  border: isActive ? "1.5px solid var(--gold)" : "1.5px solid transparent",
                  cursor: isFuture ? "default" : "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "all .15s",
                }}
              >
                {isDone ? (
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "var(--gold)",
                      display: "grid",
                      placeItems: "center",
                      flex: "none",
                    }}
                  >
                    <Icon name="check" size={14} color="#fff" stroke={2.5} />
                  </span>
                ) : (
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: isActive ? "2px solid var(--gold)" : "2px solid rgba(255,255,255,0.12)",
                      display: "grid",
                      placeItems: "center",
                      flex: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? "var(--gold-soft)" : "rgba(234,240,249,0.25)",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                {s.label}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ padding: "16px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 12, color: "rgba(234,240,249,0.35)" }}>
            Step {step + 1} of {STEPS.length}
          </div>
        </div>
      </aside>

      {/* content */}
      <main className="thin-scroll" style={{ overflowY: "auto", padding: "48px 56px", height: "100vh" }}>
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
            {STEPS[step].label}
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-3)", marginBottom: 36, lineHeight: 1.6 }}>
            {step === 0 && "Tell us about your firm so we can match you with the right leads."}
            {step === 1 && "Select the practice areas you'd like to receive leads for."}
            {step === 2 && "Choose the states and cities where you're licenced to practice."}
            {step === 3 && "Upload your bar licence for verification. We'll review it within 1-2 business days."}
            {step === 4 && "Set your lead volume and budget preferences."}
            {step === 5 && "Add a payment method to activate your account."}
          </p>

          {/* step 0: firm profile */}
          {step === 0 && (
            <div className="stack rise" style={{ gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <Field label="Full name" placeholder="Sarah Mitchell" icon="user" />
                <Field label="Email" type="email" placeholder="sarah@mitchellcole.com" icon="mail" />
                <Field label="Firm name" placeholder="Mitchell & Cole LLP" icon="building" />
                <Field label="Phone" type="tel" placeholder="(512) 555-0100" icon="phone" />
              </div>
              <Field label="Firm website" placeholder="https://mitchellcole.com" />
              <LField label="Firm bio">
                <textarea
                  placeholder="Briefly describe your firm and areas of expertise..."
                  rows={4}
                  style={{ ...inpStyle, resize: "vertical" }}
                />
              </LField>
            </div>
          )}

          {/* step 1: practice areas */}
          {step === 1 && (
            <div className="row rise" style={{ gap: 12, flexWrap: "wrap" }}>
              {Object.entries(CASE_TYPES).map(([k, t]) => {
                const on = areas.includes(k);
                return (
                  <button
                    key={k}
                    onClick={() => toggleArea(k)}
                    style={{
                      padding: "12px 22px",
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      background: on ? t.tint : "var(--paper)",
                      color: on ? t.color : "var(--text-2)",
                      border: on ? `2px solid ${t.color}` : "2px solid var(--line)",
                      cursor: "pointer",
                      transition: "all .15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: on ? t.color : "var(--line-2)" }} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* step 2: service locations */}
          {step === 2 && (
            <div className="stack rise" style={{ gap: 18 }}>
              <p style={{ fontSize: 13.5, color: "var(--text-2)" }}>
                Select all states where you are bar-admitted.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {US_STATES.map((s) => {
                  const on = states.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleState(s)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "left",
                        background: on ? "var(--signal-tint)" : "transparent",
                        color: on ? "var(--signal)" : "var(--text-2)",
                        border: on ? "1.5px solid var(--signal)" : "1.5px solid var(--line)",
                        cursor: "pointer",
                        transition: "all .12s",
                      }}
                    >
                      {on && <Icon name="check" size={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* step 3: licence verification */}
          {step === 3 && (
            <div className="stack rise" style={{ gap: 22 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <Field label="Bar number" placeholder="TX #24087" icon="shield" />
                <Field label="State of admission" placeholder="Texas" icon="flag" />
              </div>
              <LField label="Upload bar licence">
                <div
                  style={{
                    width: "100%",
                    padding: "36px 20px",
                    borderRadius: 12,
                    border: "2px dashed var(--line-2)",
                    background: "var(--paper)",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="upload" size={28} color="var(--text-3)" style={{ margin: "0 auto 10px" }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)" }}>
                    Drag & drop or click to upload
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
                    PDF, JPG, or PNG — max 10 MB
                  </div>
                </div>
              </LField>
            </div>
          )}

          {/* step 4: lead preferences */}
          {step === 4 && (
            <div className="stack rise" style={{ gap: 24 }}>
              <LField label="Desired lead volume per month">
                <div className="row" style={{ gap: 10 }}>
                  {["1-5", "5-15", "15-30", "30+"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setVolume(v)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        background: volume === v ? "var(--pine)" : "transparent",
                        color: volume === v ? "#fff" : "var(--text-2)",
                        border: volume === v ? "1.5px solid var(--pine)" : "1.5px solid var(--line-2)",
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </LField>
              <LField label="Monthly budget cap">
                <div className="row" style={{ gap: 10 }}>
                  {["$250", "$500", "$1,000", "$2,500", "No limit"].map((b) => (
                    <button
                      key={b}
                      onClick={() => setMaxBudget(b)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        background: maxBudget === b ? "var(--pine)" : "transparent",
                        color: maxBudget === b ? "#fff" : "var(--text-2)",
                        border: maxBudget === b ? "1.5px solid var(--pine)" : "1.5px solid var(--line-2)",
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </LField>
              <LField label="Minimum lead quality score">
                <input
                  type="range"
                  min={40}
                  max={100}
                  defaultValue={70}
                  style={{ width: "100%", accentColor: "var(--signal)" }}
                />
                <div className="row between" style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>40</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>100</span>
                </div>
              </LField>
            </div>
          )}

          {/* step 5: billing setup */}
          {step === 5 && (
            <div className="stack rise" style={{ gap: 22 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Card number" placeholder="4242 4242 4242 4242" icon="card" />
                </div>
                <Field label="Expiration" placeholder="MM / YY" />
                <Field label="CVC" placeholder="123" icon="lock" />
              </div>
              <Field label="Billing address" placeholder="123 Main St, Austin, TX 78701" />
              <div
                style={{
                  padding: "18px 20px",
                  background: "var(--paper)",
                  borderRadius: 12,
                  border: "1.5px solid var(--line)",
                }}
              >
                <div className="row between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-2)" }}>Plan</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Growth — $499/mo</span>
                </div>
                <div className="row between">
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-2)" }}>First charge</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Today</span>
                </div>
              </div>
            </div>
          )}

          {/* navigation */}
          <div className="row" style={{ gap: 12, marginTop: 44 }}>
            {step > 0 && (
              <button className="btn btn-ghost" onClick={back}>
                <Icon name="chevR" size={16} style={{ transform: "rotate(180deg)" }} />
                Back
              </button>
            )}
            <button className="btn btn-signal" onClick={next}>
              {step === STEPS.length - 1 ? "Submit & verify" : "Continue"}
              <Icon name="arrowR" size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
