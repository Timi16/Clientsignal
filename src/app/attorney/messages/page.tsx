"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { Avatar, CaseTag } from "@/components/ui";
import { LEADS } from "@/lib/data";

const THREADS = [
  { name: "Marcus Webb", preview: "Thank you for getting back to me so quickly. I have...", type: "injury", time: "2m", unread: true },
  { name: "Priya Nair", preview: "My visa expires in about 90 days and my employer...", type: "immigration", time: "14m", unread: false },
  { name: "Dana Okafor", preview: "I'd like to set up a time to discuss my options.", type: "family", time: "31m", unread: false },
];

interface Msg {
  from: "them" | "me";
  text: string;
  time: string;
}

const CHAT_MSGS: Msg[] = [
  { from: "them", text: "Hi, I was rear-ended on I-35 yesterday. I went to the ER and they found neck and lower-back strain. The other driver was cited by police. I have the police report and photos of both vehicles.", time: "10:22 AM" },
  { from: "me", text: "Marcus, thank you for reaching out. I'm sorry to hear about your accident. Based on what you've described, you may have a strong personal injury claim. I'd like to schedule a free consultation to go over the details. Are you available this afternoon?", time: "10:24 AM" },
  { from: "them", text: "Thank you for getting back to me so quickly. I have a doctor's follow-up at 2 but I'm free after 3:30. Would that work?", time: "10:26 AM" },
];

export default function MessagesPage() {
  const [active, setActive] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>(CHAT_MSGS);
  const [input, setInput] = useState("");

  const thread = THREADS[active];

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { from: "me", text: input.trim(), time: "Now" }]);
    setInput("");
  };

  return (
    <AppLayout>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 140px)", borderRadius: 18, overflow: "hidden", border: "1px solid var(--line)", background: "var(--card)" }}>
        {/* thread list */}
        <div className="stack thin-scroll" style={{ borderRight: "1px solid var(--line)", overflowY: "auto" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>Messages</h2>
          </div>
          {THREADS.map((t, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                display: "flex",
                gap: 12,
                padding: "16px 20px",
                textAlign: "left",
                borderBottom: "1px solid var(--line)",
                background: active === i ? "var(--paper)" : "transparent",
                transition: "background .12s",
              }}
              onMouseEnter={(e) => {
                if (active !== i) (e.currentTarget as HTMLButtonElement).style.background = "var(--paper)";
              }}
              onMouseLeave={(e) => {
                if (active !== i) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <div style={{ position: "relative" }}>
                <Avatar name={t.name} size={42} />
                {t.unread && (
                  <span
                    className="pulse-dot"
                    style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, border: "2px solid var(--card)" }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 650, fontSize: 13.5, color: "var(--ink)" }}>{t.name}</span>
                  <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{t.time}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.preview}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* chat area */}
        <div className="stack" style={{ height: "100%" }}>
          {/* chat header */}
          <div className="row" style={{ gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--line)" }}>
            <Avatar name={thread.name} size={38} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 650, fontSize: 14.5, color: "var(--ink)" }}>{thread.name}</span>
            </div>
            <CaseTag type={thread.type} sm />
          </div>

          {/* messages */}
          <div className="stack thin-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px 24px 12px", gap: 16 }}>
            {msgs.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.from === "me" ? "flex-end" : "flex-start",
                  maxWidth: "72%",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: m.from === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.from === "me" ? "var(--signal)" : "var(--paper)",
                    color: m.from === "me" ? "#fff" : "var(--text-1)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {m.text}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, textAlign: m.from === "me" ? "right" : "left" }}>
                  {m.time}
                </div>
              </div>
            ))}
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
        </div>
      </div>
    </AppLayout>
  );
}
