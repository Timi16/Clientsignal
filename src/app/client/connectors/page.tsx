"use client";

import { useState } from "react";
import ClientLayout from "@/components/client-layout";
import { ConnectorsDirectory } from "@/components/connectors-directory";
import { CLIENT_CONNECTORS } from "@/lib/connectors";
import { loadClientConnections, saveClientConnections } from "@/lib/client-connectors";
import { useAuth } from "@/lib/auth-context";

function Directory({ userId }: { userId: string }) {
  const [connected, setConnected] = useState(() => loadClientConnections(userId));

  const toggle = async (name: string, connect: boolean) => {
    const next = new Set(connected);
    if (connect) next.add(name);
    else next.delete(name);
    saveClientConnections(userId, next);
    setConnected(next);
  };

  return (
    <ConnectorsDirectory
      title="Connect your apps"
      subtitle="Bring in documents, photos, and records from the apps you already use, and get case updates where you'll see them. You choose exactly what is shared with your attorney."
      connectors={CLIENT_CONNECTORS}
      connected={connected}
      onToggle={toggle}
    />
  );
}

export default function ClientConnectors() {
  const { user } = useAuth();

  return (
    <ClientLayout title="Connectors">
      {/* keyed by user so a different sign-in never sees another user's connections */}
      {user && <Directory key={user.id} userId={user.id} />}
    </ClientLayout>
  );
}
