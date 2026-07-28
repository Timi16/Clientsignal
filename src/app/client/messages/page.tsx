"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase } from "@/components/client-layout";
import { useAuth } from "@/lib/auth-context";
import { Icon } from "@/components/icons";
import { Avatar, Mark, Verified, CaseTag } from "@/components/ui";
import { CASE_TYPES } from "@/lib/data";
import * as messagesApi from "@/lib/api/messages";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function ClientMessages() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeCase: c, attorney, loading } = useActiveCase();
  const firstName = user?.name?.split(" ")[0] || "there";
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<messagesApi.Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch thread and messages on mount / when active case changes
  useEffect(() => {
    if (!c || !attorney) {
      setMsgs([]);
      setThreadId(null);
      return;
    }

    let cancelled = false;
    async function fetchMessages() {
      setLoadingMsgs(true);
      try {
        const { threads } = await messagesApi.listThreads();
        const caseThread = threads.find(t => t.caseId === c!.id);
        if (!caseThread || cancelled) {
          setLoadingMsgs(false);
          return;
        }
        setThreadId(caseThread.id);
        const { messages } = await messagesApi.getThread(caseThread.id);
        if (!cancelled) {
          setMsgs(messages);
          // Mark as read
          messagesApi.markRead(caseThread.id).catch(() => {});
        }
      } catch {
        // API not available
      } finally {
        if (!cancelled) setLoadingMsgs(false);
      }
    }

    fetchMessages();
    return () => { cancelled = true; };
  }, [c?.id, attorney?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!draft.trim() || !threadId) return;
    const body = draft;
    setDraft("");
    try {
      const { message } = await messagesApi.sendMessage(threadId, body);
      setMsgs(prev => [...prev, message]);
    } catch {
      // Restore draft on failure
      setDraft(body);
    }
  };

  if (!c || !attorney) {
    return (
      <ClientLayout title="Messages">
        <div style={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
          <p style={{ fontSize: 15, color: "var(--text-3)" }}>Nothing here yet.</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Messages">
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", background: "var(--paper)", margin: "-28px -32px", }}>
        <div className="row between" style={{ padding: "16px 24px", borderBottom: "1px solid var(--line)", background: "var(--card)" }}>
          <div className="row" style={{ gap: 12 }}><Avatar name={attorney.name} size={44} /><div className="stack"><div className="row" style={{ gap: 7 }}><strong style={{ fontSize: 15.5 }}>{attorney.name}</strong><Verified size={15} /><CaseTag type={c.practiceArea} sm /></div><span style={{ fontSize: 12.5, color: "var(--verified)" }}>● Online · typically replies in {attorney.responseTimeAvg}</span></div></div>
          <div className="row" style={{ gap: 9 }}><button className="btn btn-ghost btn-sm"><Icon name="phone" size={15} /> Call</button><button className="btn btn-pine btn-sm"><Icon name="clock" size={15} /> Book consult</button></div>
        </div>
        <div className="thin-scroll" style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "center" }}><span className="mono" style={{ fontSize: 11, color: "var(--text-3)", background: "var(--paper-2)", padding: "4px 12px", borderRadius: 999 }}>Connected via ClientSignal · {c.id}</span></div>
          {loadingMsgs && (
            <div style={{ textAlign: "center", padding: 20 }}>
              <Icon name="refresh" size={20} color="var(--text-3)" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          )}
          {msgs.map((m) => {
            const mine = m.senderUserId === user?.id;
            return (
              <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "72%" }}>
                <div style={{ padding: "12px 16px", borderRadius: mine ? "16px 16px 5px 16px" : "16px 16px 16px 5px", background: mine ? "var(--signal)" : "var(--card)", color: mine ? "#fff" : "var(--ink)", border: mine ? "none" : "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.5 }}>{m.body}</div>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", display: "block", marginTop: 4, textAlign: mine ? "right" : "left" }}>{formatTime(m.createdAt)}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="row" style={{ padding: 18, gap: 11, borderTop: "1px solid var(--line)", background: "var(--card)" }}>
          <button style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid var(--line-2)", display: "grid", placeItems: "center", flex: "none", color: "var(--text-2)" }} onClick={() => router.push("/client/documents")}><Icon name="upload" size={18} /></button>
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Message your attorney…" style={{ flex: 1, padding: "13px 18px", borderRadius: 999, border: "1px solid var(--line-2)", background: "var(--paper)", fontSize: 14.5, outline: "none" }} />
          <button className="btn btn-signal" onClick={send} style={{ padding: "13px 18px" }}><Icon name="arrowR" size={18} /></button>
        </div>
      </div>
    </ClientLayout>
  );
}
