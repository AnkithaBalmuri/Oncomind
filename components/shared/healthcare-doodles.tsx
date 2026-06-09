import { Bot, ClipboardPlus, HeartPulse, Hospital, MessageCircleHeart, Microscope, Pill, Stethoscope, UserRoundCheck, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HealthcareDoodles() {
  return (
    <div className="fancy-text-box relative grid gap-4 rounded-lg p-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative z-10">
        <Badge className="border-pink-200 bg-pink-100 text-pink-700">Hospital care journey</Badge>
        <h2 className="mt-4 text-3xl font-black text-black">Patient, doctor, nurse and AI working together</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-black">
          OncoMind reads cancer reports, retrieves trusted evidence, and turns complex oncology information into clear,
          cited answers for safer conversations.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <CarePill icon={Hospital} label="Hospital" />
          <CarePill icon={Stethoscope} label="Nurse support" />
          <CarePill icon={Microscope} label="Cancer evidence" />
          <CarePill icon={Pill} label="Treatment talk" />
        </div>
      </div>
      <div className="relative z-10 min-h-72">
        <div className="absolute left-4 top-8 gentle-sway rounded-lg border bg-white/80 p-4 shadow-soft">
          <UserRoundCheck className="mx-auto h-12 w-12 text-sky-700" />
          <p className="mt-2 text-center text-xs font-black uppercase">Patient</p>
        </div>
        <div className="absolute right-7 top-2 gentle-sway rounded-lg border bg-emerald-50/90 p-4 shadow-soft" style={{ animationDelay: "0.6s" }}>
          <Stethoscope className="mx-auto h-12 w-12 text-emerald-700" />
          <p className="mt-2 text-center text-xs font-black uppercase">Nurse</p>
        </div>
        <div className="absolute bottom-6 left-10 gentle-sway rounded-lg border bg-indigo-50/90 p-4 shadow-soft" style={{ animationDelay: "1s" }}>
          <ClipboardPlus className="mx-auto h-12 w-12 text-indigo-700" />
          <p className="mt-2 text-center text-xs font-black uppercase">Report</p>
        </div>
        <div className="absolute bottom-10 right-8 agent-breathe rounded-full bg-slate-950 p-6 text-white shadow-glow">
          <Bot className="h-14 w-14" />
        </div>
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-pink-100 text-pink-600 shadow-soft soft-pop">
          <HeartPulse className="h-10 w-10" />
        </div>
        <div className="absolute bottom-0 right-0 rounded-lg bg-white/80 p-3 text-xs font-black text-black shadow-sm">
          <MessageCircleHeart className="mb-1 h-5 w-5 text-primary" />
          Cited, kind answers
        </div>
      </div>
    </div>
  );
}

function CarePill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-md border bg-white/70 p-3 text-sm font-black text-black shadow-sm">
      <Icon className="mb-2 h-5 w-5 text-primary" />
      {label}
    </div>
  );
}
