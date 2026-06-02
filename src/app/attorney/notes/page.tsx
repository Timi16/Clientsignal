"use client";

import AppLayout from "@/components/attorney-layout";
import { Avatar, CaseTag } from "@/components/ui";

const NOTES = [
  {
    name: "Marcus Webb",
    time: "Today, 10:35 AM",
    tag: "Follow-up",
    tagColor: "var(--signal)",
    tagTint: "var(--signal-tint)",
    body: "Spoke with Marcus about his rear-end collision on I-35. He was treated at the ER for neck and lower-back strain. The other driver was cited. He has a police report, photos of both vehicles, and ER discharge paperwork. Scheduled a follow-up for Thursday to review the demand letter draft.",
    type: "injury",
  },
  {
    name: "Priya Nair",
    time: "Yesterday, 3:15 PM",
    tag: "Initial consult",
    tagColor: "var(--amber)",
    tagTint: "var(--amber-tint)",
    body: "Priya's H-1B is employer-sponsored and her green card application has stalled. The current status expires in approximately 90 days. Discussed fallback options (H-1B transfer, self-petition). She will send over her current visa documents and the employer's sponsorship letter by end of week.",
    type: "immigration",
  },
  {
    name: "Tom Reyes",
    time: "Yesterday, 11:00 AM",
    tag: "Urgent",
    tagColor: "var(--coral)",
    tagTint: "var(--coral-tint)",
    body: "Tom was arrested on a DUI charge last night. No prior record. Arraignment is in 5 days. He needs representation immediately. Reviewed the police report — possible issues with the stop. Will file notice of appearance today and request body-cam footage.",
    type: "criminal",
  },
];

export default function NotesPage() {
  return (
    <AppLayout>
      <div className="row between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>Case notes</h1>
        <button className="btn btn-signal btn-sm">
          + New note
        </button>
      </div>

      <div className="stack" style={{ gap: 16 }}>
        {NOTES.map((n, i) => (
          <div key={i} className="card" style={{ padding: "24px 28px" }}>
            <div className="row" style={{ gap: 14, marginBottom: 16 }}>
              <Avatar name={n.name} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 650, fontSize: 15, color: "var(--ink)" }}>{n.name}</span>
                  <span
                    className="pill"
                    style={{
                      fontSize: 11,
                      padding: "3px 10px",
                      background: n.tagTint,
                      color: n.tagColor,
                    }}
                  >
                    {n.tag}
                  </span>
                </div>
                <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{n.time}</span>
              </div>
              <CaseTag type={n.type} sm />
            </div>
            <p style={{ fontSize: 14.5, color: "var(--text-1)", lineHeight: 1.7 }}>{n.body}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
