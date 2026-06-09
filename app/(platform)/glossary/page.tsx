"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

type GlossaryEntry = {
  term: string;
  category: string;
  definition: string;
  example?: string;
};

const TERMS: GlossaryEntry[] = [
  { term: "Adjuvant Therapy", category: "Treatment", definition: "Treatment given after the primary treatment (usually surgery) to kill any remaining cancer cells and reduce the risk of the cancer coming back.", example: "Adjuvant chemotherapy after breast cancer surgery." },
  { term: "ALK (Anaplastic Lymphoma Kinase)", category: "Biomarker", definition: "A gene that, when mutated or rearranged, can drive cancer growth. ALK-positive lung cancers can be treated with targeted therapies like crizotinib or alectinib." },
  { term: "Biomarker", category: "Biomarker", definition: "A biological molecule found in blood, tissue, or other body fluids that indicates normal or abnormal processes, or the presence of a disease. Used to guide treatment decisions." },
  { term: "Biopsy", category: "Diagnosis", definition: "A medical procedure where a small sample of tissue is removed from the body and examined under a microscope to check for cancer cells.", example: "A core needle biopsy of a breast lump." },
  { term: "BRCA1 / BRCA2", category: "Biomarker", definition: "Genes that produce proteins helping suppress tumor growth. Mutations in these genes significantly increase the risk of breast and ovarian cancers, and may indicate eligibility for PARP inhibitors." },
  { term: "CAR-T Cell Therapy", category: "Treatment", definition: "A type of immunotherapy where a patient's own T cells are genetically engineered in a laboratory to produce special receptors (CARs) that target and destroy cancer cells." },
  { term: "Chemotherapy", category: "Treatment", definition: "The use of powerful drugs to destroy cancer cells. It works by stopping or slowing the growth of cancer cells, which grow and divide quickly." },
  { term: "Clinical Trial", category: "Research", definition: "A research study that tests how well new medical approaches work in people. Trials test new treatments, drugs, surgical procedures, or ways to prevent, detect, or manage cancer." },
  { term: "dMMR / MSI-H", category: "Biomarker", definition: "Deficient mismatch repair (dMMR) and microsatellite instability-high (MSI-H) are biomarkers that indicate a tumor is likely to respond well to immunotherapy checkpoint inhibitors." },
  { term: "EGFR (Epidermal Growth Factor Receptor)", category: "Biomarker", definition: "A protein on the surface of cells that helps them grow. EGFR mutations in lung cancer cells can be targeted with specific drugs like erlotinib or osimertinib." },
  { term: "ER-Positive (ER+)", category: "Biomarker", definition: "A breast cancer classification meaning the cancer cells have receptors for estrogen and need estrogen to grow. ER+ cancers can often be treated with hormone therapy." },
  { term: "HER2-Positive (HER2+)", category: "Biomarker", definition: "A breast cancer classification where cancer cells have too much of the HER2 protein, causing them to grow quickly. HER2+ cancers can be targeted with trastuzumab (Herceptin)." },
  { term: "Immunotherapy", category: "Treatment", definition: "A type of cancer treatment that helps the immune system fight cancer. Checkpoint inhibitors are the most common type, blocking proteins that stop the immune system from attacking cancer cells." },
  { term: "Ki-67", category: "Biomarker", definition: "A protein marker used to measure how fast cancer cells are dividing. A high Ki-67 percentage means the cancer is growing quickly (high proliferation rate)." },
  { term: "KRAS", category: "Biomarker", definition: "One of the most commonly mutated genes in cancer. The KRAS G12C mutation can now be targeted with drugs like sotorasib. Found frequently in lung, colorectal, and pancreatic cancers." },
  { term: "Lymph Node", category: "Anatomy", definition: "Small glands that are part of the lymphatic system. Cancer cells can travel to nearby lymph nodes, making their presence an important staging factor." },
  { term: "Metastasis", category: "Diagnosis", definition: "The spread of cancer cells from the place where they first formed (primary site) to another part of the body. Also called stage IV or advanced disease." },
  { term: "Neoadjuvant Therapy", category: "Treatment", definition: "Treatment given before the primary treatment (usually surgery) to shrink a tumor, making it easier to remove or allowing less invasive surgery." },
  { term: "Oncologist", category: "Care Team", definition: "A doctor who specializes in diagnosing and treating cancer. Medical oncologists focus on chemotherapy and systemic treatments; surgical oncologists perform cancer surgeries." },
  { term: "Pathology Report", category: "Diagnosis", definition: "A document from a pathologist describing the characteristics of tissue removed from a biopsy or surgery, including whether cancer is present, its type, grade, and other features." },
  { term: "PD-L1", category: "Biomarker", definition: "A protein on cancer cells that can suppress immune attacks. High PD-L1 expression (measured as a percentage) predicts better response to checkpoint inhibitor immunotherapy drugs." },
  { term: "PARP Inhibitor", category: "Treatment", definition: "A targeted therapy that blocks PARP proteins, which help damaged cells repair themselves. Effective for cancers with BRCA1/2 mutations as these cancers cannot repair DNA damage." },
  { term: "Prognosis", category: "Diagnosis", definition: "A prediction of the likely course and outcome of a disease. In oncology, prognosis includes the likelihood of cure, survival rates, and quality of life after treatment." },
  { term: "Radiation Therapy", category: "Treatment", definition: "The use of high-energy radiation to kill cancer cells or keep them from growing. Radiation damages the DNA of cancer cells so they cannot divide." },
  { term: "Staging", category: "Diagnosis", definition: "The process of determining how far cancer has spread. Most cancers are staged I–IV: Stage I is early, localized cancer; Stage IV is cancer that has spread to distant parts of the body." },
  { term: "Targeted Therapy", category: "Treatment", definition: "Cancer treatment that uses drugs or other substances to precisely identify and attack specific types of cancer cells, usually with fewer side effects than chemotherapy." },
  { term: "TMB (Tumor Mutational Burden)", category: "Biomarker", definition: "A measure of the number of mutations in cancer cells. High TMB (TMB-H) is associated with better response to immunotherapy in several cancer types." },
  { term: "Triple-Negative Breast Cancer (TNBC)", category: "Cancer Type", definition: "A type of breast cancer that tests negative for ER, PR, and HER2. It is more aggressive and doesn't respond to hormone therapies. Chemotherapy and immunotherapy are primary options." }
];

const CATEGORIES = ["All", ...Array.from(new Set(TERMS.map((t) => t.category))).sort()];

const categoryColors: Record<string, string> = {
  Treatment: "bg-blue-50 text-blue-700 border-blue-200",
  Biomarker: "bg-violet-50 text-violet-700 border-violet-200",
  Diagnosis: "bg-amber-50 text-amber-700 border-amber-200",
  Research: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Care Team": "bg-rose-50 text-rose-700 border-rose-200",
  Anatomy: "bg-teal-50 text-teal-700 border-teal-200",
  "Cancer Type": "bg-indigo-50 text-indigo-700 border-indigo-200"
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = TERMS.filter((t) => {
    const matchesSearch =
      !search ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || t.category === category;
    return matchesSearch && matchesCategory;
  });

  // Group by first letter
  const grouped: Record<string, GlossaryEntry[]> = {};
  filtered.forEach((t) => {
    const letter = t.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(t);
  });

  return (
    <>
      <PageHeader
        eyebrow="Medical Education"
        title="Medical Glossary"
        description="Plain-language definitions of oncology terms, biomarkers, treatment types, and diagnostic concepts. Search or filter by category."
      />

      {/* Search + Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms or definitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                category === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-medium">{filtered.length} terms found</p>
      </div>

      {/* Terms */}
      <div className="space-y-6">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, terms]) => (
            <div key={letter}>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">{letter}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {terms.map((term) => (
                  <Card key={term.term} className="clinical-card">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="text-base font-black text-foreground">{term.term}</h3>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${categoryColors[term.category] ?? "bg-muted text-muted-foreground border-border"}`}>
                          {term.category}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-6 text-muted-foreground">{term.definition}</p>
                      {term.example && (
                        <p className="mt-2 rounded-lg border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground italic">
                          Example: {term.example}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
