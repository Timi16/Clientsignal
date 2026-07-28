"use client";

import { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/attorney-layout";
import { Avatar, CaseTag } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { listCases, listNotes, createNote, type Case, type CaseNote } from "@/lib/api/cases";

interface NoteWithCase extends CaseNote {
  caseMatter: string;
  casePracticeArea: string;
}

const TAG_STYLES: Record<string, { color: string; tint: string }> = {
  "follow-up":       { color: "var(--signal)",  tint: "var(--signal-tint)" },
  "initial consult": { color: "var(--amber)",   tint: "var(--amber-tint)" },
  urgent:            { color: "var(--coral)",    tint: "var(--coral-tint)" },
  update:            { color: "var(--verified)", tint: "var(--verified-tint)" },
};

function tagStyle(tag: string) {
  const key = tag.toLowerCase();
  return TAG_STYLES[key] || { color: "var(--text-2)", tint: "var(--paper-2)" };
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteWithCase[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New-note form state
  const [showForm, setShowForm] = useState(false);
  const [newCaseId, setNewCaseId] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { cases: caseList } = await listCases({ limit: 100 });
      setCases(caseList);

      const allNotes: NoteWithCase[] = [];
      await Promise.all(
        caseList.map(async (c) => {
          try {
            const { notes: caseNotes } = await listNotes(c.id);
            for (const n of caseNotes) {
              allNotes.push({
                ...n,
                caseMatter: c.matter,
                casePracticeArea: c.practiceArea,
              });
            }
          } catch {
            // skip cases whose notes fail to load
          }
        })
      );

      // Sort newest first
      allNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotes(allNotes);
    } catch {
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async () => {
    if (!newCaseId || !newBody.trim()) return;
    setSaving(true);
    try {
      await createNote(newCaseId, newBody.trim(), newTag.trim() || undefined);
      setShowForm(false);
      setNewBody("");
      setNewTag("");
      setNewCaseId("");
      await fetchNotes();
    } catch {
      setError("Failed to create note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="row between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>Case notes</h1>
        <button className="btn btn-signal btn-sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New note"}
        </button>
      </div>

      {/* New-note form */}
      {showForm && (
        <div className="card" style={{ padding: "24px 28px", marginBottom: 20 }}>
          <div className="stack" style={{ gap: 14 }}>
            <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
              <select
                value={newCaseId}
                onChange={(e) => setNewCaseId(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid var(--line-2)",
                  background: "var(--paper)",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                <option value="">Select a case...</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.matter} ({c.practiceArea})
                  </option>
                ))}
              </select>
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tag (e.g. Follow-up)"
                style={{
                  width: 180,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid var(--line-2)",
                  background: "var(--paper)",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              />
            </div>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              placeholder="Write your note..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1.5px solid var(--line-2)",
                background: "var(--paper)",
                fontSize: 14,
                color: "var(--ink)",
                resize: "vertical",
                lineHeight: 1.7,
              }}
            />
            <div className="row" style={{ gap: 10, justifyContent: "flex-end" }}>
              <button
                className="btn btn-signal btn-sm"
                onClick={handleCreate}
                disabled={saving || !newCaseId || !newBody.trim()}
                style={{ opacity: saving || !newCaseId || !newBody.trim() ? 0.5 : 1 }}
              >
                {saving ? "Saving..." : "Save note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "14px 20px", marginBottom: 16, borderRadius: 10, background: "var(--coral-tint)", color: "var(--coral)", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)", fontSize: 15 }}>
          Loading notes...
        </div>
      )}

      {/* Empty */}
      {!loading && !error && notes.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)", fontSize: 15 }}>
          No case notes yet. Create your first note above.
        </div>
      )}

      {/* Notes list */}
      {!loading && notes.length > 0 && (
        <div className="stack" style={{ gap: 16 }}>
          {notes.map((n) => {
            const ts = tagStyle(n.tag || "");
            return (
              <div key={n.id} className="card" style={{ padding: "24px 28px" }}>
                <div className="row" style={{ gap: 14, marginBottom: 16 }}>
                  <Avatar name={n.caseMatter} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 650, fontSize: 15, color: "var(--ink)" }}>
                        {n.caseMatter}
                      </span>
                      {n.tag && (
                        <span
                          className="pill"
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            background: ts.tint,
                            color: ts.color,
                          }}
                        >
                          {n.tag}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                  <CaseTag type={n.casePracticeArea} sm />
                </div>
                <p style={{ fontSize: 14.5, color: "var(--text-1)", lineHeight: 1.7 }}>{n.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
