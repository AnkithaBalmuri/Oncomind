"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useTranslation } from "@/lib/translations";

type Treatment = {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  howItWorks: string;
  typicalUse: string;
  duration: string;
  administration: string;
  pros: string[];
  cons: string[];
  sideEffects: string[];
  bestFor: string[];
};

const TREATMENTS: Treatment[] = [
  {
    id: "surgery",
    name: "Surgery",
    color: "from-blue-500/15 to-indigo-500/10 border-blue-200",
    icon: "🔪",
    description: "Physical removal of tumor tissue, affected lymph nodes, or entire organs.",
    howItWorks: "A surgeon directly removes cancerous tissue from the body, which may also include a margin of healthy tissue to ensure complete removal.",
    typicalUse: "First-line treatment for solid tumors detected before metastasis",
    duration: "Hours (procedure) + weeks to months (recovery)",
    administration: "Hospital/surgical center",
    pros: [
      "Can be curative for early-stage solid tumors",
      "Immediate removal of visible tumor",
      "Provides tissue for staging and pathology",
      "No ongoing treatment required if successful"
    ],
    cons: [
      "Requires anesthesia and hospitalization",
      "Physical recovery time",
      "Not suitable for metastatic disease",
      "Risk of surgical complications"
    ],
    sideEffects: ["Pain at surgical site", "Fatigue", "Infection risk", "Scarring", "Nerve damage"],
    bestFor: ["Early-stage breast cancer", "Localized prostate cancer", "Resectable colon cancer", "Thyroid cancer"]
  },
  {
    id: "chemotherapy",
    name: "Chemotherapy",
    color: "from-violet-500/15 to-purple-500/10 border-violet-200",
    icon: "💊",
    description: "Powerful drugs that kill rapidly dividing cancer cells throughout the body.",
    howItWorks: "Cytotoxic drugs interfere with cell division, targeting rapidly dividing cells — both cancerous and some healthy cells like hair follicles and gut lining.",
    typicalUse: "Multiple cancer types; adjuvant, neoadjuvant, or palliative intent",
    duration: "3–6 months typically (cycles of treatment + rest)",
    administration: "IV infusion or oral pills",
    pros: [
      "Works throughout the entire body (systemic)",
      "Effective for many cancer types",
      "Can shrink tumors before surgery",
      "Established, well-understood treatment"
    ],
    cons: [
      "Significant side effects on healthy cells",
      "Hair loss common",
      "Immune suppression",
      "Requires frequent clinic visits"
    ],
    sideEffects: ["Nausea/vomiting", "Hair loss", "Fatigue", "Mouth sores", "Increased infection risk", "Peripheral neuropathy"],
    bestFor: ["Lymphoma", "Leukemia", "Testicular cancer", "Many solid tumors (adjuvant)"]
  },
  {
    id: "radiation",
    name: "Radiation Therapy",
    color: "from-amber-500/15 to-orange-500/10 border-amber-200",
    icon: "⚡",
    description: "High-energy radiation beams that damage DNA in cancer cells, preventing them from dividing.",
    howItWorks: "Radiation damages the DNA of cancer cells, preventing them from dividing and growing. Normal cells can usually repair radiation damage better than cancer cells.",
    typicalUse: "Local control; often combined with surgery or chemotherapy",
    duration: "Days to weeks (daily sessions of minutes each)",
    administration: "External beam or brachytherapy (internal)",
    pros: [
      "Highly targeted to tumor location",
      "Non-invasive (external beam)",
      "Can treat inoperable tumors",
      "Effective for local control"
    ],
    cons: [
      "Only effective locally (not systemic)",
      "Cumulative radiation exposure",
      "Daily appointments for weeks",
      "Long-term tissue damage possible"
    ],
    sideEffects: ["Skin irritation", "Fatigue", "Local inflammation", "Tissue fibrosis (long-term)", "Depends on treatment area"],
    bestFor: ["Head & neck cancer", "Prostate cancer", "Brain tumors", "Palliative bone pain relief"]
  },
  {
    id: "immunotherapy",
    name: "Immunotherapy",
    color: "from-emerald-500/15 to-teal-500/10 border-emerald-200",
    icon: "🛡️",
    description: "Treatments that harness or enhance the body's immune system to recognize and attack cancer cells.",
    howItWorks: "Checkpoint inhibitors (like pembrolizumab) block proteins that prevent immune cells from attacking cancer. Other types include CAR-T therapy and cancer vaccines.",
    typicalUse: "PD-L1+ tumors, MSI-H/dMMR cancers, specific cancer types",
    duration: "Months to years (ongoing treatment)",
    administration: "IV infusion every 2–6 weeks",
    pros: [
      "Can produce long-lasting responses",
      "Less hair loss than chemotherapy",
      "Some patients achieve complete remission",
      "Effective across multiple cancer types"
    ],
    cons: [
      "Only works for patients with right biomarkers",
      "Immune-related side effects can be severe",
      "Expensive",
      "Response is unpredictable"
    ],
    sideEffects: ["Fatigue", "Rash", "Immune-related inflammation (colitis, pneumonitis)", "Thyroid dysfunction", "Arthritis"],
    bestFor: ["Melanoma", "NSCLC (PD-L1+)", "MSI-H cancers", "Renal cell carcinoma", "Bladder cancer"]
  },
  {
    id: "targeted",
    name: "Targeted Therapy",
    color: "from-rose-500/15 to-pink-500/10 border-rose-200",
    icon: "🎯",
    description: "Drugs that target specific molecular changes (mutations, proteins) present in cancer cells.",
    howItWorks: "Identifies and blocks specific molecules (like EGFR, HER2, BRAF, ALK) that cancer cells need to grow. More precise than chemotherapy.",
    typicalUse: "Cancers with specific actionable mutations identified by NGS testing",
    duration: "Continuous (oral daily or periodic IV)",
    administration: "Usually oral pills; some IV",
    pros: [
      "Precision medicine — attacks specific mutations",
      "Often fewer side effects than chemo",
      "Can be taken as oral pills",
      "Very effective when mutation matches"
    ],
    cons: [
      "Only works if cancer has specific mutation",
      "Resistance develops over time",
      "Requires genomic testing first",
      "Limited to specific cancer types"
    ],
    sideEffects: ["Skin rash", "Diarrhea", "Liver enzyme elevation", "High blood pressure", "Fatigue"],
    bestFor: ["HER2+ breast cancer", "EGFR/ALK+ NSCLC", "BRAF-mutant melanoma", "BCR-ABL CML", "BRCA+ ovarian cancer"]
  }
];

export default function TreatmentsPage() {
  const { t, langKey } = useTranslation();
  const [selected, setSelected] = useState<string[]>([TREATMENTS[0].id, TREATMENTS[1].id]);

  const treatmentTranslations: Record<string, Record<string, string>> = {
    te: {
      "Surgery": "సర్జరీ (శస్త్రచికిత్స)",
      "Chemotherapy": "కీమోథెరపీ",
      "Radiation Therapy": "రేడియేషన్ థెరపీ",
      "Immunotherapy": "ఇమ్యునోథెరపీ",
      "Targeted Therapy": "టార్గెటెడ్ థెరపీ",
      "How it works": "ఇది ఎలా పనిచేస్తుంది",
      "Typical use": "సాధారణ ఉపయోగం",
      "Duration": "వ్యవధి",
      "Administration": "నిర్వహణ విధానం",
      "Advantages": "ప్రయోజనాలు",
      "Limitations": "పరిమితులు",
      "Common Side Effects": "సాధారణ దుష్ప్రభావాలు",
      "Best For": "ఉత్తమంగా సరిపోతుంది"
    },
    hi: {
      "Surgery": "सर्जरी (शल्य चिकित्सा)",
      "Chemotherapy": "कीमोथेरेपी",
      "Radiation Therapy": "रेडिएशन थेरेपी",
      "Immunotherapy": "इम्यूनोथेरेपी",
      "Targeted Therapy": "लक्षित थेरेपी (Targeted Therapy)",
      "How it works": "यह कैसे काम करता है",
      "Typical use": "सामान्य उपयोग",
      "Duration": "अवधि",
      "Administration": "प्रशासन",
      "Advantages": "लाभ",
      "Limitations": "सीमाएं",
      "Common Side Effects": "सामान्य दुष्प्रभाव",
      "Best For": "सर्वोत्तम उपयोग"
    }
  };

  const translateText = (text: string) => {
    if (langKey === "te" || langKey === "hi") {
      return treatmentTranslations[langKey]?.[text] || text;
    }
    return text;
  };

  const selectedTreatments = TREATMENTS.filter((t) => selected.includes(t.id));

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((x) => x !== id) : prev
        : prev.length < 3 ? [...prev, id] : prev
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={t("treatmentsEyebrow")}
        title={t("treatmentsTitle")}
        description={t("treatmentsDesc")}
      />

      {/* Selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TREATMENTS.map((treatment) => (
          <button
            key={treatment.id}
            onClick={() => toggle(treatment.id)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
              selected.includes(treatment.id)
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
            }`}
          >
            {treatment.icon} {translateText(treatment.name)}
          </button>
        ))}
        <p className="flex items-center text-xs text-muted-foreground ml-2">{t("selectCompare")}</p>
      </div>

      {/* Comparison grid */}
      <div className={`grid gap-4 ${selectedTreatments.length === 1 ? "max-w-lg" : selectedTreatments.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {selectedTreatments.map((treatment) => (
          <div key={treatment.id} className={`flex flex-col gap-4 rounded-2xl border bg-gradient-to-br p-5 ${treatment.color}`}>
            <div>
              <p className="text-2xl">{treatment.icon}</p>
              <h2 className="mt-2 text-xl font-black text-foreground">{translateText(treatment.name)}</h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground leading-5">{treatment.description}</p>
            </div>

            <div className="space-y-1 text-xs">
              <Detail label={translateText("How it works")} value={treatment.howItWorks} />
              <Detail label={translateText("Typical use")} value={treatment.typicalUse} />
              <Detail label={translateText("Duration")} value={treatment.duration} />
              <Detail label={translateText("Administration")} value={treatment.administration} />
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-emerald-700">{translateText("Advantages")}</p>
              {treatment.pros.map((p) => (
                <div key={p} className="mb-1 flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <p className="text-xs font-medium text-foreground">{p}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-rose-700">{translateText("Limitations")}</p>
              {treatment.cons.map((c) => (
                <div key={c} className="mb-1 flex items-start gap-1.5">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  <p className="text-xs font-medium text-foreground">{c}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-muted-foreground">{translateText("Common Side Effects")}</p>
              <div className="flex flex-wrap gap-1">
                {treatment.sideEffects.map((s) => (
                  <span key={s} className="rounded-full border bg-card px-2.5 py-0.5 text-xs font-medium text-foreground">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-primary">{translateText("Best For")}</p>
              {treatment.bestFor.map((b) => (
                <div key={b} className="mb-1 flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card/60 px-3 py-2">
      <p className="font-bold text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground leading-4">{value}</p>
    </div>
  );
}
