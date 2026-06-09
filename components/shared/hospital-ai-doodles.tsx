import { Bot, BrainCircuit, FileText, HeartPulse, Search, Stethoscope, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HospitalAiDoodles() {
  return (
    <div className="relative min-h-[28rem] overflow-hidden rounded-lg border bg-white/80 p-5 shadow-soft dark:bg-slate-950/80">
      <div className="absolute inset-0 medical-grid opacity-60" />
      <div className="absolute left-6 top-6 rounded-full border bg-card px-4 py-2 text-xs font-black uppercase text-primary shadow-sm">
        RAG AI Pipeline
      </div>

      <div className="relative mx-auto mt-12 grid max-w-md gap-4">
        <div className="doodle-float clinical-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-blue-600 text-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-blue-700 dark:text-blue-300">Doctor workspace</p>
              <p className="text-xs text-muted-foreground">Upload report and ask a clear question</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <MiniStep icon={FileText} label="Reports" />
          <div className="h-px w-12 bg-primary" />
          <MiniStep icon={Search} label="Retrieve" />
        </div>

        <div className="agent-breathe clinical-card rounded-lg p-5">
          <div className="flex items-center gap-4">
            <div className="relative grid h-16 w-16 place-items-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Bot className="h-8 w-8" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-black">OncoMind RAG Agent</p>
              <p className="text-sm text-muted-foreground">Retrieves evidence, reasons, cites sources</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["NCCN", "PubMed", "Trials"].map((item) => (
              <Badge key={item} className="justify-center border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <MiniStep icon={BrainCircuit} label="Reason" />
          <div className="h-px w-12 bg-emerald-500" />
          <MiniStep icon={HeartPulse} label="Answer" />
        </div>

        <div className="doodle-float-delayed rounded-lg bg-primary p-4 text-primary-foreground shadow-glow">
          <p className="text-sm font-black uppercase">Cited clinical response</p>
          <p className="mt-1 text-xs text-primary-foreground/80">Confidence score, citations, next questions, and trial leads.</p>
        </div>
      </div>
    </div>
  );
}

function MiniStep({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-md border bg-card p-3 text-center shadow-sm">
      <Icon className="mx-auto h-5 w-5 text-primary" />
      <p className="mt-2 text-xs font-black uppercase">{label}</p>
    </div>
  );
}
