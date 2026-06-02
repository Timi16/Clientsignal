import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientSignal — Legal leads, routed in seconds",
  description: "The modern intake and lead-routing platform for attorneys. Verified leads, scored cases, delivered instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
