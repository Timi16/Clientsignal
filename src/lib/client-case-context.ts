"use client";

import { createContext } from "react";
import type { CaseDocument } from "@/lib/api/cases";

export interface ActiveCaseData {
  id: string;
  practiceArea: string;
  matter: string;
  city: string;
  state: string;
  openedAt: string;
  status: string;
  stage: number;
  strengthScore: number;
  summary: string;
  attorneyId: string;
  docs: CaseDocument[];
  unreadCount: number;
}

export interface ActiveAttorney {
  id: string;
  name: string;
  firmName: string;
  yearsExperience: number;
  barNumber: string;
  trustRating: string;
  responseTimeAvg: string;
  specialties: string[];
  bio: string;
}

export interface ClientCaseContextValue {
  cases: ActiveCaseData[];
  activeCase: ActiveCaseData | null;
  attorney: ActiveAttorney | null;
  setActiveId: (id: string) => void;
  loading: boolean;
  refreshCases: () => Promise<void>;
}

export const ClientCaseContext = createContext<ClientCaseContextValue>({
  cases: [],
  activeCase: null,
  attorney: null,
  setActiveId: () => {},
  loading: true,
  refreshCases: async () => {},
});
