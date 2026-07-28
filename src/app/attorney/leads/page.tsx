"use client";

import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/attorney-layout";
import { Avatar, CaseTag, ScoreRing } from "@/components/ui";
import { listLeads, Lead } from "@/lib/api/leads";
import { useRouter } from "next/navigation";
import { setSelectedLead } from "./selected-lead";

const TABS = ["All", "New", "Viewed", "Responded"];

export default function LeadsPage() {
  const [tab, setTab] = useState("All");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  const fetchLeads = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const params: Parameters<typeof listLeads>[0] = {};
      if (status !== "All") {
        params.status = status.toLowerCase();
      }
      const res = await listLeads(params);
      setLeads(res.leads ?? []);
      setTotal(res.total ?? 0);
    } catch {
      setLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch tab counts once on mount
  useEffect(() => {
    async function fetchCounts() {
      const counts: Record<string, number> = {};
      for (const t of ["new", "viewed", "responded"]) {
        try {
          const res = await listLeads({ status: t, limit: 0 });
          counts[t] = res.total ?? 0;
        } catch {
          counts[t] = 0;
        }
      }
      setTabCounts(counts);
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchLeads(tab);
  }, [tab, fetchLeads]);

  /** Format createdAt into a human-readable relative time */
  function formatTime(iso: string): string {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

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
                {tabCounts[t.toLowerCase()] ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
            No leads found.
          </div>
        ) : (
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
              {leads.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => {
                    setSelectedLead(l);
                    router.push(`/attorney/leads/detail?id=${l.id}`);
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
                          {l.id} &middot; {l.city}{l.state ? `, ${l.state}` : ""} &middot; {formatTime(l.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* type */}
                  <td style={{ padding: "16px 20px" }}>
                    <CaseTag type={l.practiceArea} sm />
                  </td>

                  {/* quality */}
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      className="mono"
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color:
                          l.qualityScore >= 80
                            ? "var(--verified)"
                            : l.qualityScore >= 55
                            ? "var(--amber)"
                            : "var(--coral)",
                      }}
                    >
                      {l.qualityScore}
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
                          l.urgencyScore >= 80
                            ? "var(--coral)"
                            : l.urgencyScore >= 55
                            ? "var(--amber)"
                            : "var(--text-2)",
                      }}
                    >
                      {l.urgencyScore}
                    </span>
                  </td>

                  {/* value */}
                  <td style={{ padding: "16px 20px" }}>
                    <span className="mono" style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>
                      {l.estimatedValue || "—"}
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
        )}
      </div>
    </AppLayout>
  );
}
