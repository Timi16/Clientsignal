"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/attorney-layout";
import { ConnectorsDirectory } from "@/components/connectors-directory";
import { ATTORNEY_CONNECTORS } from "@/lib/connectors";
import * as attorneysApi from "@/lib/api/attorneys";

export default function IntegrationsPage() {
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    attorneysApi
      .listIntegrations()
      .then(({ integrations }) => {
        if (cancelled) return;
        setConnected(new Set((integrations ?? []).filter((i) => i.connected).map((i) => i.name)));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = async (name: string, connect: boolean) => {
    await attorneysApi.toggleIntegration(name, connect);
    setConnected((prev) => {
      const next = new Set(prev);
      if (connect) next.add(name);
      else next.delete(name);
      return next;
    });
  };

  return (
    <AppLayout>
      <ConnectorsDirectory
        title="Connect your stack"
        subtitle="Integrate ClientSignal with the tools your firm already uses. Sync leads to your case management, automate intake, get paid, and keep your workflow seamless."
        connectors={ATTORNEY_CONNECTORS}
        connected={connected}
        loading={loading}
        onToggle={toggle}
      />
    </AppLayout>
  );
}
