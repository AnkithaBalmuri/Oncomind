"use client";

import { useState } from "react";
import { CalendarDays, Save, Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function PatientProfilePanel() {
  const [saved, setSaved] = useState(false);
  const inputClassName = "border-sky-200 bg-sky-100/70 font-semibold text-slate-950 placeholder:text-slate-500";
  const selectClassName = "h-11 w-full rounded-md border border-sky-200 bg-sky-100/70 px-3 text-sm font-semibold text-slate-950 outline-none transition focus:ring-2 focus:ring-ring";

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-extrabold text-slate-950">
          <UserRound className="h-5 w-5 text-primary" />
          Patient and doctor information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4">
          <p className="text-base font-extrabold text-slate-950">Patient profile</p>
          <Input className={inputClassName} placeholder="Patient name" />
          <Input className={inputClassName} placeholder="Age / gender" />
          <select className={selectClassName} defaultValue="">
            <option value="" disabled>Cancer type</option>
            <option>Breast cancer</option>
            <option>Lung cancer</option>
            <option>Colorectal cancer</option>
            <option>Prostate cancer</option>
            <option>Blood cancer</option>
            <option>Other / not sure</option>
          </select>
          <Input className={inputClassName} placeholder="Stage / diagnosis date" />
          <select className={selectClassName} defaultValue="">
            <option value="" disabled>Current treatment</option>
            <option>Not started yet</option>
            <option>Surgery</option>
            <option>Chemotherapy</option>
            <option>Radiation therapy</option>
            <option>Immunotherapy</option>
            <option>Targeted therapy</option>
            <option>Hormone therapy</option>
          </select>
        </div>
        <div className="grid gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
          <p className="flex items-center gap-2 text-base font-extrabold text-slate-950">
            <Stethoscope className="h-4 w-4 text-emerald-600" />
            Doctor details
          </p>
          <Input className="border-emerald-200 bg-emerald-100/70 font-semibold text-slate-950 placeholder:text-slate-500" placeholder="Doctor name" />
          <Input className="border-emerald-200 bg-emerald-100/70 font-semibold text-slate-950 placeholder:text-slate-500" placeholder="Hospital / clinic" />
          <Input className="border-emerald-200 bg-emerald-100/70 font-semibold text-slate-950 placeholder:text-slate-500" type="email" placeholder="Hospital email" />
          <label className="relative block">
            <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-emerald-700" />
            <Input type="date" className="border-emerald-200 bg-emerald-100/70 pl-9 font-semibold text-slate-950" aria-label="Next appointment date" />
          </label>
          <div className="flex flex-wrap gap-2">
            {["Today", "This week", "This month"].map((label) => (
              <Button key={label} className="border-emerald-200 bg-emerald-100 font-bold text-emerald-950 hover:bg-emerald-200" type="button" variant="outline" size="sm">{label}</Button>
            ))}
          </div>
          <Button className="mt-1 font-extrabold shadow-sm" onClick={() => setSaved(true)}>
            <Save className="h-4 w-4" />
            Save profile
          </Button>
          {saved ? <p className="rounded-lg border border-emerald-200 bg-emerald-100/80 p-3 text-sm font-extrabold text-emerald-900">Saved locally in demo mode.</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
