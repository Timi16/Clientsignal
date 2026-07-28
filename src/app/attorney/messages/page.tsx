"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import * as messagesApi from "@/lib/api/messages";

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<messagesApi.Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<messagesApi.Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Track last messages per thread for preview text
  const [threadPreviews, setThreadPreviews] = useState<Record<string, string>>({});

  // Fetch threads on mount
  useEffect(() => {
    let cancelled = false;
    setLoadingThreads(true);
    messagesApi
      .listThreads()
      .then((res) => {
        if (cancelled) return;
        setThreads(res.threads);
        if (res.threads.length > 0) {
          setActiveThreadId(res.threads[0].id);
        }
      })
      .catch(() => {
        if (!cancelled) setThreads([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingThreads(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch messages when active thread changes
  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setLoadingMessages(true);
    messagesApi
      .getThread(activeThreadId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
        // Mark thread as read
        messagesApi.markRead(activeThreadId).catch(() => {});
        // Update preview from the last message
        if (res.messages.length > 0) {
          const last = res.messages[res.messages.length - 1];
          setThreadPreviews((prev) => ({ ...prev, [activeThreadId]: last.body }));
        }
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  // Derive display name for a thread (show the other party's info)
  function threadDisplayName(t: messagesApi.Thread): string {
    // If the current user is the attorney, show the client id; otherwise show attorney id
    if (user?.id === t.attorneyUserId) {
      return t.clientUserId;
    }
    return t.attorneyUserId;
  }

  const send = () => {
    if (!input.trim() || !activeThreadId) return;
    const body = input.trim();
    setInput("");
    messagesApi
      .sendMessage(activeThreadId, body)
      .then((res) => {
        setMessages((prev) => [...prev, res.message]);
        // Update thread preview
        setThreadPreviews((prev) => ({ ...prev, [activeThreadId!]: body }));
      })
      .catch(() => {
        // Restore the input on failure so the user can retry
        setInput(body);
      });
  };

  return (
    <AppLayout>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 140px)", borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", background: "var(--card)" }}>
        {/* thread list */}
        <div className="stack thin-scroll" style={{ borderRight: "1px solid var(--line)", overflowY: "auto" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Messages</h2>
          </div>

          {loadingThreads && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
              Loading threads...
            </div>
          )}

          {!loadingThreads && threads.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>
              No messages yet
            </div>
          )}

          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThreadId(t.id)}
              style={{
                display: "flex",
                gap: 12,
                padding: "16px 20px",
                textAlign: "left",
                borderBottom: "1px solid var(--line)",
                background: activeThreadId === t.id ? "var(--paper)" : "transparent",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => {
                if (activeThreadId !== t.id) (e.currentTarget as HTMLButtonElement).style.background = "var(--paper)";
              }}
              onMouseLeave={(e) => {
                if (activeThreadId !== t.id) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar name={threadDisplayName(t)} size={42} />
                {(t.unreadCount ?? 0) > 0 && (
                  <span
                    className="pulse-dot"
                    style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, border: "2px solid var(--card)" }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 650, fontSize: 13.5, color: "var(--ink)" }}>{threadDisplayName(t)}</span>
                  <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{relativeTime(t.createdAt)}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {threadPreviews[t.id] || "..."}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* chat area */}
        <div className="stack" style={{ height: "100%" }}>
          {activeThread ? (
            <>
              {/* chat header */}
              <div className="row" style={{ gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--line)" }}>
                <Avatar name={threadDisplayName(activeThread)} size={38} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 650, fontSize: 14.5, color: "var(--ink)" }}>{threadDisplayName(activeThread)}</span>
                </div>
              </div>

              {/* messages */}
              <div className="stack thin-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 24px 12px", gap: 16 }}>
                {loadingMessages && (
                  <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 14, padding: "40px 0" }}>
                    Loading messages...
                  </div>
                )}
                {!loadingMessages && messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 14, padding: "40px 0" }}>
                    No messages in this thread yet. Send the first one!
                  </div>
                )}
                {messages.map((m) => {
                  const isMe = m.senderUserId === user?.id;
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "72%",
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: isMe ? "var(--signal)" : "var(--paper)",
                          color: isMe ? "#fff" : "var(--text-1)",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {m.body}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* input bar */}
              <div
                className="row"
                style={{
                  gap: 10,
                  padding: "14px 20px",
                  borderTop: "1px solid var(--line)",
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    borderRadius: 10,
                    border: "1.5px solid var(--line-2)",
                    background: "var(--paper)",
                    fontSize: 14,
                    color: "var(--ink)",
                    outline: "none",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <button className="btn btn-signal btn-sm" onClick={send}>
                  <Icon name="arrowR" size={16} />
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-3)", fontSize: 14 }}>
              {loadingThreads ? "Loading..." : "Select a conversation to get started"}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
