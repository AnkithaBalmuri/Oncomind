import { Bot, BrainCircuit, Dna, FileSearch, HeartPulse, Pill, Ribbon, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OncologyCareVisual() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-sky-200/80 pastel-panel p-5 shadow-soft">
      <div className="absolute inset-0 medical-grid opacity-40" />
      <div className="absolute right-5 top-5 doodle-float rounded-full bg-white/80 p-3 shadow-sm">
        <Ribbon className="h-8 w-8 text-pink-500" />
      </div>
      <div className="relative grid gap-4">
        <div className="overflow-hidden rounded-lg border bg-white/70 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=80"
            alt="Doctor reviewing medical information"
            className="h-44 w-full object-cover"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="clinical-card doodle-float rounded-lg p-4">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-sky-100 text-sky-700 shadow-inner">
              <Stethoscope className="h-12 w-12" />
            </div>
            <p className="mt-4 text-center text-sm font-black uppercase text-sky-900">Doctor + patient</p>
            <p className="mt-1 text-center text-xs font-semibold text-slate-700">Cancer report review</p>
          </div>

          <div className="grid gap-3">
            <PipelineCard icon={FileSearch} title="1. Read report" text="Pathology, scans, labs, biomarkers" />
            <PipelineCard icon={BrainCircuit} title="2. RAG search" text="Retrieve trusted medical evidence" />
            <PipelineCard icon={Bot} title="3. AI answer" text="Cited summary with confidence score" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniBadge icon={Dna} label="Biomarkers" />
          <MiniBadge icon={Pill} label="Treatment" />
          <MiniBadge icon={ShieldCheck} label="Safety" />
        </div>

        <div className="agent-breathe rounded-lg bg-slate-950 p-4 text-white shadow-glow">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-emerald-200">OncoMind RAG Agent</p>
              <p className="mt-1 text-xs text-slate-300">Cancer-aware answers from reports + guidelines + trials</p>
            </div>
            <HeartPulse className="h-8 w-8 text-emerald-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-md border bg-white/76 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-emerald-100 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>
          <p className="text-xs font-semibold text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function MiniBadge({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <Badge className="justify-center border-sky-200 bg-white/70 py-2 text-slate-900">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </Badge>
  );
}
