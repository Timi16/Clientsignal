"use client";

import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo, Verified, Avatar } from "@/components/ui";

const NAV = [
  { label: "Dashboard", icon: "grid", href: "/attorney/dashboard" },
  { label: "Leads", icon: "inbox", href: "/attorney/leads", badge: 2 },
  { label: "Messages", icon: "message", href: "/attorney/messages", badge: 1 },
  { label: "Case notes", icon: "doc", href: "/attorney/notes" },
  { label: "Analytics", icon: "chart", href: "/attorney/analytics" },
  { label: "Intake builder", icon: "pen", href: "/attorney/builder" },
  { label: "Integrations", icon: "plug", href: "/attorney/integrations" },
  { label: "Billing", icon: "card", href: "/attorney/billing" },
  { label: "Settings", icon: "settings", href: "/attorney/settings" },
];

export default function AppLayout({
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
          background: "var(--pine-deep)",
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
        <div style={{ padding: "0 8px", marginBottom: 28 }}>
          <Logo light size={28} sub />
        </div>

        <nav className="stack" style={{ gap: 2, flex: 1 }}>
          {NAV.map((n) => {
            const active = path === n.href || (n.href !== "/attorney/dashboard" && path.startsWith(n.href));
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
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(234,240,249,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(234,240,249,0.65)";
                  }
                }}
              >
                <Icon name={n.icon} size={19} />
                <span className="side-label" style={{ flex: 1 }}>{n.label}</span>
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
          <Avatar name="Sarah Mitchell" size={36} />
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
                Sarah Mitchell
              </span>
              <Verified size={14} />
            </div>
            <span style={{ color: "rgba(234,240,249,0.45)", fontSize: 12 }}>Mitchell & Cole LLP</span>
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
          <div className="row" style={{ gap: 14, flex: 1, maxWidth: 420 }}>
            <div
              className="row"
              style={{
                flex: 1,
                background: "var(--paper)",
                border: "1.5px solid var(--line)",
                borderRadius: 10,
                padding: "9px 14px",
                gap: 10,
              }}
            >
              <Icon name="search" size={17} color="var(--text-3)" />
              <input
                placeholder="Search leads, messages..."
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 14,
                  color: "var(--ink)",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>
          </div>
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
