"use client";

import { useRouter } from "next/navigation";
import IntakePage from "@/app/client/intake/page";

export default function NewCase() {
  return <IntakePage inDashboard />;
}
