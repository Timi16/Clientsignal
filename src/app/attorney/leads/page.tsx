"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Avatar, CaseTag, ScoreRing } from "@/components/ui";
import { LEADS } from "@/lib/data";
import { useRouter } from "next/navigation";
import { setSelectedLead } from "./detail/page";

const TABS = ["All", "New", "Viewed", "Responded"];

export default function LeadsPage() {
  const [tab, setTab] = useState("All");
  const router = useRouter();

  const filtered =
    tab === "All" ? LEADS : LEADS.filter((l) => l.status.toLowerCase() === tab.toLowerCase());

  return (
    <AppLayout>
      <div className="row between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>Leads</h1>
      </div>

      {/* tabs */}
      <div className="row" style={{ gap: 6, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 18px",
              borderRadius: 99,
              fontSize: 13.5,
              fontWeight: 600,
              background: tab === t ? "var(--pine)" : "transparent",
              color: tab === t ? "#fff" : "var(--text-2)",
              border: tab === t ? "none" : "1.5px solid var(--line)",
              transition: "all .15s",
            }}
          >
            {t}
            {t !== "All" && (
              <span style={{ marginLeft: 6, opacity: 0.7 }}>
                {LEADS.filter((l) => l.status.toLowerCase() === t.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--line)",
                textAlign: "left",
              }}
            >
              {["Lead", "Type", "Quality", "Urgency", "Value", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 20px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr
                key={l.id}
                onClick={() => {
                  setSelectedLead(l);
                  router.push("/attorney/leads/detail");
                }}
                style={{ borderBottom: "1px solid var(--line)", cursor: "pointer", transition: "background .12s" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background = "var(--paper)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")
                }
              >
                {/* lead */}
                <td style={{ padding: "16px 20px" }}>
                  <div className="row" style={{ gap: 12 }}>
                    <Avatar name={l.name} size={38} />
                    <div>
                      <div style={{ fontWeight: 650, fontSize: 14, color: "var(--ink)" }}>
                        {l.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                        {l.id} &middot; {l.city} &middot; {l.time}
                      </div>
                    </div>
                  </div>
                </td>

                {/* type */}
                <td style={{ padding: "16px 20px" }}>
                  <CaseTag type={l.type} sm />
                </td>

                {/* quality */}
                <td style={{ padding: "16px 20px" }}>
                  <span
                    className="mono"
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color:
                        l.quality >= 80
                          ? "var(--verified)"
                          : l.quality >= 55
                          ? "var(--amber)"
                          : "var(--coral)",
                    }}
                  >
                    {l.quality}
                  </span>
                </td>

                {/* urgency */}
                <td style={{ padding: "16px 20px" }}>
                  <span
                    className="mono"
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color:
                        l.urgency >= 80
                          ? "var(--coral)"
                          : l.urgency >= 55
                          ? "var(--amber)"
                          : "var(--text-2)",
                    }}
                  >
                    {l.urgency}
                  </span>
                </td>

                {/* value */}
                <td style={{ padding: "16px 20px" }}>
                  <span className="mono" style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>
                    {l.value}
                  </span>
                </td>

                {/* status */}
                <td style={{ padding: "16px 20px" }}>
                  <span
                    className="pill"
                    style={{
                      fontSize: 11.5,
                      padding: "4px 12px",
                      background:
                        l.status === "new"
                          ? "var(--signal-tint)"
                          : l.status === "viewed"
                          ? "var(--amber-tint)"
                          : "var(--verified-tint)",
                      color:
                        l.status === "new"
                          ? "var(--signal)"
                          : l.status === "viewed"
                          ? "var(--amber)"
                          : "var(--verified)",
                    }}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
