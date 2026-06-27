import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nishant Sanwaria — AI & Agentic AI Developer",
  description:
    "Building intelligent systems using LLMs, RAG, and Multi-Agent Workflows. B.Tech AI & DS @ JECRC University.",
  keywords: ["AI developer", "LangChain", "LangGraph", "RAG", "Multi-Agent", "portfolio"],
  authors: [{ name: "Nishant Sanwaria" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
