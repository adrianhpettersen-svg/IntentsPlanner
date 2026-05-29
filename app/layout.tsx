import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intents 2026 Planner",
  description: "Pick your favorite artists and get the optimal route through Intents Festival 2026.",
  applicationName: "Intents 26",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Intents 26",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
