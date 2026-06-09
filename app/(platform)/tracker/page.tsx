"use client";

import { useState } from "react";
import { Bell, CalendarDays, CheckCircle2, Circle, Clock, Pill, Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { useTranslation, type TranslationKey } from "@/lib/translations";

type EventType = "appointment" | "test" | "medication";

type TrackerEvent = {
  id: string;
  type: EventType;
  title: string;
  date: string;
  time?: string;
  note?: string;
  done: boolean;
};

const INITIAL_EVENTS: TrackerEvent[] = [
  { id: "e1", type: "appointment", title: "Oncology Consultation – Dr. Sharma", date: "2026-06-15", time: "10:30 AM", note: "Bring pathology report and recent imaging", done: false },
  { id: "e2", type: "test", title: "HER2 FISH Confirmation Test", date: "2026-06-12", time: "09:00 AM", note: "Fasting required for 6 hours before test", done: false },
  { id: "e3", type: "medication", title: "Letrozole 2.5mg – Daily dose", date: "2026-06-07", time: "08:00 AM", note: "Take with food to reduce nausea", done: true },
  { id: "e4", type: "test", title: "Full Blood Count (FBC)", date: "2026-06-10", time: "08:30 AM", note: "Pre-chemo bloodwork at hospital lab", done: false },
  { id: "e5", type: "appointment", title: "Breast MRI Follow-Up", date: "2026-06-20", time: "02:00 PM", note: "Contrast MRI — remove jewelry beforehand", done: false }
];

const typeConfig: Record<EventType, { icon: typeof Bell; color: string; badge: string }> = {
  appointment: { icon: CalendarDays, color: "text-blue-600 bg-blue-50", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  test: { icon: Clock, color: "text-violet-600 bg-violet-50", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  medication: { icon: Pill, color: "text-amber-600 bg-amber-50", badge: "bg-amber-50 text-amber-700 border-amber-200" }
};

type NewEvent = { type: EventType; title: string; date: string; time: string; note: string };

const EMPTY_EVENT: NewEvent = { type: "appointment", title: "", date: "", time: "", note: "" };

export default function TrackerPage() {
  const { t, language } = useTranslation();
  const [events, setEvents] = useState<TrackerEvent[]>(INITIAL_EVENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<NewEvent>(EMPTY_EVENT);
  const [filter, setFilter] = useState<"all" | EventType>("all");

  const filtered = events.filter((e) => filter === "all" || e.type === filter);
  const upcoming = filtered.filter((e) => !e.done).sort((a, b) => a.date.localeCompare(b.date));
  const completed = filtered.filter((e) => e.done);

  function toggleDone(id: string) {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, done: !e.done } : e));
  }

  function remove(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function addEvent() {
    if (!form.title.trim() || !form.date) return;
    const newEvent: TrackerEvent = {
      id: `e${Date.now()}`,
      type: form.type,
      title: form.title,
      date: form.date,
      time: form.time || undefined,
      note: form.note || undefined,
      done: false
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm(EMPTY_EVENT);
    setShowAdd(false);
  }

  return (
    <>
      <PageHeader
        eyebrow={t("trackerEyebrow")}
        title={t("trackerTitle")}
        description={t("trackerDesc")}
      />

      {/* Stats */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: t("upcoming"), count: events.filter((e) => !e.done).length, color: "text-primary" },
          { label: t("completed"), count: events.filter((e) => e.done).length, color: "text-emerald-600" },
          { label: t("total"), count: events.length, color: "text-muted-foreground" }
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "appointment", "test", "medication"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-bold capitalize transition-all ${
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {f === "all" ? t("allTypes") : t(f === "appointment" ? "appointments" : f === "test" ? "tests" : "medications")}
            </button>
          ))}
        </div>
        <Button size="sm" className="gap-2 font-semibold" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4" />
          {t("addEvent")}
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card className="clinical-card mb-5 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black">{t("newEvent")}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("type")}</label>
              <select
                className="mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as EventType })}
              >
                <option value="appointment">{t("appointment")}</option>
                <option value="test">{t("labTest")}</option>
                <option value="medication">{t("medication")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("title")}</label>
              <input
                className="mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Event title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("date")}</label>
              <input
                type="date"
                className="mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("timeOptional")}</label>
              <input
                type="time"
                className="mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{t("noteOptional")}</label>
              <input
                className="mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add a note..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <Button className="font-semibold" onClick={addEvent}>{t("saveEvent")}</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)}>{t("cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-base font-black text-foreground">{t("upcoming")} ({upcoming.length})</h2>
          <div className="grid gap-3">
            {upcoming.map((event) => <EventCard key={event.id} event={event} language={language} t={t} onToggle={toggleDone} onRemove={remove} />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-black text-muted-foreground">{t("completed")} ({completed.length})</h2>
          <div className="grid gap-3 opacity-70">
            {completed.map((event) => <EventCard key={event.id} event={event} language={language} t={t} onToggle={toggleDone} onRemove={remove} />)}
          </div>
        </div>
      )}
    </>
  );
}

function EventCard({
  event,
  language,
  t,
  onToggle,
  onRemove
}: {
  event: TrackerEvent;
  language: string;
  t: any;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const cfg = typeConfig[event.type];
  const Icon = cfg.icon;
  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString(language === "Telugu" ? "te-IN" : language === "Hindi" ? "hi-IN" : "en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Card className={`clinical-card transition-all ${event.done ? "opacity-60" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(event.id)}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle done"
          >
            {event.done
              ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              : <Circle className="h-5 w-5" />}
          </button>
          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${cfg.badge}`}>
                {t(event.type === "appointment" ? "appointment" : event.type === "test" ? "labTest" : "medication")}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                {formattedDate}
                {event.time && ` · ${event.time}`}
              </span>
            </div>
            <p className={`text-sm font-black ${event.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {event.title}
            </p>
            {event.note && (
              <p className="mt-1 text-xs font-medium text-muted-foreground">{event.note}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(event.id)}
            aria-label="Remove event"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
