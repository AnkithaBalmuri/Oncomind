"use client";

import { useState } from "react";
import { AlertTriangle, ChevronRight, Heart, Search, Shield, Stethoscope, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

type CancerInfo = {
  name: string;
  description: string;
  symptoms: string[];
  riskFactors: string[];
  treatments: string[];
  prevention: string[];
  prevalence: string;
  tag: string;
};

const CANCERS: CancerInfo[] = [
  {
    name: "Breast Cancer",
    description: "The most common cancer in women worldwide, originating in breast tissue. Highly treatable when detected early.",
    symptoms: ["Lump in breast or armpit", "Change in breast size or shape", "Nipple discharge", "Skin dimpling", "Persistent breast pain"],
    riskFactors: ["Female sex (primarily)", "Family history of BRCA1/2 mutations", "Age over 50", "Dense breast tissue", "Hormone replacement therapy"],
    treatments: ["Surgery (lumpectomy/mastectomy)", "Radiation therapy", "Chemotherapy", "Hormone therapy (ER+ cancers)", "Targeted therapy (HER2+ cancers)", "Immunotherapy"],
    prevention: ["Regular mammograms after 40", "Monthly self-exams", "Maintain healthy weight", "Limit alcohol", "Breastfeeding if possible"],
    prevalence: "2.3M new cases/year globally",
    tag: "Common"
  },
  {
    name: "Lung Cancer",
    description: "The leading cause of cancer death worldwide. Most cases are non-small cell lung cancer (NSCLC). Smoking is the primary risk factor.",
    symptoms: ["Persistent cough", "Coughing up blood", "Shortness of breath", "Chest pain", "Unexplained weight loss", "Hoarseness"],
    riskFactors: ["Smoking (primary cause, ~85% of cases)", "Secondhand smoke exposure", "Radon gas", "Asbestos exposure", "Air pollution", "Family history"],
    treatments: ["Surgery (lobectomy/pneumonectomy)", "Radiation", "Chemotherapy", "Targeted therapy (EGFR, ALK, KRAS mutations)", "Immunotherapy (PD-L1+)"],
    prevention: ["Quit smoking immediately", "Avoid secondhand smoke", "Test home for radon", "Avoid occupational carcinogens", "Annual CT screening if high-risk"],
    prevalence: "2.2M new cases/year globally",
    tag: "High Risk"
  },
  {
    name: "Colorectal Cancer",
    description: "Cancer of the colon or rectum, usually developing from polyps. Highly preventable with regular screenings.",
    symptoms: ["Change in bowel habits", "Blood in stool", "Abdominal cramping", "Unexplained weight loss", "Fatigue", "Feeling of incomplete bowel emptying"],
    riskFactors: ["Age over 50", "Family history", "Inflammatory bowel disease", "Red and processed meat consumption", "Obesity", "Physical inactivity"],
    treatments: ["Surgery", "Chemotherapy (FOLFOX, FOLFIRI)", "Radiation (rectal)", "Targeted therapy (VEGF, EGFR)", "Immunotherapy (MSI-H)"],
    prevention: ["Colonoscopy from age 45", "High-fiber diet", "Limit red meat", "Regular exercise", "Aspirin (discuss with doctor)", "Maintain healthy weight"],
    prevalence: "1.9M new cases/year globally",
    tag: "Preventable"
  },
  {
    name: "Prostate Cancer",
    description: "The most common cancer in men, usually slow-growing. Many men live with prostate cancer without it ever causing serious problems.",
    symptoms: ["Frequent urination", "Weak urine stream", "Blood in urine or semen", "Erectile dysfunction", "Pelvic discomfort", "Bone pain (advanced)"],
    riskFactors: ["Age over 65", "African American ethnicity", "Family history", "High-fat diet", "Obesity"],
    treatments: ["Active surveillance (low-risk)", "Surgery (prostatectomy)", "Radiation", "Hormone therapy", "Chemotherapy (advanced)", "PARP inhibitors (BRCA+)"],
    prevention: ["Regular PSA screening", "Healthy diet (tomatoes, fish)", "Exercise", "Maintain healthy weight", "Discuss screening with doctor at 50"],
    prevalence: "1.4M new cases/year globally",
    tag: "Common"
  },
  {
    name: "Pancreatic Cancer",
    description: "Often called the 'silent killer' due to late detection. Has one of the lowest survival rates, making early diagnosis critical.",
    symptoms: ["Jaundice", "Abdominal pain radiating to back", "Unexplained weight loss", "Loss of appetite", "New-onset diabetes", "Light-colored stools"],
    riskFactors: ["Smoking", "Chronic pancreatitis", "Diabetes", "Obesity", "Family history", "Age over 65", "BRCA2/PALB2 mutations"],
    treatments: ["Surgery (Whipple procedure)", "Chemotherapy (FOLFIRINOX, gemcitabine)", "Radiation", "Targeted therapy (NTRK, KRAS G12C)", "PARP inhibitors (BRCA+)"],
    prevention: ["Quit smoking", "Maintain healthy weight", "Limit alcohol", "Control diabetes", "Genetic screening if family history"],
    prevalence: "495K new cases/year globally",
    tag: "High Risk"
  },
  {
    name: "Leukemia",
    description: "Cancer of blood-forming tissues, including bone marrow. Classified as acute or chronic, and lymphocytic or myeloid.",
    symptoms: ["Fatigue and weakness", "Frequent infections", "Easy bruising/bleeding", "Swollen lymph nodes", "Bone pain", "Fever", "Night sweats"],
    riskFactors: ["Previous cancer treatment (chemo/radiation)", "Genetic disorders (Down syndrome)", "Blood disorders (MDS)", "Smoking", "Benzene exposure", "Family history"],
    treatments: ["Chemotherapy", "Targeted therapy (TKIs for CML)", "Immunotherapy", "CAR-T cell therapy", "Stem cell transplant", "Venetoclax combinations"],
    prevention: ["Avoid carcinogen exposure", "Quit smoking", "No proven dietary prevention", "Genetic counseling if family history"],
    prevalence: "474K new cases/year globally",
    tag: "Blood Cancer"
  }
];

const tagColors: Record<string, string> = {
  "Common": "bg-blue-50 text-blue-700 border-blue-200",
  "High Risk": "bg-rose-50 text-rose-700 border-rose-200",
  "Preventable": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Blood Cancer": "bg-violet-50 text-violet-700 border-violet-200"
};

export default function HubPage() {
  const [selected, setSelected] = useState<CancerInfo>(CANCERS[0]);
  const [search, setSearch] = useState("");

  const filtered = CANCERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Cancer Education"
        title="Cancer Knowledge Hub"
        description="Plain-language education on cancer types, symptoms, risk factors, treatment options, and prevention strategies."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar list */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cancers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            {filtered.map((cancer) => (
              <button
                key={cancer.name}
                onClick={() => setSelected(cancer)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-all hover:border-primary/30 hover:bg-primary/5 ${
                  selected.name === cancer.name
                    ? "border-primary/30 bg-primary/8 text-primary"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <span>{cancer.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="space-y-5">
          <Card className="clinical-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className={`mb-3 text-xs ${tagColors[selected.tag]}`}>{selected.tag}</Badge>
                  <h2 className="text-2xl font-black text-foreground">{selected.name}</h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{selected.description}</p>
                </div>
                <div className="hidden shrink-0 rounded-xl border bg-muted/30 px-4 py-3 text-center sm:block">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Prevalence</p>
                  <p className="mt-1 text-sm font-black text-foreground">{selected.prevalence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <InfoCard
              title="Common Symptoms"
              icon={AlertTriangle}
              iconColor="text-rose-500"
              items={selected.symptoms}
              itemColor="bg-rose-50/50 border-rose-200/60"
            />
            <InfoCard
              title="Risk Factors"
              icon={Zap}
              iconColor="text-amber-500"
              items={selected.riskFactors}
              itemColor="bg-amber-50/50 border-amber-200/60"
            />
            <InfoCard
              title="Treatment Options"
              icon={Stethoscope}
              iconColor="text-primary"
              items={selected.treatments}
              itemColor="bg-blue-50/50 border-blue-200/60"
            />
            <InfoCard
              title="Prevention"
              icon={Shield}
              iconColor="text-emerald-500"
              items={selected.prevention}
              itemColor="bg-emerald-50/50 border-emerald-200/60"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({
  title,
  icon: Icon,
  iconColor,
  items,
  itemColor
}: {
  title: string;
  icon: typeof Heart;
  iconColor: string;
  items: string[];
  itemColor: string;
}) {
  return (
    <Card className="clinical-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-black">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div key={item} className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${itemColor}`}>
            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
