import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Intents Festival 2026 – Planner",
    short_name: "Intents 26",
    description: "Pick favorite artists, get the optimal route through Intents Festival 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e1a",
    theme_color: "#ff3b6b",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
