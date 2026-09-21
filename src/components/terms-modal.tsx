"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Mark } from "@/components/ui";
import { getLegalSections, TERMS_EFFECTIVE, type LegalDoc, type LegalRole } from "@/lib/legal";

/* ===== Terms & Conditions popup =====
   mode "accept" — shown before an account is created; the user must tick the
   box and agree. mode "read" — opened from the inline links, close-only. */
export function TermsModal({ open, ...rest }: TermsModalProps & { open: boolean }) {
  // Mounting the dialog only while open resets the tab + checkbox on every open
  if (!open) return null;
  return <TermsDialog {...rest} />;
}

interface TermsModalProps {
  role: LegalRole;
  mode?: "accept" | "read";
  initialDoc?: LegalDoc;
  loading?: boolean;
  onAccept?: () => void;
  onClose: () => void;
}

function TermsDialog({
  role,
  mode = "accept",
  initialDoc = "terms",
  loading = false,
  onAccept,
  onClose,
}: TermsModalProps) {
  const [doc, setDoc] = useState<LegalDoc>(initialDoc);
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [doc]);

  // Escape to close + lock page scroll behind the popup
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [loading, onClose]);

  const sections = getLegalSections(doc, role);

  return (
    <div
      onClick={() => { if (!loading) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(11, 31, 58, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "grid", placeItems: "center",
        padding: 16,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          maxWidth: 560,
          width: "100%",
          maxHeight: "min(720px, calc(100dvh - 32px))",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(11,31,58,0.25), 0 0 0 1px rgba(11,31,58,0.06)",
          animation: "termsPopIn .35s cubic-bezier(.16,1.1,.3,1) both",
        }}
      >
        {/* Header */}
        <div style={{ padding: "22px 24px 0" }}>
          <div className="row between" style={{ alignItems: "flex-start", gap: 12 }}>
            <div className="row" style={{ gap: 12 }}>
              <Mark size={34} />
              <div>
                <h2 id="terms-modal-title" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                  {mode === "accept" ? "Before you create your account" : "Terms & Privacy"}
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>
                  {mode === "accept" ? "Please review and accept our terms to continue." : `Effective ${TERMS_EFFECTIVE}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
              style={{ padding: 6, borderRadius: 8, color: "var(--text-3)", cursor: "pointer", flexShrink: 0 }}
            >
              <Icon name="x" size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="row" style={{ gap: 4, marginTop: 18, borderBottom: "1px solid var(--line)" }}>
            {([["terms", "Terms of Service"], ["privacy", "Privacy Policy"]] as [LegalDoc, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setDoc(k)}
                aria-pressed={doc === k}
                style={{
                  padding: "9px 12px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: doc === k ? "var(--signal)" : "var(--text-3)",
                  borderBottom: doc === k ? "2px solid var(--signal)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable legal text */}
        <div
          ref={scrollRef}
          className="thin-scroll"
          tabIndex={0}
          style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "18px 24px", background: "var(--paper)" }}
        >
          {mode === "accept" && (
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 14 }}>Effective {TERMS_EFFECTIVE}</p>
          )}
          <div className="stack" style={{ gap: 18 }}>
            {sections.map(s => (
              <section key={s.title}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>{s.title}</h3>
                {s.body.map((p, i) => (
                  <p key={i} style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--text-2)", marginTop: i === 0 ? 0 : 8 }}>
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px 20px", borderTop: "1px solid var(--line)" }}>
          {mode === "accept" ? (
            <>
              <label
                className="row"
                style={{ gap: 10, fontSize: 13.5, color: "var(--text-1)", cursor: "pointer", lineHeight: 1.45, alignItems: "flex-start", marginBottom: 14 }}
              >
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  disabled={loading}
                  style={{ width: 17, height: 17, accentColor: "var(--signal)", cursor: "pointer", marginTop: 1, flexShrink: 0 }}
                />
                <span>
                  I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                  {role === "client" ? ", and I consent to be contacted about my inquiry." : "."}
                </span>
              </label>
              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose} disabled={loading}>
                  Decline
                </button>
                <button
                  className="btn btn-signal"
                  style={{ flex: 2, opacity: !agreed || loading ? 0.55 : 1, cursor: !agreed || loading ? "not-allowed" : "pointer" }}
                  disabled={!agreed || loading}
                  onClick={onAccept}
                >
                  {loading ? "Creating account..." : "Agree & create account"}
                </button>
              </div>
            </>
          ) : (
            <button className="btn btn-signal" style={{ width: "100%" }} onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes termsPopIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
