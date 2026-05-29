import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intents 2026 Planner",
  description: "Pick your favorite artists and get the optimal route through Intents Festival 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
