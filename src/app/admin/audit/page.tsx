"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import * as adminApi from "@/lib/api/admin";

interface AuditLog {
  actor: string;
  action: string;
  detail: string;
  timestamp: string;
  icon: string;
}

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .listAuditLogs()
      .then((res) => {
        setLogs(res.logs as AuditLog[]);
      })
      .catch(() => {
        setLogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Audit log" action={<button className="btn btn-ghost btn-sm"><Icon name="download" size={15} /> Export CSV</button>}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row between" style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)" }}><strong style={{ fontSize: 15 }}>Activity · all personnel &amp; system events</strong><span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Today</span></div>
        {loading ? (
          <div style={{ padding: "32px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>Loading audit logs…</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: "32px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>No audit logs found.</div>
        ) : (
          logs.map((r, i) => (
            <div key={i} className="row" style={{ padding: "14px 22px", borderBottom: i < logs.length - 1 ? "1px solid var(--line)" : "none", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: r.actor === "System" ? "var(--blue-tint)" : "var(--paper-2)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={r.icon || "zap"} size={16} color={r.actor === "System" ? "var(--signal)" : "var(--pine)"} /></div>
              <div className="stack" style={{ gap: 2, flex: 1 }}><span style={{ fontSize: 14 }}><strong>{r.actor}</strong> · {r.action}</span><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{r.detail}</span></div>
              <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{r.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
