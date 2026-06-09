import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "OncoMind AI | Multi-Agent Cancer Intelligence",
  description:
    "A production-grade healthcare AI platform for cancer report analysis, research intelligence, clinical trial exploration, and patient preparation.",
  openGraph: {
    title: "OncoMind AI",
    description: "Multi-agent cancer intelligence for clinicians, researchers, and patients.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
