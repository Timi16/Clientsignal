import { Lead } from "@/lib/api/leads";

let _selected: Lead | null = null;

export function getSelectedLead(): Lead | null {
  return _selected;
}

export function setSelectedLead(l: Lead) {
  _selected = l;
}
