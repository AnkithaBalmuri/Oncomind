"use client";

import Link from "next/link";
import { Menu, Moon, Sun, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/settings-store";
import { useTranslation } from "@/lib/translations";

export function Navbar({ onMenu }: { onMenu?: () => void }) {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl" style={{ borderBottomColor: "hsl(var(--border) / 0.6)" }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenu ? (
            <Button variant="ghost" size="sm" onClick={onMenu} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          ) : null}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg text-white text-sm font-black tracking-tight shadow-primary-glow animate-pulse-ring-blue"
              style={{ background: "linear-gradient(135deg, hsl(24 95% 58%), hsl(38 95% 50%))" }}
            >
              OM
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                {t("appName")}
              </span>
              <span className="text-[10px] font-bold text-primary/80 tracking-wide uppercase">
                {t("cancerIntel")}
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted-foreground md:flex">
          <Link href="/documents" className="hover:text-foreground transition-colors">{t("documents")}</Link>
          <Link href="/research" className="hover:text-foreground transition-colors">{t("research")}</Link>
          <Link href="/trials" className="hover:text-foreground transition-colors">{t("trials")}</Link>
          <Link href="/hub" className="hover:text-foreground transition-colors">{t("hub")}</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="appearance-none rounded-lg border border-border bg-card px-2.5 py-1.5 pr-7 text-xs font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-muted-foreground">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button asChild size="sm" className="gap-1.5 font-semibold shadow-sm">
            <Link href="/login">
              <UserRound className="h-4 w-4" />
              {t("signin")}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
