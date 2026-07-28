"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const WS_URL = API_BASE.replace("/api", "");

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  icon: string;
  color: string;
  href: string;
  timestamp: number;
  read: boolean;
}

interface SocketContextValue {
  connected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  dismissNotification: (id: string) => void;
  joinCase: (caseId: string) => void;
  leaveCase: (caseId: string) => void;
}

const SocketContext = createContext<SocketContextValue>({
  connected: false,
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  dismissNotification: () => {},
  joinCase: () => {},
  leaveCase: () => {},
});

let nextId = 1;
function makeId() {
  return `n_${Date.now()}_${nextId++}`;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications(prev => [{
      ...n,
      id: makeId(),
      timestamp: Date.now(),
      read: false,
    }, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    // Only connect when user is authenticated
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("cs_token") : null;
    if (!token) return;

    const socket = io(`${WS_URL}/socket`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // Lead events
    socket.on("lead:new", (event: any) => {
      addNotification({
        type: "lead:new",
        title: "New lead matched",
        body: `${event.practiceArea} case in ${event.city || "your area"} — Quality ${event.qualityScore}`,
        icon: "zap",
        color: "var(--signal)",
        href: "/attorney/leads",
      });
    });

    socket.on("lead:claimed", (event: any) => {
      addNotification({
        type: "lead:claimed",
        title: "Attorney matched to your case",
        body: `${event.attorneyName} has accepted your ${event.practiceArea} case`,
        icon: "shield",
        color: "var(--verified)",
        href: "/client/attorney",
      });
    });

    // Message events
    socket.on("message:new", (event: any) => {
      addNotification({
        type: "message:new",
        title: "New message",
        body: event.preview || "You have a new message",
        icon: "message",
        color: "var(--signal)",
        href: "/client/messages",
      });
    });

    // Case events
    socket.on("case:created", (event: any) => {
      addNotification({
        type: "case:created",
        title: "Case created",
        body: `Your ${event.practiceArea} case has been opened`,
        icon: "inbox",
        color: "var(--verified)",
        href: "/client/dashboard",
      });
    });

    socket.on("case:stage_updated", (event: any) => {
      addNotification({
        type: "case:stage_updated",
        title: "Case progress updated",
        body: `Your case moved to stage ${event.newStage}`,
        icon: "clock",
        color: "var(--signal)",
        href: "/client/timeline",
      });
    });

    socket.on("case:document_requested", (event: any) => {
      addNotification({
        type: "case:document_requested",
        title: "Document requested",
        body: `${event.attorneyName || "Your attorney"} requested: ${event.documentName}`,
        icon: "upload",
        color: "var(--amber)",
        href: "/client/documents",
      });
    });

    socket.on("case:document_uploaded", () => {
      addNotification({
        type: "case:document_uploaded",
        title: "Document uploaded",
        body: "A new document has been uploaded to your case",
        icon: "doc",
        color: "var(--verified)",
        href: "/client/documents",
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [user, addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const joinCase = useCallback((caseId: string) => {
    socketRef.current?.emit("join:case", caseId);
  }, []);

  const leaveCase = useCallback((caseId: string) => {
    socketRef.current?.emit("leave:case", caseId);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SocketContext.Provider value={{ connected, notifications, unreadCount, markAllRead, dismissNotification, joinCase, leaveCase }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
