"use client";

import { useState } from "react";
import { useI18n, LANGUAGES, type Locale } from "@/lib/i18n";
import { Mark } from "./ui";

/* ===== Language Selector Popup ===== */
export function LanguageSelectorPopup() {
  const { locale, setLocale, showSelector, setShowSelector, t } = useI18n();
  const [selected, setSelected] = useState<Locale>(locale);

  if (!showSelector) return null;

  const handleContinue = () => {
    setLocale(selected);
    setShowSelector(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(11, 31, 58, 0.6)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "grid", placeItems: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: "26px 22px 22px",
        maxWidth: 320,
        width: "100%",
        boxShadow: "0 25px 60px rgba(11,31,58,0.25), 0 0 0 1px rgba(11,31,58,0.06)",
        animation: "langPopIn .35s cubic-bezier(.16,1.1,.3,1) both",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <Mark size={34} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 17, fontWeight: 700, textAlign: "center",
          color: "var(--ink)", marginBottom: 4, letterSpacing: "-0.02em",
        }}>
          {t.languageSelector.title}
        </h2>
        <p style={{
          fontSize: 13, color: "var(--text-2)", textAlign: "center",
          marginBottom: 18, lineHeight: 1.4,
        }}>
          {t.languageSelector.subtitle}
        </p>

        {/* Language options — two compact tiles side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                aria-pressed={isSelected}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  padding: "12px 8px",
                  borderRadius: 12,
                  border: isSelected ? "2px solid var(--signal)" : "2px solid var(--line)",
                  background: isSelected ? "var(--signal-tint)" : "var(--card)",
                  cursor: "pointer",
                  transition: "all .2s",
                  outline: "none",
                }}
              >
                <span style={{
                  fontSize: 14.5, fontWeight: 600,
                  color: isSelected ? "var(--signal-deep)" : "var(--ink)",
                }}>
                  {lang.native}
                </span>
                <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="btn btn-signal"
          style={{
            width: "100%", padding: "11px 0",
            fontSize: 14.5, fontWeight: 600,
            borderRadius: 10,
          }}
        >
          {t.languageSelector.continue}
        </button>
      </div>

      <style>{`
        @keyframes langPopIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ===== Small language switcher button (for nav bar) ===== */
export function LanguageSwitcher() {
  const { locale, setShowSelector } = useI18n();
  const current = LANGUAGES.find(l => l.code === locale);

  return (
    <button
      onClick={() => setShowSelector(true)}
      title="Change language"
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 12px",
        borderRadius: "var(--r-pill)",
        border: "1px solid var(--line)",
        background: "var(--card)",
        cursor: "pointer",
        fontSize: 13, fontWeight: 600,
        color: "var(--text-2)",
        transition: "all .2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--signal)";
        (e.currentTarget as HTMLElement).style.color = "var(--signal)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
        (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
      }}
    >
      {/* flag removed */}
      <span>{current?.native}</span>
    </button>
  );
}
