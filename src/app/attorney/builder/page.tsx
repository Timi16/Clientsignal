"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";

const QUESTIONS = [
  { id: "name", label: "Full name", on: true, locked: true },
  { id: "email", label: "Email address", on: true, locked: true },
  { id: "phone", label: "Phone number", on: true, locked: true },
  { id: "city", label: "City / State", on: true, locked: false },
  { id: "caseType", label: "Case type", on: true, locked: false },
  { id: "description", label: "Describe your situation", on: true, locked: false },
  { id: "urgency", label: "How urgent is this?", on: true, locked: false },
  { id: "docs", label: "Upload documents", on: false, locked: false },
  { id: "budget", label: "Estimated budget range", on: false, locked: false },
  { id: "preferred", label: "Preferred contact method", on: false, locked: false },
];

export default function BuilderPage() {
  const [questions, setQuestions] = useState(QUESTIONS);

  const toggle = (id: string) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id && !q.locked ? { ...q, on: !q.on } : q))
    );

  const activeQs = questions.filter((q) => q.on);

  return (
    <AppLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>Intake builder</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24 }}>
        {/* left: config */}
        <div className="stack" style={{ gap: 20 }}>
          {/* custom link */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>
              Custom intake link
            </h3>
            <div
              className="row"
              style={{
                gap: 10,
                padding: "11px 14px",
                background: "var(--paper)",
                borderRadius: 10,
                border: "1.5px solid var(--line)",
              }}
            >
              <Icon name="lock" size={16} color="var(--text-3)" />
              <span className="mono" style={{ fontSize: 13.5, color: "var(--text-2)", flex: 1 }}>
                clientsignal.com/intake/mitchell-cole
              </span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: "5px 12px", fontSize: 12 }}
              >
                Copy
              </button>
            </div>
          </div>

          {/* questions */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>
              Configure questions
            </h3>
            <div className="stack" style={{ gap: 0 }}>
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="row between"
                  style={{
                    padding: "14px 0",
                    borderTop: i > 0 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <div className="row" style={{ gap: 10 }}>
                    {q.locked && <Icon name="lock" size={14} color="var(--text-3)" />}
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: q.on ? "var(--ink)" : "var(--text-3)",
                      }}
                    >
                      {q.label}
                    </span>
                    {q.locked && (
                      <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>
                        Required
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggle(q.id)}
                    disabled={q.locked}
                    style={{
                      width: 44,
                      height: 26,
                      borderRadius: 99,
                      background: q.on ? "var(--signal)" : "var(--line-2)",
                      position: "relative",
                      transition: "background .2s",
                      cursor: q.locked ? "default" : "pointer",
                      opacity: q.locked ? 0.5 : 1,
                      border: "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 3,
                        left: q.on ? 21 : 3,
                        width: 20,
                        height: 20,
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
        </div>

        {/* right: preview */}
        <div className="card" style={{ padding: "28px 26px", alignSelf: "start", position: "sticky", top: 100 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Live preview
          </div>
          <div
            style={{
              padding: "24px 20px",
              background: "var(--paper)",
              borderRadius: 14,
              border: "1.5px solid var(--line)",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>
              Mitchell & Cole LLP
            </div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 22 }}>
              Free case evaluation
            </div>
            <div className="stack" style={{ gap: 14 }}>
              {activeQs.map((q) => (
                <div key={q.id} className="stack" style={{ gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>
                    {q.label}
                  </span>
                  {q.id === "description" ? (
                    <div
                      style={{
                        width: "100%",
                        height: 64,
                        borderRadius: 8,
                        border: "1.5px solid var(--line-2)",
                        background: "var(--card)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 38,
                        borderRadius: 8,
                        border: "1.5px solid var(--line-2)",
                        background: "var(--card)",
                      }}
                    />
                  )}
                </div>
              ))}
              <button className="btn btn-signal" style={{ width: "100%", marginTop: 8 }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
