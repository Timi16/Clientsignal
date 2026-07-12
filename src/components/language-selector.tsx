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
        borderRadius: 22,
        padding: "42px 36px 36px",
        maxWidth: 420,
        width: "100%",
        boxShadow: "0 25px 60px rgba(11,31,58,0.25), 0 0 0 1px rgba(11,31,58,0.06)",
        animation: "langPopIn .35s cubic-bezier(.16,1.1,.3,1) both",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Mark size={48} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 22, fontWeight: 700, textAlign: "center",
          color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.02em",
        }}>
          {t.languageSelector.title}
        </h2>
        <p style={{
          fontSize: 14.5, color: "var(--text-2)", textAlign: "center",
          marginBottom: 28, lineHeight: 1.4,
        }}>
          {t.languageSelector.subtitle}
        </p>

        {/* Language options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 18px",
                  borderRadius: 14,
                  border: isSelected ? "2px solid var(--signal)" : "2px solid var(--line)",
                  background: isSelected ? "var(--signal-tint)" : "var(--card)",
                  cursor: "pointer",
                  transition: "all .2s",
                  outline: "none",
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1 }}>{lang.flag}</span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, flex: 1 }}>
                  <span style={{
                    fontSize: 15.5, fontWeight: 600,
                    color: isSelected ? "var(--signal-deep)" : "var(--ink)",
                  }}>
                    {lang.native}
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                    {lang.name}
                  </span>
                </div>
                {/* Radio indicator */}
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  border: isSelected ? "2px solid var(--signal)" : "2px solid var(--line-2)",
                  display: "grid", placeItems: "center",
                  transition: "all .2s",
                }}>
                  {isSelected && (
                    <div style={{
                      width: 12, height: 12, borderRadius: "50%",
                      background: "var(--signal)",
                    }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="btn btn-signal"
          style={{
            width: "100%", padding: "14px 0",
            fontSize: 16, fontWeight: 600,
            borderRadius: 12,
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
      <span style={{ fontSize: 16, lineHeight: 1 }}>{current?.flag}</span>
      <span>{current?.native}</span>
    </button>
  );
}
