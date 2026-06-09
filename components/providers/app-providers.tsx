"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useSettingsStore } from "@/store/settings-store";

function ThemeSync({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return children;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const tree = (
    <QueryClientProvider client={queryClient}>
      <ThemeSync>{children}</ThemeSync>
    </QueryClientProvider>
  );

  if (!clerkKey || clerkKey.includes("replace_me")) {
    return tree;
  }

  return <ClerkProvider publishableKey={clerkKey}>{tree}</ClerkProvider>;
}
