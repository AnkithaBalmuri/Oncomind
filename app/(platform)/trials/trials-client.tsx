"use client";

import { useMemo, useState } from "react";
import { Filter, Mail, MapPin, Phone, SearchX, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trials, CANCER_TYPES, TRIAL_COUNTRIES, TRIAL_PHASES, TRIAL_STATUSES, TREATMENT_TYPES } from "@/lib/mock-data";
import { useTranslation, type TranslationKey } from "@/lib/translations";

const statusColors: Record<string, string> = {
  "Recruiting": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Active, not recruiting": "bg-blue-50 text-blue-700 border-blue-200",
  "Completed": "bg-muted text-muted-foreground border-border",
  "Not yet recruiting": "bg-amber-50 text-amber-700 border-amber-200",
  "Suspended": "bg-rose-50 text-rose-700 border-rose-200"
};

const phaseColors: Record<string, string> = {
  "Phase 1": "bg-violet-50 text-violet-700 border-violet-200",
  "Phase 1/2": "bg-violet-50 text-violet-700 border-violet-200",
  "Phase 2": "bg-blue-50 text-blue-700 border-blue-200",
  "Phase 2/3": "bg-blue-50 text-blue-700 border-blue-200",
  "Phase 3": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Phase 4": "bg-emerald-50 text-emerald-700 border-emerald-200"
};

function Select({ label, value, options, onChange, allLabel }: { label: string; value: string; options: string[]; onChange: (v: string) => void; allLabel: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</label>
      <select
        className="h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function TrialsClient() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [country, setCountry] = useState("");
  const [phase, setPhase] = useState("");
  const [status, setStatus] = useState("");
  const [treatmentType, setTreatmentType] = useState("");

  const filteredTrials = useMemo(() => {
    return trials.filter((trial) => {
      const haystack = `${trial.title} ${trial.cancerType} ${trial.country} ${trial.phase} ${trial.eligibility} ${trial.status} ${(trial as any).biomarker ?? ""}`.toLowerCase();
      return (
        (!query || haystack.includes(query.toLowerCase())) &&
        (!cancerType || trial.cancerType === cancerType) &&
        (!country || trial.country === country) &&
        (!phase || trial.phase === phase) &&
        (!status || trial.status === status) &&
        (!treatmentType || haystack.includes(treatmentType.toLowerCase()))
      );
    });
  }, [query, cancerType, country, phase, status, treatmentType]);

  return (
    <>
      {/* Filters */}
      <Card className="clinical-card mb-6">
        <CardContent className="p-5">
          <div className="mb-4">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Search</label>
            <input
              type="text"
              placeholder="Search by trial name, therapy type, biomarker..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border bg-card px-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Select label={t("filterCancer")} value={cancerType} options={CANCER_TYPES} onChange={setCancerType} allLabel={t("allTypes")} />
            <Select label={t("filterCountry")} value={country} options={TRIAL_COUNTRIES} onChange={setCountry} allLabel={t("all")} />
            <Select label={t("filterPhase")} value={phase} options={TRIAL_PHASES} onChange={setPhase} allLabel={t("all")} />
            <Select label={t("filterStatus")} value={status} options={TRIAL_STATUSES} onChange={setStatus} allLabel={t("all")} />
            <Select label={t("treatmentOptions")} value={treatmentType} options={TREATMENT_TYPES} onChange={setTreatmentType} allLabel={t("all")} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Filter className="h-4 w-4" />
              {filteredTrials.length} trial{filteredTrials.length !== 1 ? "s" : ""} found
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => { setQuery(""); setCancerType(""); setCountry(""); setPhase(""); setStatus(""); setTreatmentType(""); }}
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredTrials.length === 0 ? (
        <Card className="clinical-card">
          <CardContent className="grid place-items-center p-12 text-center">
            <SearchX className="h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-xl font-black text-foreground">No matching trials</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try a broader cancer type, remove country filters, or search for therapy terms like targeted, immunotherapy, or CAR-T.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTrials.map((trial) => {
            const t = trial as typeof trial & { sponsor?: string; biomarker?: string; contact?: string };
            const statusCls = statusColors[trial.status] ?? "bg-muted text-muted-foreground border-border";
            const phaseCls = phaseColors[trial.phase] ?? "bg-muted text-muted-foreground border-border";
            return (
              <Card key={trial.id} className="clinical-card group hover:-translate-y-0.5 transition-transform duration-150">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      {/* Badges row */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="font-mono text-xs">{trial.id}</Badge>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusCls}`}>
                          {trial.status}
                        </span>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${phaseCls}`}>
                          {trial.phase}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-foreground leading-5">{trial.title}</h3>

                      {/* Eligibility */}
                      <p className="mt-2 text-sm font-medium text-muted-foreground">{trial.eligibility}</p>

                      {/* Meta */}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-muted-foreground">
                        {t.sponsor && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {t.sponsor}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {trial.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          {trial.cancerType}
                        </span>
                        {t.biomarker && (
                          <Badge variant="outline" className="text-xs">
                            {t.biomarker}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    {t.contact && (
                      <div className="flex shrink-0 flex-col items-start gap-1.5 rounded-xl border bg-muted/30 px-4 py-3 md:items-end">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Contact</p>
                        <a
                          href={`mailto:${t.contact}`}
                          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {t.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
