"use client";

import { useContext, useState, ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo, Avatar } from "@/components/ui";
import { CASE_STATUS, CASE_TYPES } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { useSocket } from "@/lib/socket";
import { ClientCaseContext } from "@/lib/client-case-context";
export type { ActiveCaseData, ActiveAttorney } from "@/lib/client-case-context";
import type { ActiveCaseData } from "@/lib/client-case-context";

/* ---------- Hook ---------- */
export function useActiveCase() {
  const ctx = useContext(ClientCaseContext);
  return {
    activeCase: ctx.activeCase,
    cases: ctx.cases,
    attorney: ctx.attorney,
    setActiveId: ctx.setActiveId,
    loading: ctx.loading,
    refreshCases: ctx.refreshCases,
  };
}

/* ---------- buildTimeline ---------- */
export function buildTimeline(stage: number, attyName: string | null) {
  const steps = [
    { t: "Case submitted", icon: "pen", note: "Your inquiry was received and encrypted." },
    { t: "Contact verified", icon: "phone", note: "Phone verified by SMS code." },
    { t: "Case scored & qualified", icon: "zap", note: "Reviewed for accuracy, intent & case type." },
    { t: "Matched to a verified attorney", icon: "shield", note: attyName ? `Routed to ${attyName}.` : "Searching for the best-fit attorney\u2026" },
    { t: "Attorney reviewed your case", icon: "eye", note: attyName ? `${attyName.split(" ")[0]} opened and reviewed your details.` : "Awaiting attorney review." },
    { t: "Attorney reached out", icon: "message", note: "A secure message thread is open \u2014 reply to continue." },
    { t: "Consultation scheduled", icon: "clock", note: "Pick a time that works for you." },
    { t: "Retainer & representation", icon: "doc", note: "Review and sign your engagement agreement." },
  ];
  return steps.map((s, i) => ({
    ...s,
    done: i < stage,
    current: i === stage,
    d: i < stage ? "Done" : i === stage ? "In progress" : "Upcoming",
  }));
}

/* ---------- Nav config ---------- */
const NAV = [
  { label: "My Case", icon: "grid", href: "/client/dashboard" },
  { label: "Cases", icon: "inbox", href: "/client/cases" },
  { label: "Case Timeline", icon: "clock", href: "/client/timeline" },
  { label: "Documents", icon: "doc", href: "/client/documents", badgeKey: "docs" as const },
  { label: "Messages", icon: "message", href: "/client/messages", badgeKey: "msgs" as const },
  { label: "My Attorney", icon: "user", href: "/client/attorney" },
  { label: "Settings", icon: "settings", href: "/client/settings" },
];

const TITLES: Record<string, string> = {
  "/client/dashboard": "Dashboard",
  "/client/cases": "My Cases",
  "/client/timeline": "Case Timeline",
  "/client/documents": "Documents",
  "/client/messages": "Messages",
  "/client/attorney": "My Attorney",
  "/client/settings": "Settings",
  "/client/new-case": "New Case",
};

/* ---------- Badge counts ---------- */
function getBadges(c: ActiveCaseData | null) {
  if (!c) return { docs: 0, msgs: 0 };
  const reqDocs = (c.docs || []).filter(d => d.status === "requested" || d.status === "missing").length;
  return { docs: reqDocs, msgs: c.unreadCount };
}

/* ---------- format date ---------- */
function formatOpened(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
}

/* ---------- ClientLayout ---------- */
export default function ClientLayout({
  children,
  title: titleOverride,
  action,
}: {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [caseDropOpen, setCaseDropOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();

  const { cases, activeCase, attorney, setActiveId } = useActiveCase();
  const { notifications: socketNotifications, unreadCount: socketUnread, markAllRead } = useSocket();

  const userName = user?.name || "User";

  const caseStatus = activeCase ? (CASE_STATUS[activeCase.status] || CASE_STATUS.pending) : CASE_STATUS.pending;
  const caseType = activeCase ? (CASE_TYPES[activeCase.practiceArea] || { label: activeCase.practiceArea, color: "var(--text-2)", tint: "var(--pine-tint)" }) : null;
  const badges = getBadges(activeCase);

  // Merge case-derived notifications with real-time socket notifications
  const caseNotifications = activeCase ? [
    ...(activeCase.unreadCount > 0 && attorney ? [{
      title: `${attorney.name.split(" ")[0]} sent a message`,
      body: `${activeCase.unreadCount} unread update on ${activeCase.id}`,
      icon: "message",
      color: "var(--signal)",
      href: "/client/messages",
    }] : []),
    ...((activeCase.docs || [])
      .filter(d => d.status === "requested" || d.status === "missing")
      .slice(0, 2)
      .map(d => ({
        title: d.status === "requested" ? "Document requested" : "Document missing",
        body: `${d.fileName} · ${activeCase.id}`,
        icon: d.status === "requested" ? "upload" : "doc",
        color: d.status === "requested" ? "var(--amber)" : "var(--coral)",
        href: "/client/documents",
      }))),
  ] : [];

  const realtimeNotifications = socketNotifications.filter(n => !n.read).slice(0, 5).map(n => ({
    title: n.title,
    body: n.body,
    icon: n.icon,
    color: n.color,
    href: n.href,
  }));

  const notifications = [...realtimeNotifications, ...caseNotifications];
  const notificationCount = socketUnread + caseNotifications.length;

  const headerTitle = titleOverride || TITLES[pathname] || "Dashboard";

  return (
    <div className="app-grid" style={{ display: "grid", gridTemplateColumns: "256px 1fr", minHeight: "100vh" }}>
      {/* ---- Sidebar ---- */}
      <aside
        className="app-side thin-scroll"
        style={{
          background: "#fff",
          borderRight: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflow: "auto",
        }}
      >
        <Link href="/" aria-label="Go to home" style={{ padding: "22px 22px 18px", display: "flex" }}>
          <Logo size={28} />
        </Link>

        {/* Case selector card */}
        {activeCase ? (
          <div style={{ padding: "0 16px", marginBottom: 8 }}>
            <button
              onClick={() => setCaseDropOpen(!caseDropOpen)}
              style={{
                width: "100%",
                background: "var(--pine)",
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textAlign: "left",
                position: "relative",
              }}
            >
              <div className="row" style={{ gap: 8, width: "100%" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: caseStatus.dot, flex: "none" }} />
                <span className="side-label" style={{ fontSize: 13, fontWeight: 600, color: "#fff", flex: 1 }}>
                  {activeCase.id}
                </span>
                <Icon name="chevD" size={16} color="rgba(255,255,255,0.5)" />
              </div>
              <div className="side-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  {caseType?.label}
                </span>
              </div>
              <div className="side-label">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: caseStatus.color,
                    background: "rgba(255,255,255,0.1)",
                    padding: "3px 9px",
                    borderRadius: 99,
                  }}
                >
                  {caseStatus.label}
                </span>
              </div>
            </button>

            {caseDropOpen && (
              <div
                style={{
                  marginTop: 6,
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  boxShadow: "var(--sh-md)",
                  overflow: "hidden",
                }}
              >
                {cases.map(c => {
                  const st = CASE_STATUS[c.status] || CASE_STATUS.pending;
                  const ct = CASE_TYPES[c.practiceArea] || { label: c.practiceArea };
                  return (
                    <button
                      key={c.id}
                      className="dd-item"
                      onClick={() => {
                        setActiveId(c.id);
                        setCaseDropOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        textAlign: "left",
                        background: c.id === activeCase.id ? "var(--paper)" : "transparent",
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: st.dot, flex: "none" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{c.id}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{ct?.label}</div>
                      </div>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: st.color,
                          background: st.tint,
                          padding: "2px 8px",
                          borderRadius: 99,
                        }}
                      >
                        {st.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: "0 16px", marginBottom: 8 }}>
            <div style={{ background: "var(--pine)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>No cases yet</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px 0" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            const badge = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--signal)" : "var(--text-2)",
                  background: active ? "var(--signal-tint)" : "transparent",
                  transition: "background .15s, color .15s",
                  marginBottom: 2,
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "var(--paper)";
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <Icon name={item.icon} size={19} color={active ? "var(--signal)" : "var(--text-3)"} />
                <span className="side-label" style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                {badge > 0 && (
                  <span
                    className="side-label"
                    style={{
                      background: "var(--coral)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Avatar name={userName} size={36} />
          <div className="side-label" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{userName}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{user?.email}</div>
          </div>
          <button
            onClick={async () => { await logout(); router.push("/client/login"); }}
            title="Log out"
            style={{ color: "var(--text-3)" }}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>

      {/* ---- Main ---- */}
      <main
        className="thin-scroll"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 32px",
            borderBottom: "1px solid var(--line)",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{headerTitle}</h1>
          <div className="row" style={{ gap: 14, position: "relative" }}>
            {action}
            <button
              onClick={() => { setNotificationsOpen(open => !open); markAllRead(); }}
              aria-label="Show notifications"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid var(--line)",
                display: "grid",
                placeItems: "center",
                color: "var(--text-2)",
                position: "relative",
              }}
            >
              <Icon name="bell" size={18} />
              {notificationCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 999,
                    background: "var(--coral)",
                    border: "2px solid #fff",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    display: "grid",
                    placeItems: "center",
                    lineHeight: 1,
                  }}
                >
                  {notificationCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: 48,
                  right: 0,
                  width: 360,
                  padding: 8,
                  boxShadow: "var(--sh-lg)",
                  zIndex: 40,
                }}
              >
                <div className="row between" style={{ padding: "10px 12px 12px", borderBottom: "1px solid var(--line)" }}>
                  <strong style={{ fontSize: 14 }}>Notifications</strong>
                  {activeCase && <span className="pill" style={{ background: "var(--blue-tint)", color: "var(--signal)", fontSize: 11 }}>{activeCase.id}</span>}
                </div>
                <div className="stack" style={{ gap: 4, paddingTop: 6 }}>
                  {notifications.map(n => (
                    <button
                      key={n.title + n.body}
                      onClick={() => {
                        setNotificationsOpen(false);
                        router.push(n.href);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: 10,
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        textAlign: "left",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--paper)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--paper-2)", color: n.color, display: "grid", placeItems: "center", flex: "none" }}>
                        <Icon name={n.icon} size={16} />
                      </span>
                      <span className="stack" style={{ gap: 2, flex: 1 }}>
                        <strong style={{ fontSize: 13.5, color: "var(--ink)" }}>{n.title}</strong>
                        <span style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.4 }}>{n.body}</span>
                      </span>
                      <Icon name="arrowR" size={14} color="var(--text-3)" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        <div style={{ flex: 1, padding: "28px 32px 40px" }}>{children}</div>
      </main>
    </div>
  );
}

export { formatOpened };
