"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, Mark, Field, LField, inpStyle } from "@/components/ui";
import { Icon } from "@/components/icons";

const AVAIL_DAYS = [3, 4, 5, 10, 11, 12, 17, 18, 19, 24, 25, 26];
const TIMES = [
  "9:00 am",
  "9:30 am",
  "10:00 am",
  "11:30 am",
  "1:00 pm",
  "2:30 pm",
  "3:00 pm",
  "4:30 pm",
];

const MONTH = "June";
const YEAR = 2026;
const DAYS_IN_MONTH = 30;
const START_DOW = 1; // June 2026 starts on Monday (0=Sun)

function buildCalGrid() {
  const cells: (number | null)[] = [];
  for (let i = 0; i < START_DOW; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function BookDemo() {
  const router = useRouter();
  const [step, setStep] = useState<"cal" | "form" | "done">("cal");
  const [selDay, setSelDay] = useState<number | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", firm: "", email: "", phone: "", areas: "" });

  const cells = buildCalGrid();
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ---- Calendar step ---- */
  if (step === "cal") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--paper)",
          padding: "40px 20px",
        }}
      >
        <div
          className="rise"
          style={{
            width: "100%",
            maxWidth: 920,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <Logo size={32} />

          <div
            className="card"
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              overflow: "hidden",
              minHeight: 520,
            }}
          >
            {/* Left: dark event info */}
            <div
              style={{
                background: "var(--pine)",
                color: "#fff",
                padding: "40px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <Mark size={36} live />
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--gold-soft)",
                    marginBottom: 6,
                  }}
                >
                  ClientSignal
                </p>
                <h2
                  className="display"
                  style={{ fontSize: 24, color: "#fff", lineHeight: 1.15 }}
                >
                  Platform Demo
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
                <div className="row" style={{ gap: 10, color: "rgba(234,240,249,0.7)", fontSize: 14 }}>
                  <Icon name="clock" size={17} color="rgba(234,240,249,0.55)" />
                  30 minutes
                </div>
                <div className="row" style={{ gap: 10, color: "rgba(234,240,249,0.7)", fontSize: 14 }}>
                  <Icon name="phone" size={17} color="rgba(234,240,249,0.55)" />
                  Video call (Google Meet)
                </div>
                <div className="row" style={{ gap: 10, color: "rgba(234,240,249,0.7)", fontSize: 14 }}>
                  <Icon name="message" size={17} color="rgba(234,240,249,0.55)" />
                  Q&A with a product specialist
                </div>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: 20,
                  fontSize: 13,
                  color: "rgba(234,240,249,0.45)",
                  lineHeight: 1.5,
                }}
              >
                See how ClientSignal routes verified leads to your firm in under 60 seconds. No commitment required.
              </div>
            </div>

            {/* Right: calendar grid */}
            <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="row between">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
                  {MONTH} {YEAR}
                </h3>
                <div className="row" style={{ gap: 4 }}>
                  <button
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      border: "1.5px solid var(--line-2)",
                      background: "var(--card)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon name="chevR" size={16} style={{ transform: "rotate(180deg)" }} />
                  </button>
                  <button
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      border: "1.5px solid var(--line-2)",
                      background: "var(--card)",
                      cursor: "pointer",
                    }}
                  >
                    <Icon name="chevR" size={16} />
                  </button>
                </div>
              </div>

              {/* Day-of-week headers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 0,
                  textAlign: "center",
                }}
              >
                {DOW.map((d) => (
                  <div
                    key={d}
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--text-3)",
                      padding: "0 0 8px",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar cells */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 4,
                }}
              >
                {cells.map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const avail = AVAIL_DAYS.includes(day);
                  const selected = selDay === day;
                  return (
                    <button
                      key={i}
                      disabled={!avail}
                      onClick={() => setSelDay(day)}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        maxWidth: 52,
                        borderRadius: 12,
                        display: "grid",
                        placeItems: "center",
                        fontSize: 14.5,
                        fontWeight: selected ? 700 : 500,
                        cursor: avail ? "pointer" : "default",
                        background: selected
                          ? "var(--signal)"
                          : avail
                          ? "var(--signal-tint)"
                          : "transparent",
                        color: selected
                          ? "#fff"
                          : avail
                          ? "var(--signal)"
                          : "var(--text-3)",
                        border: "none",
                        transition: "background .15s, color .15s",
                        opacity: avail ? 1 : 0.45,
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Time slots (visible when day is selected) */}
              {selDay && (
                <div style={{ marginTop: 4 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-2)",
                      marginBottom: 10,
                    }}
                  >
                    Available times for {MONTH} {selDay}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {TIMES.map((t) => {
                      const active = selTime === t;
                      return (
                        <button
                          key={t}
                          onClick={() => setSelTime(t)}
                          style={{
                            padding: "9px 16px",
                            borderRadius: 10,
                            fontSize: 13.5,
                            fontWeight: 600,
                            border: active
                              ? "1.5px solid var(--signal)"
                              : "1.5px solid var(--line-2)",
                            background: active ? "var(--signal-tint)" : "var(--card)",
                            color: active ? "var(--signal)" : "var(--text-1)",
                            cursor: "pointer",
                            transition: "border-color .15s, background .15s",
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Continue */}
              {selDay && selTime && (
                <button
                  className="btn btn-signal"
                  style={{ alignSelf: "flex-end", marginTop: 8 }}
                  onClick={() => setStep("form")}
                >
                  Continue
                  <Icon name="arrowR" size={17} color="#fff" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Form step ---- */
  if (step === "form") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--paper)",
          padding: "40px 20px",
        }}
      >
        <div
          className="rise"
          style={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Back button */}
          <button
            className="row"
            style={{ gap: 6, fontSize: 14, color: "var(--text-2)", cursor: "pointer", alignSelf: "flex-start" }}
            onClick={() => setStep("cal")}
          >
            <Icon name="chevR" size={15} style={{ transform: "rotate(180deg)" }} />
            Back
          </button>

          <div style={{ textAlign: "center" }}>
            <Logo size={32} />
            <h2
              className="display"
              style={{ fontSize: 26, color: "var(--ink)", marginTop: 20, marginBottom: 6 }}
            >
              Your details
            </h2>
            <p style={{ fontSize: 14.5, color: "var(--text-2)" }}>
              {MONTH} {selDay}, {YEAR} at {selTime} &middot; 30 min
            </p>
          </div>

          <div
            className="card"
            style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 20 }}
          >
            <Field label="Full name" placeholder="Jane Smith" icon="user" />
            <Field label="Firm name" placeholder="Smith & Associates LLP" icon="building" />
            <Field label="Email address" type="email" placeholder="jane@smithlaw.com" icon="mail" />
            <Field label="Phone number" type="tel" placeholder="(555) 123-4567" icon="phone" />
            <LField label="Practice areas">
              <select
                style={{
                  ...inpStyle,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40,
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select primary area
                </option>
                <option>Personal Injury</option>
                <option>Family Law</option>
                <option>Criminal Defense</option>
                <option>Immigration</option>
                <option>Employment</option>
                <option>Business &amp; Contracts</option>
              </select>
            </LField>

            <button
              className="btn btn-signal btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => setStep("done")}
            >
              Schedule demo
              <Icon name="arrowR" size={17} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Done step ---- */
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper)",
        padding: "40px 20px",
      }}
    >
      <div
        className="rise"
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          textAlign: "center",
        }}
      >
        {/* Green check */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--verified-tint)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--verified)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="check" size={26} color="#fff" stroke={3} />
          </div>
        </div>

        <div>
          <h2
            className="display"
            style={{ fontSize: 28, color: "var(--ink)", marginBottom: 8 }}
          >
            You&rsquo;re scheduled!
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.5 }}>
            A confirmation has been sent to your email with the meeting details.
          </p>
        </div>

        {/* Detail card */}
        <div
          className="card"
          style={{
            width: "100%",
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "left",
          }}
        >
          <div className="row" style={{ gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--signal-tint)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="phone" size={20} color="var(--signal)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: "var(--ink)" }}>
                ClientSignal Platform Demo
              </div>
              <div style={{ fontSize: 13.5, color: "var(--text-2)" }}>
                30-minute video call
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid var(--line)",
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div className="row" style={{ gap: 10, fontSize: 14, color: "var(--text-2)" }}>
              <Icon name="clock" size={16} color="var(--text-3)" />
              {MONTH} {selDay}, {YEAR} at {selTime}
            </div>
            <div className="row" style={{ gap: 10, fontSize: 14, color: "var(--text-2)" }}>
              <Icon name="phone" size={16} color="var(--text-3)" />
              Google Meet (link in email)
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="row" style={{ gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={() => router.push("/")}
          >
            <Icon name="arrowR" size={16} style={{ transform: "rotate(180deg)" }} />
            Back to home
          </button>
          <button
            className="btn btn-signal"
            onClick={() => router.push("/get-started")}
          >
            Create an account
            <Icon name="arrowR" size={16} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
