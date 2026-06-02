"use client";

import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo, Avatar } from "@/components/ui";

const NAV = [
  { label: "Overview", icon: "grid", href: "/admin" },
  { label: "Inquiries", icon: "inbox", href: "/admin/inquiries", badge: 4 },
  { label: "Verifications", icon: "shield", href: "/admin/verify", badge: 2 },
  { label: "Lead QA", icon: "flag", href: "/admin/qa", badge: 3 },
  { label: "Firms & attorneys", icon: "building", href: "/admin/firms" },
  { label: "Payments", icon: "dollar", href: "/admin/revenue" },
  { label: "Reports", icon: "chart", href: "/admin/reports" },
  { label: "Audit log", icon: "doc", href: "/admin/audit" },
];

export default function AdminLayout({
  children,
  title,
  action,
}: {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="app-grid" style={{ display: "grid", gridTemplateColumns: "248px 1fr", minHeight: "100vh" }}>
      {/* ---- sidebar ---- */}
      <aside
        className="app-side"
        style={{
          background: "var(--ink)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 16px 20px",
          gap: 8,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "0 8px", marginBottom: 10 }}>
          <Logo light size={28} sub />
        </div>

        {/* admin badge */}
        <div style={{ padding: "0 8px", marginBottom: 22 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(220,38,38,0.18)",
              color: "#F87171",
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "4px 11px",
              borderRadius: 999,
              lineHeight: 1.4,
            }}
          >
            Admin Console
          </span>
        </div>

        <nav className="stack" style={{ gap: 2, flex: 1 }}>
          {NAV.map((n) => {
            const active =
              path === n.href || (n.href !== "/admin" && path.startsWith(n.href));
            return (
              <button
                key={n.href}
                onClick={() => router.push(n.href)}
                className="side-nav-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 14.5,
                  fontWeight: 550,
                  color: active ? "var(--gold-soft)" : "rgba(234,240,249,0.65)",
                  background: active ? "rgba(212,160,23,0.12)" : "transparent",
                  transition: "background .15s, color .15s",
                  width: "100%",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(234,240,249,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(234,240,249,0.65)";
                  }
                }}
              >
                <Icon name={n.icon} size={19} />
                <span className="side-label" style={{ flex: 1 }}>
                  {n.label}
                </span>
                {n.badge && (
                  <span
                    style={{
                      background: "var(--signal)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 99,
                      padding: "2px 7px",
                      lineHeight: 1.3,
                    }}
                  >
                    {n.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* user */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "14px 10px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: 8,
          }}
        >
          <Avatar name="Alex Reed" size={36} />
          <div className="side-label" style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 6 }}>
              <span
                style={{
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Alex Reed
              </span>
            </div>
            <span style={{ color: "rgba(234,240,249,0.45)", fontSize: 12 }}>
              Operations admin
            </span>
          </div>
        </div>
      </aside>

      {/* ---- main ---- */}
      <div className="stack" style={{ minHeight: "100vh", overflow: "hidden" }}>
        {/* header */}
        <header
          className="row between"
          style={{
            padding: "18px 32px",
            borderBottom: "1px solid var(--line)",
            background: "var(--card)",
            gap: 20,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>
            {title}
          </h1>
          <div className="row" style={{ gap: 16 }}>
            {action}
            <button
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1.5px solid var(--line)",
                display: "grid",
                placeItems: "center",
                position: "relative",
              }}
            >
              <Icon name="bell" size={18} color="var(--text-2)" />
              <span
                style={{
                  position: "absolute",
                  top: 7,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--coral)",
                }}
              />
            </button>
          </div>
        </header>

        {/* body */}
        <main
          className="thin-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "32px 32px 48px" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
