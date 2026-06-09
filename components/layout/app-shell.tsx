"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Navbar onMenu={() => setOpen(true)} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
      {open ? <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}
