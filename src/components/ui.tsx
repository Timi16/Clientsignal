"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { PORTRAITS, CASE_TYPES } from "@/lib/data";

/* ---------- Signal mark: navy tile, gold broadcast arcs, blue node ---------- */
export function Mark({ size = 30, live = false }: { size?: number; live?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0B1F3A" />
      <rect x="1" y="1" width="38" height="38" rx="11" fill="none" stroke="#D4A017" strokeOpacity="0.35" strokeWidth="1" />
      <g stroke="#D4A017" strokeWidth="2.3" strokeLinecap="round" fill="none" transform="rotate(-45 20 20)">
        <path d="M20 27 a7 7 0 0 0 0 -14" opacity="0.95" style={live ? { animation: "broadcast 2s infinite" } : undefined} />
        <path d="M20 31 a11 11 0 0 0 0 -22" opacity="0.6" style={live ? { animation: "broadcast 2s infinite .3s" } : undefined} />
        <path d="M20 35 a15 15 0 0 0 0 -30" opacity="0.3" style={live ? { animation: "broadcast 2s infinite .6s" } : undefined} />
      </g>
      <circle cx="13.5" cy="20" r="3.6" fill="#3B82F6" />
      <circle cx="13.5" cy="20" r="6" fill="none" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ light = false, size = 30, sub = false }: { light?: boolean; size?: number; sub?: boolean }) {
  return (
    <div className="row" style={{ gap: 11 }}>
      <Mark size={size} />
      <div className="stack" style={{ lineHeight: 1 }}>
        <span style={{ fontWeight: 700, fontSize: size * 0.58, letterSpacing: "-0.022em", color: light ? "#fff" : "var(--ink)" }}>
          Client<span style={{ color: light ? "var(--gold-soft)" : "var(--signal)" }}>Signal</span>
        </span>
        {sub && (
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: light ? "rgba(234,240,249,0.55)" : "var(--text-3)", marginTop: 4 }}>
            Legal Lead Platform
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- Score ring ---------- */
export function ScoreRing({ value = 80, size = 60, stroke = 6, color, label, mono = true }: {
  value?: number; size?: number; stroke?: number; color?: string; label?: string; mono?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const col = color || (value >= 80 ? "var(--verified)" : value >= 55 ? "var(--amber)" : "var(--coral)");
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--line-2)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={col} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s var(--ease)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div className={mono ? "mono" : ""} style={{ fontWeight: 700, fontSize: size * 0.3, color: "var(--ink)", lineHeight: 1 }}>{value}</div>
          {label && <div className="mono" style={{ fontSize: 8, letterSpacing: "0.1em", color: "var(--text-3)", textTransform: "uppercase" }}>{label}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Verified badge ---------- */
export function Verified({ size = 16 }: { size?: number }) {
  return (
    <span title="Verified attorney" style={{ display: "inline-flex", width: size, height: size, borderRadius: "50%", background: "var(--verified)", alignItems: "center", justifyContent: "center", flex: "none" }}>
      <Icon name="check" size={size * 0.62} color="#fff" stroke={3} />
    </span>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name = "?", size = 40, color: colorProp, noPhoto = false }: {
  name?: string; size?: number; color?: string; noPhoto?: boolean;
}) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["#0B1F3A", "#2563EB", "#475569", "#B8870F", "#16A34A", "#7C3AED"];
  const bg = colorProp || colors[name.charCodeAt(0) % colors.length];
  const photo = !noPhoto && PORTRAITS[name];
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.36, flex: "none", letterSpacing: "-0.02em", overflow: "hidden", position: "relative" }}>
      {photo && !err
        ? <img src={photo} alt={name} width={size} height={size} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initials}
    </div>
  );
}

/* ---------- Photo ---------- */
export function Photo({ src, name = "?", w = "100%", h = "100%", radius = 16, kenburns = false, className = "", style }: {
  src?: string; name?: string; w?: string | number; h?: string | number; radius?: number; kenburns?: boolean; className?: string; style?: React.CSSProperties;
}) {
  const url = src || PORTRAITS[name];
  const [err, setErr] = useState(false);
  if (!url || err) {
    return (
      <div style={{ width: w, height: h, borderRadius: radius, background: "var(--pine)", display: "grid", placeItems: "center", color: "var(--gold-soft)", fontWeight: 700, fontSize: 28, ...style }}>
        {name.split(" ").map(s => s[0]).slice(0, 2).join("")}
      </div>
    );
  }
  return (
    <div className={"ph" + (kenburns ? " ph-kb" : "") + (className ? " " + className : "")} style={{ width: w, height: h, borderRadius: radius, ...style }}>
      <img src={url} alt={name} loading="lazy" onError={() => setErr(true)} />
    </div>
  );
}

/* ---------- CaseTag ---------- */
export function CaseTag({ type, sm }: { type: string; sm?: boolean }) {
  const t = CASE_TYPES[type] || { label: type, color: "var(--text-2)", tint: "var(--pine-tint)" };
  return (
    <span className="pill" style={{ background: t.tint, color: t.color, padding: sm ? "4px 10px" : "6px 13px", fontSize: sm ? 11.5 : 12.5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.color }} />
      {t.label}
    </span>
  );
}

/* ---------- Field ---------- */
export function Field({ label, type = "text", placeholder, icon, defaultValue }: {
  label: string; type?: string; placeholder?: string; icon?: string; defaultValue?: string;
}) {
  return (
    <label className="stack" style={{ gap: 8 }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-1)" }}>{label}</span>
      <div className="row" style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 14, color: "var(--text-3)" }}><Icon name={icon} size={18} /></span>}
        <input type={type} placeholder={placeholder} defaultValue={defaultValue}
          style={{ width: "100%", padding: icon ? "12px 14px 12px 42px" : "12px 14px", borderRadius: 10, border: "1.5px solid var(--line-2)", background: "var(--card)", fontSize: 15, color: "var(--ink)", outline: "none", transition: "border-color .2s, box-shadow .2s" }}
          onFocus={e => { e.target.style.borderColor = "var(--signal)"; e.target.style.boxShadow = "0 0 0 3px var(--signal-tint)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--line-2)"; e.target.style.boxShadow = "none"; }} />
      </div>
    </label>
  );
}

/* ---------- Spark chart ---------- */
export function Spark({ data, w = 120, h = 36, color = "var(--pine)" }: {
  data: number[]; w?: number; h?: number; color?: string;
}) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min || 1)) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / (max - min || 1)) * (h - 4) - 2} r="3" fill={color} />
    </svg>
  );
}

/* ---------- Bars chart ---------- */
export function Bars({ data, h = 130, color = "var(--pine)" }: {
  data: { l: string; v: number; hot?: boolean }[]; h?: number; color?: string;
}) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="row" style={{ alignItems: "flex-end", gap: 10, height: h }}>
      {data.map((d, i) => (
        <div key={i} className="stack" style={{ flex: 1, alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", maxWidth: 38, height: `${(d.v / max) * (h - 26)}px`, background: d.hot ? "var(--signal-deep)" : color, borderRadius: "7px 7px 3px 3px", transition: "height .6s var(--ease)" }} />
          <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)" }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Chooser Art SVGs ---------- */
export function ChooserArt({ kind }: { kind: string }) {
  if (kind === "client") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <rect width="56" height="56" rx="16" fill="var(--blue-tint)" />
        <circle cx="28" cy="22" r="7" fill="none" stroke="var(--signal)" strokeWidth="2.4" />
        <path d="M16 41c0-6.6 5.4-10 12-10s12 3.4 12 10" fill="none" stroke="var(--signal)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="40" cy="16" r="8" fill="var(--signal)" />
        <path d="M36.5 16l2.3 2.3 4.2-4.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <rect width="56" height="56" rx="16" fill="var(--signal-tint)" />
      <path d="M28 12l13 6.5v6c0 8-5.5 13.5-13 16-7.5-2.5-13-8-13-16v-6L28 12z" fill="none" stroke="var(--signal)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M22 28l4 4 9-9" stroke="var(--signal)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- LField (intake label field) ---------- */
export const inpStyle: React.CSSProperties = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid var(--line-2)", background: "var(--card)", fontSize: 15, color: "var(--ink)", outline: "none" };

export function LField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="stack" style={{ gap: 8 }}><span style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</span>{children}</label>;
}
