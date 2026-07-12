import { Lead, LEADS } from "@/lib/data";

let _selected: Lead = LEADS[0];

export function getSelectedLead(): Lead {
  return _selected;
}

export function setSelectedLead(l: Lead) {
  _selected = l;
}
