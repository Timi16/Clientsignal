"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { inpStyle } from "@/components/ui";
import { connectorCategories, connectorLogo, type Connector } from "@/lib/connectors";

type View = "all" | "connected" | "popular";

/* ---------- Monogram tile (brand colour + initials) ---------- */
function initials(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(" ").filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

function ConnectorLogo({ c, size = 44 }: { c: Connector; size?: number }) {
  const src = connectorLogo(c.name);
  if (src) {
    return (
      <div
        aria-hidden="true"
        style={{
          width: size, height: size, borderRadius: size * 0.27, flexShrink: 0,
          background: "#fff", border: "1px solid var(--line)",
          display: "grid", placeItems: "center", overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand icons, no optimization needed */}
        <img src={src} alt="" width={size * 0.72} height={size * 0.72} style={{ objectFit: "contain" }} />
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, borderRadius: size * 0.27, background: c.color, flexShrink: 0,
        display: "grid", placeItems: "center",
        color: isLight(c.color) ? "var(--ink)" : "#fff",
        fontWeight: 700, fontSize: size * 0.36, letterSpacing: "-0.02em",
      }}
    >
      {initials(c.name)}
    </div>
  );
}

/* ---------- Connect / manage dialog ---------- */
function ConnectorDialog({
  c, connected, busy, error, onConfirm, onClose,
}: {
  c: Connector;
  connected: boolean;
  busy: boolean;
  error: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  return (
    <div
      onClick={() => { if (!busy) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(11, 31, 58, 0.55)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "grid", placeItems: "center", padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="connector-dialog-title"
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 18, maxWidth: 440, width: "100%",
          maxHeight: "calc(100dvh - 32px)", overflowY: "auto",
          padding: "24px 24px 22px",
          boxShadow: "0 25px 60px rgba(11,31,58,0.25), 0 0 0 1px rgba(11,31,58,0.06)",
          animation: "connPopIn .3s cubic-bezier(.16,1.1,.3,1) both",
        }}
      >
        <div className="row between" style={{ alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div className="row" style={{ gap: 14, minWidth: 0 }}>
            <ConnectorLogo c={c} size={48} />
            <div style={{ minWidth: 0 }}>
              <h2 id="connector-dialog-title" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                {connected ? `Manage ${c.name}` : `Connect ${c.name}`}
              </h2>
              <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{c.cat}</div>
            </div>
          </div>
          <button onClick={onClose} disabled={busy} aria-label="Close" style={{ padding: 6, borderRadius: 8, color: "var(--text-3)", cursor: "pointer", flexShrink: 0 }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 16 }}>{c.desc}.</p>

        <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            {connected ? "ClientSignal can" : "ClientSignal will be able to"}
          </div>
          <div className="stack" style={{ gap: 9 }}>
            {c.access.map(a => (
              <div key={a} className="row" style={{ gap: 9, alignItems: "flex-start" }}>
                <Icon name="check" size={15} color="var(--verified)" stroke={2.5} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: "var(--text-1)", lineHeight: 1.45 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="row" style={{ gap: 8, alignItems: "flex-start", marginBottom: 18 }}>
          <Icon name="lock" size={14} color="var(--text-3)" style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5 }}>
            Encrypted in transit and at rest. You can disconnect at any time, and {c.name}&apos;s own terms apply to data held there.
          </span>
        </div>

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--coral-tint)", color: "var(--coral)", fontSize: 13.5, fontWeight: 500, marginBottom: 14 }}>
            {error}
          </div>
        )}

        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose} disabled={busy}>
            {connected ? "Done" : "Cancel"}
          </button>
          {connected ? (
            <button
              className="btn btn-ghost"
              style={{ flex: 1, color: "var(--coral)", borderColor: "var(--coral)", opacity: busy ? 0.6 : 1 }}
              onClick={onConfirm}
              disabled={busy}
            >
              {busy ? "Disconnecting..." : "Disconnect"}
            </button>
          ) : (
            <button className="btn btn-signal" style={{ flex: 1.4, opacity: busy ? 0.6 : 1 }} onClick={onConfirm} disabled={busy}>
              <Icon name="plug" size={15} color="#fff" />
              {busy ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes connPopIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ---------- Directory ---------- */
export function ConnectorsDirectory({
  title,
  subtitle,
  connectors,
  connected,
  loading = false,
  onToggle,
}: {
  title: string;
  subtitle: string;
  connectors: Connector[];
  connected: Set<string>;
  loading?: boolean;
  /** Persist the change; reject to surface an error in the dialog */
  onToggle: (name: string, connect: boolean) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("all");
  const [cat, setCat] = useState<string | null>(null);
  const [active, setActive] = useState<Connector | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(() => connectorCategories(connectors), [connectors]);
  const connectedCount = useMemo(() => connectors.filter(c => connected.has(c.name)).length, [connectors, connected]);

  // Search + view apply first so the category chips can show live counts
  const base = useMemo(() => {
    const q = query.trim().toLowerCase();
    return connectors.filter(c => {
      if (view === "connected" && !connected.has(c.name)) return false;
      if (view === "popular" && !c.popular) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
    });
  }, [connectors, connected, query, view]);

  const visible = cat ? base.filter(c => c.cat === cat) : base;

  const openDialog = (c: Connector) => { setError(""); setActive(c); };

  const confirm = async () => {
    if (!active || busy) return;
    const connect = !connected.has(active.name);
    setBusy(true);
    setError("");
    try {
      await onToggle(active.name, connect);
      setActive(null);
    } catch {
      setError(`We couldn't ${connect ? "connect" : "disconnect"} ${active.name}. Please try again.`);
    } finally {
      setBusy(false);
    }
  };

  const chip = (on: boolean): React.CSSProperties => ({
    padding: "7px 13px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
    border: on ? "1.5px solid var(--signal)" : "1.5px solid var(--line-2)",
    background: on ? "var(--signal-tint)" : "var(--card)",
    color: on ? "var(--signal-deep)" : "var(--text-2)",
    transition: "all .15s",
  });

  return (
    <>
      {/* header card */}
      <div
        className="card"
        style={{ padding: "clamp(22px, 4vw, 32px)", background: "var(--pine)", color: "#fff", border: "none", marginBottom: 22, position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="row between" style={{ position: "relative", gap: 24, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ minWidth: 0, flex: "1 1 320px" }}>
            <h1 style={{ fontSize: "clamp(22px, 3.5vw, 26px)", fontWeight: 700, marginBottom: 8 }}>{title}</h1>
            <p style={{ fontSize: 15, color: "rgba(234,240,249,0.65)", maxWidth: 560, lineHeight: 1.6 }}>{subtitle}</p>
          </div>
          <div className="row" style={{ gap: 28 }}>
            <div>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{connectors.length}</div>
              <div style={{ fontSize: 12, color: "rgba(234,240,249,0.5)" }}>Connectors</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--gold-soft)" }}>{loading ? "–" : connectedCount}</div>
              <div style={{ fontSize: 12, color: "rgba(234,240,249,0.5)" }}>Connected</div>
            </div>
          </div>
        </div>
      </div>

      {/* search + view */}
      <div className="row" style={{ gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Icon name="search" size={17} color="var(--text-3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${connectors.length} connectors...`}
            aria-label="Search connectors"
            style={{ ...inpStyle, padding: "11px 38px 11px 40px", fontSize: 14.5 }}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", padding: 4, color: "var(--text-3)", cursor: "pointer" }}>
              <Icon name="x" size={15} />
            </button>
          )}
        </div>
        <div className="row" style={{ gap: 4, padding: 4, borderRadius: 12, background: "var(--paper-2)" }}>
          {([["all", "All"], ["popular", "Popular"], ["connected", `Connected${connectedCount ? ` · ${connectedCount}` : ""}`]] as [View, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              aria-pressed={view === k}
              style={{
                padding: "7px 14px", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                background: view === k ? "var(--card)" : "transparent",
                color: view === k ? "var(--ink)" : "var(--text-3)",
                boxShadow: view === k ? "0 1px 3px rgba(11,31,58,0.12)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* category chips */}
      <div className="row conn-chips thin-scroll" style={{ gap: 8, marginBottom: 22 }}>
        <button onClick={() => setCat(null)} aria-pressed={cat === null} style={chip(cat === null)}>
          All categories <span style={{ opacity: 0.6 }}>{base.length}</span>
        </button>
        {categories.map(k => {
          const n = base.filter(c => c.cat === k).length;
          return (
            <button key={k} onClick={() => setCat(cat === k ? null : k)} aria-pressed={cat === k} style={{ ...chip(cat === k), opacity: n === 0 && cat !== k ? 0.45 : 1 }}>
              {k} <span style={{ opacity: 0.6 }}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)", fontSize: 15 }}>Loading connectors…</div>
      ) : visible.length === 0 ? (
        <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>
            {view === "connected" && !query && !cat ? "Nothing connected yet" : "No connectors match"}
          </div>
          <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 16 }}>
            {view === "connected" && !query && !cat ? "Connect an app and it will show up here." : "Try a different search or clear your filters."}
          </p>
          <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(""); setCat(null); setView("all"); }}>
            Browse all connectors
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))", gap: 16 }}>
          {visible.map(c => {
            const on = connected.has(c.name);
            return (
              <div key={c.name} className="card" style={{ padding: "20px 20px", display: "flex", flexDirection: "column" }}>
                <div className="row" style={{ gap: 13, marginBottom: 13 }}>
                  <ConnectorLogo c={c} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.cat}</div>
                  </div>
                  {on && (
                    <span className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)", fontSize: 11.5, padding: "3px 9px" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--verified)" }} />
                      Active
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.5, marginBottom: 16, flex: 1 }}>{c.desc}</p>
                <button onClick={() => openDialog(c)} className={`btn btn-sm ${on ? "btn-ghost" : "btn-signal"}`} style={{ width: "100%" }}>
                  <Icon name={on ? "settings" : "plug"} size={15} />
                  {on ? "Manage" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* chips wrap on desktop, swipe sideways on phones */}
      <style>{`
        .conn-chips { flex-wrap: wrap; }
        @media (max-width: 760px) {
          .conn-chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 6px; margin-right: -4px; }
        }
      `}</style>

      {active && (
        <ConnectorDialog
          c={active}
          connected={connected.has(active.name)}
          busy={busy}
          error={error}
          onConfirm={confirm}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
