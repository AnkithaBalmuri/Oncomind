"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/translations";

const navGroups = [
  {
    label: "Core",
    items: ["/dashboard", "/chat", "/voice", "/documents", "/vault"]
  },
  {
    label: "Clinical Intelligence",
    items: ["/analyzer", "/research", "/trials", "/visit-prep"]
  },
  {
    label: "Education & Tools",
    items: ["/hub", "/treatments", "/glossary", "/saved", "/tracker"]
  },
  {
    label: "System",
    items: ["/evaluation", "/settings"]
  }
];

const groupKeys: Record<string, string> = {
  "Core": "core",
  "Clinical Intelligence": "clinicalIntel",
  "Education & Tools": "eduTools",
  "System": "system"
};

const titleKeys: Record<string, string> = {
  "Dashboard": "dashboard",
  "AI Chat": "chat",
  "Voice Assistant": "voice",
  "Documents": "documents",
  "Medical Vault": "vault",
  "Report Analyzer": "analyzer",
  "Research": "research",
  "Clinical Trials": "trials",
  "Visit Prep": "visitPrep",
  "Knowledge Hub": "hub",
  "Treatment Explorer": "treatments",
  "Medical Glossary": "glossary",
  "Saved Insights": "saved",
  "Follow-Up Tracker": "tracker",
  "Evaluation": "evaluation",
  "Settings": "settings"
};

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card/95 backdrop-blur-xl p-4 transition-transform lg:sticky lg:top-16 lg:z-auto lg:h-[calc(100vh-4rem)] lg:translate-x-0 flex flex-col gap-1 overflow-y-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Mobile close */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-md text-white text-xs font-black animate-pulse-ring-blue"
            style={{ background: "linear-gradient(135deg, hsl(24 95% 58%), hsl(38 95% 50%))" }}
          >
            OM
          </span>
          <span className="text-sm font-black tracking-tight">{t("appName")}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close navigation">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav groups */}
      {navGroups.map((group) => {
        const groupItems = navItems.filter((item) => group.items.includes(item.href));
        if (!groupItems.length) return null;
        const translatedGroupLabel = t(groupKeys[group.label] as any) || group.label;
        
        return (
          <div key={group.label} className="mb-3">
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {translatedGroupLabel}
            </p>
            <div className="space-y-0.5">
              {groupItems.map((item) => (
                <SidebarLink key={item.href} item={item} active={pathname === item.href} onClose={onClose} />
              ))}
            </div>
          </div>
        );
      })}
    </aside>
  );
}

function SidebarLink({
  item,
  active,
  onClose
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onClose?: () => void;
}) {
  const Icon = item.icon;
  const { t } = useTranslation();
  const translatedTitle = t(titleKeys[item.title] as any) || item.title;

  return (
    <Link
      onClick={onClose}
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150",
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "")} />
      <span className="truncate">{translatedTitle}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Link>
  );
}
