"use client";

import { useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui";
import { useRequireAuth } from "@/lib/use-require-auth";
import * as casesApi from "@/lib/api/cases";
import * as messagesApi from "@/lib/api/messages";
import { ClientCaseContext } from "@/lib/client-case-context";
import type { ActiveCaseData, ActiveAttorney, ClientCaseContextValue } from "@/lib/client-case-context";

const PUBLIC_PATHS = ["/client/login", "/client/signup", "/client/intake"];

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  const [cases, setCases] = useState<ActiveCaseData[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string>("");
  const [attorney, setAttorney] = useState<ActiveAttorney | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const fetched = useRef(false);

  const { user, loading: authLoading } = useRequireAuth(isPublic ? undefined : "client");

  const fetchCases = useCallback(async () => {
    try {
      const [casesRes] = await Promise.all([
        casesApi.listCases({ limit: 50 }),
        messagesApi.getUnreadCount().catch(() => ({ count: 0 })),
      ]);

      const caseList: ActiveCaseData[] = await Promise.all(
        casesRes.cases.map(async (c) => {
          const docsRes = await casesApi.listDocuments(c.id).catch(() => ({ documents: [] }));
          let unreadCount = 0;
          try {
            const threads = await messagesApi.listThreads();
            const caseThread = threads.threads.find(t => t.caseId === c.id);
            if (caseThread) unreadCount = caseThread.unreadCount;
          } catch { /* no threads yet */ }

          return {
            id: c.id,
            practiceArea: c.practiceArea,
            matter: c.matter,
            city: c.city ? `${c.city}, ${c.state}` : c.state || "",
            state: c.state,
            openedAt: c.openedAt,
            status: c.status,
            stage: c.stage,
            strengthScore: c.strengthScore,
            summary: c.summary || "",
            attorneyId: c.attorneyId,
            docs: docsRes.documents,
            unreadCount,
          };
        })
      );

      setCases(caseList);
      setActiveCaseId(prev => {
        if (prev && caseList.some(c => c.id === prev)) return prev;
        return caseList.length > 0 ? caseList[0].id : "";
      });
    } catch {
      setCases([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Fetch once when user is ready (skip for public pages)
  useEffect(() => {
    if (isPublic) return;
    if (!authLoading && user && !fetched.current) {
      fetched.current = true;
      fetchCases();
    }
  }, [isPublic, authLoading, user, fetchCases]);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0] || null;

  useEffect(() => {
    if (isPublic) return;
    if (!activeCase?.attorneyId || !activeCase?.id) {
      setAttorney(null);
      return;
    }
    casesApi.getCaseAttorney(activeCase.id)
      .then(res => setAttorney(res.attorney))
      .catch(() => setAttorney(null));
  }, [isPublic, activeCase?.attorneyId, activeCase?.id]);

  const setActiveId = useCallback((id: string) => {
    setActiveCaseId(id);
  }, []);

  // Public pages — just render children, no context needed
  if (isPublic) return <>{children}</>;

  // Show initial load screen only on first ever load
  if (authLoading || !user || (dataLoading && !fetched.current)) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "var(--paper)" }}>
        <div className="rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
          <Logo size={30} />
          <div style={{ position: "relative", width: 56, height: 56 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ animation: "cs-spin 1.2s ease-in-out infinite" }}>
              <circle cx="28" cy="28" r="23" fill="none" stroke="var(--line)" strokeWidth="3.5" />
              <circle cx="28" cy="28" r="23" fill="none" stroke="var(--signal)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="110" strokeDashoffset="80" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Loading your dashboard</p>
            <p style={{ fontSize: 13, color: "var(--text-3)" }}>Setting things up for you...</p>
          </div>
          <style>{`@keyframes cs-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  const ctxValue: ClientCaseContextValue = {
    cases,
    activeCase,
    attorney,
    setActiveId,
    loading: dataLoading,
    refreshCases: fetchCases,
  };

  return (
    <ClientCaseContext.Provider value={ctxValue}>
      {children}
    </ClientCaseContext.Provider>
  );
}
