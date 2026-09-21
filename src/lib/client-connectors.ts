/* Client connector connections.
   There is no client-side integrations table on the backend yet, so these are
   kept per user in this browser. Swap the two functions for API calls once an
   endpoint exists — the connectors page only talks to this module. */

const key = (userId: string) => `clientsignal-connectors:${userId}`;

export function loadClientConnections(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(key(userId));
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((n): n is string => typeof n === "string") : []);
  } catch {
    return new Set();
  }
}

export function saveClientConnections(userId: string, names: Set<string>): void {
  localStorage.setItem(key(userId), JSON.stringify([...names]));
}
