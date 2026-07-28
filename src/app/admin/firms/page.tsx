"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Avatar, Verified, CaseTag } from "@/components/ui";
import { RATING } from "@/lib/data";
import * as adminApi from "@/lib/api/admin";
import type { Attorney } from "@/lib/api/attorneys";

export default function AdminFirms() {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .listAttorneys()
      .then((res) => setAttorneys(res.attorneys))
      .catch(() => setAttorneys([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Firms & attorneys" action={<button className="btn btn-pine btn-sm"><Icon name="plus" size={15} /> Invite firm</button>}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "13px 22px", borderBottom: "1px solid var(--line)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ flex: 3 }}>Attorney / firm</span><span style={{ flex: 1.5 }}>Practice</span><span style={{ width: 90, textAlign: "center" }}>Rating</span><span style={{ width: 70, textAlign: "center" }}>Leads</span><span style={{ width: 80, textAlign: "center" }}>Resp.</span><span style={{ width: 90, textAlign: "right" }}>Status</span>
        </div>

        {loading && (
          <div style={{ padding: "40px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
            Loading attorneys…
          </div>
        )}

        {!loading && attorneys.length === 0 && (
          <div style={{ padding: "40px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
            No attorneys found.
          </div>
        )}

        {!loading && attorneys.map((a, i) => {
          const name = a.user?.name ?? "Unknown";
          const firmName = a.firm?.name ?? "—";
          const rating = RATING[a.trustRating] ?? RATING.green;
          const specialties = a.specialties ?? [];

          return (
            <div key={a.id} className="row" style={{ padding: "16px 22px", borderBottom: i < attorneys.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className="row" style={{ flex: 3, gap: 13 }}><Avatar name={name} size={42} /><div className="stack" style={{ gap: 3 }}><div className="row" style={{ gap: 6 }}><strong style={{ fontSize: 14.5 }}>{name}</strong>{a.status === "approved" && <Verified size={14} />}</div><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{firmName}</span></div></div>
              <div style={{ flex: 1.5 }}><div className="row" style={{ gap: 4, flexWrap: "wrap" }}>{specialties.map(s => <CaseTag key={s} type={s} sm />)}</div></div>
              <div style={{ width: 90, textAlign: "center" }}><span className="pill" style={{ background: rating[2], color: rating[1], fontSize: 11, padding: "4px 11px" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: rating[1] }} /> {rating[0]}</span></div>
              <div style={{ width: 70, textAlign: "center" }}><strong className="mono">—</strong></div>
              <div style={{ width: 80, textAlign: "center" }}><span className="mono" style={{ color: "var(--text-2)" }}>—</span></div>
              <div style={{ width: 90, textAlign: "right" }}><span className="pill" style={{ background: a.status === "approved" ? "var(--verified-tint)" : "var(--amber-tint)", color: a.status === "approved" ? "var(--verified)" : "var(--amber)", fontSize: 11, padding: "4px 10px" }}>{a.status}</span></div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
