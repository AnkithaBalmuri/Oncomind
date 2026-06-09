import {
  Activity,
  BookOpen,
  BookmarkCheck,
  Brain,
  BrainCircuit,
  CalendarCheck,
  ClipboardList,
  FileText,
  FlaskConical,
  FolderHeart,
  Gauge,
  HeartPulse,
  Home,
  MessageSquareText,
  Mic,
  Pill,
  Search,
  Settings,
  Stethoscope,
  UploadCloud,
  Users
} from "lucide-react";
import type { CancerReport, ChartPoint, ChatMessage, Metric, NavItem, Source, Trial, UploadedDocument } from "@/types";

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "AI Chat", href: "/chat", icon: MessageSquareText },
  { title: "Voice Assistant", href: "/voice", icon: Mic },
  { title: "Documents", href: "/documents", icon: UploadCloud },
  { title: "Medical Vault", href: "/vault", icon: FolderHeart },
  { title: "Report Analyzer", href: "/analyzer", icon: HeartPulse },
  { title: "Research", href: "/research", icon: FlaskConical },
  { title: "Clinical Trials", href: "/trials", icon: Search },
  { title: "Visit Prep", href: "/visit-prep", icon: ClipboardList },
  { title: "Knowledge Hub", href: "/hub", icon: BookOpen },
  { title: "Treatment Explorer", href: "/treatments", icon: Pill },
  { title: "Medical Glossary", href: "/glossary", icon: Brain },
  { title: "Saved Insights", href: "/saved", icon: BookmarkCheck },
  { title: "Follow-Up Tracker", href: "/tracker", icon: CalendarCheck },
  { title: "Evaluation", href: "/evaluation", icon: Gauge },
  { title: "Settings", href: "/settings", icon: Settings }
];

export const dashboardMetrics: Metric[] = [
  { label: "Documents Uploaded", value: "24", change: "+3", tone: "blue" },
  { label: "Queries Asked", value: "182", change: "+18", tone: "indigo" },
  { label: "Confidence Score", value: "93.4%", change: "+1.2%", tone: "emerald" },
  { label: "Citations Generated", value: "541", change: "+47", tone: "indigo" },
  { label: "Reports Analyzed", value: "17", change: "+5", tone: "blue" },
  { label: "Clinical Trials Viewed", value: "63", change: "+12", tone: "emerald" },
  { label: "Research Papers Retrieved", value: "289", change: "+34", tone: "blue" },
  { label: "AI Insights Generated", value: "94", change: "+21", tone: "indigo" }
];

export const usageTrend: ChartPoint[] = [
  { name: "Jan", value: 420, confidence: 86, cost: 74 },
  { name: "Feb", value: 560, confidence: 88, cost: 91 },
  { name: "Mar", value: 710, confidence: 90, cost: 119 },
  { name: "Apr", value: 940, confidence: 91, cost: 146 },
  { name: "May", value: 1210, confidence: 92, cost: 182 },
  { name: "Jun", value: 1490, confidence: 94, cost: 214 }
];

export const queryDistribution = [
  { name: "Report analysis", value: 38 },
  { name: "Treatment options", value: 24 },
  { name: "Clinical trials", value: 18 },
  { name: "Research review", value: 14 },
  { name: "Visit prep", value: 6 }
];

export const evaluationMetrics: Metric[] = [
  { label: "Accuracy", value: "94.2%", change: "+2.1%", tone: "emerald" },
  { label: "Faithfulness", value: "96.8%", change: "+1.4%", tone: "blue" },
  { label: "Relevance", value: "92.7%", change: "+3.9%", tone: "indigo" },
  { label: "Hallucination Rate", value: "1.8%", change: "-0.7%", tone: "rose" },
  { label: "Latency", value: "1.24s", change: "-180ms", tone: "amber" },
  { label: "Cost Per Query", value: "$0.024", change: "-9.2%", tone: "emerald" }
];

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Summarize this pathology report and highlight actionable biomarkers."
  },
  {
    id: "m2",
    role: "assistant",
    confidence: 93,
    content:
      "The uploaded report is consistent with **invasive ductal carcinoma** with hormone receptor positivity. Key actionable signals include ER positivity, PR low expression, HER2 negative status, and Ki-67 elevation. A multidisciplinary review should validate staging and treatment sequencing.",
    citations: [
      { title: "NCCN Breast Cancer Guidelines", source: "NCCN", year: 2026, relevance: 96 },
      { title: "ASCO Biomarker Testing Recommendations", source: "JCO", year: 2025, relevance: 91 }
    ]
  }
];

export const documents: UploadedDocument[] = [
  { id: "d1", name: "pathology-report-breast.pdf", type: "PDF", status: "Processed", progress: 100, uploadedAt: "Today" },
  { id: "d2", name: "oncology-consult-notes.docx", type: "DOCX", status: "Processing", progress: 72, uploadedAt: "Yesterday" },
  { id: "d3", name: "genomics-panel.txt", type: "TXT", status: "Needs Review", progress: 44, uploadedAt: "May 30" }
];

export const report: CancerReport = {
  cancerType: "Breast carcinoma, invasive ductal subtype",
  stage: "Clinical Stage IIB",
  biomarkers: ["ER+", "PR low", "HER2-", "Ki-67 32%", "PIK3CA pending"],
  riskLevel: "Moderate",
  findings: [
    "Tumor size reported at 3.1 cm with suspicious axillary node involvement.",
    "No distant metastasis described in current imaging summary.",
    "Biomarker profile may support endocrine therapy discussion after oncology review."
  ]
};

export const sources: Source[] = [
  {
    title: "CDK4/6 inhibitor outcomes in HR-positive metastatic breast cancer",
    journal: "The Lancet Oncology",
    summary: "Supports durable progression-free survival gains when paired with endocrine therapy in selected patients.",
    evidence: "Strong"
  },
  {
    title: "AI-assisted molecular tumor board workflows",
    journal: "Nature Medicine",
    summary: "Shows improved evidence retrieval speed while maintaining clinician review as final authority.",
    evidence: "Moderate"
  },
  {
    title: "Patient-facing oncology decision aids",
    journal: "JAMA Oncology",
    summary: "Decision aids improve question preparedness and treatment comprehension before oncology visits.",
    evidence: "Strong"
  }
];

export const CANCER_TYPES = [
  "Breast Cancer",
  "Lung Cancer",
  "Colon Cancer",
  "Rectal Cancer",
  "Prostate Cancer",
  "Cervical Cancer",
  "Ovarian Cancer",
  "Pancreatic Cancer",
  "Liver Cancer",
  "Kidney Cancer",
  "Bladder Cancer",
  "Brain Tumor",
  "Glioblastoma",
  "Leukemia",
  "Lymphoma",
  "Multiple Myeloma",
  "Melanoma",
  "Thyroid Cancer",
  "Oral Cancer",
  "Stomach Cancer",
  "Esophageal Cancer",
  "Sarcoma",
  "Head & Neck Cancer",
  "Neuroendocrine Tumors",
  "Pediatric Cancers",
  "Pan-cancer"
];

export const TRIAL_COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Norway",
  "Denmark",
  "India",
  "Japan",
  "South Korea",
  "Singapore",
  "Australia",
  "New Zealand",
  "China",
  "Brazil"
];

export const TRIAL_PHASES = ["Phase 1", "Phase 1/2", "Phase 2", "Phase 2/3", "Phase 3", "Phase 4"];
export const TRIAL_STATUSES = ["Recruiting", "Active, not recruiting", "Completed", "Not yet recruiting", "Suspended"];
export const TREATMENT_TYPES = ["Immunotherapy", "Targeted Therapy", "Chemotherapy", "Radiation", "Surgery", "Hormone Therapy", "CAR-T Cell Therapy", "Bone Marrow Transplant"];

export const trials: Trial[] = [
  { id: "NCT-OM-1042", title: "Targeted therapy plus endocrine sequencing for HR-positive breast cancer", cancerType: "Breast Cancer", country: "United States", phase: "Phase 2", eligibility: "Adults with measurable HR+/HER2- disease and adequate organ function.", status: "Recruiting", sponsor: "Memorial Sloan Kettering", biomarker: "ER+/HER2-", contact: "trials@mskcc.org" },
  { id: "NCT-OM-2199", title: "AI-guided molecular matching for solid tumors", cancerType: "Pan-cancer", country: "Canada", phase: "Phase 1/2", eligibility: "Advanced solid tumors with available sequencing results.", status: "Recruiting", sponsor: "Princess Margaret Cancer Centre", biomarker: "TMB-High", contact: "research@uhn.ca" },
  { id: "NCT-OM-5521", title: "Immunotherapy response monitoring in lung cancer", cancerType: "Lung Cancer", country: "United Kingdom", phase: "Phase 3", eligibility: "NSCLC patients starting checkpoint inhibitor therapy.", status: "Active, not recruiting", sponsor: "The Royal Marsden", biomarker: "PD-L1≥50%", contact: "trials@royalmarsden.nhs.uk" },
  { id: "NCT-OM-3301", title: "Neoadjuvant chemotherapy optimization for triple-negative breast cancer", cancerType: "Breast Cancer", country: "Germany", phase: "Phase 2", eligibility: "TNBC patients aged 18-70, ECOG 0-1.", status: "Recruiting", sponsor: "Charité University Medicine", biomarker: "TNBC", contact: "oncology@charite.de" },
  { id: "NCT-OM-4412", title: "CAR-T cell therapy for refractory lymphoma", cancerType: "Lymphoma", country: "France", phase: "Phase 1", eligibility: "Relapsed/refractory large B-cell lymphoma after ≥2 prior lines.", status: "Recruiting", sponsor: "Institut Gustave Roussy", biomarker: "CD19+", contact: "cart@igr.fr" },
  { id: "NCT-OM-6601", title: "PARP inhibitor maintenance in advanced ovarian cancer", cancerType: "Ovarian Cancer", country: "United States", phase: "Phase 3", eligibility: "BRCA1/2-mutated platinum-sensitive recurrent ovarian cancer.", status: "Recruiting", sponsor: "MD Anderson Cancer Center", biomarker: "BRCA1/2", contact: "gynoncology@mdanderson.org" },
  { id: "NCT-OM-7721", title: "Proton beam therapy vs. IMRT for prostate cancer", cancerType: "Prostate Cancer", country: "Japan", phase: "Phase 3", eligibility: "Localized prostate cancer, Gleason score 6-8.", status: "Recruiting", sponsor: "National Cancer Center Japan", biomarker: "PSA elevated", contact: "trials@ncc.go.jp" },
  { id: "NCT-OM-8834", title: "Targeted RAS inhibition in pancreatic ductal adenocarcinoma", cancerType: "Pancreatic Cancer", country: "United States", phase: "Phase 1/2", eligibility: "KRAS G12C mutation confirmed by NGS.", status: "Recruiting", sponsor: "Johns Hopkins Sidney Kimmel", biomarker: "KRAS G12C", contact: "pancreatic@jhmi.edu" },
  { id: "NCT-OM-9901", title: "Pembrolizumab plus lenvatinib in hepatocellular carcinoma", cancerType: "Liver Cancer", country: "South Korea", phase: "Phase 2", eligibility: "Unresectable HCC, Child-Pugh A, BCLC stage B/C.", status: "Recruiting", sponsor: "Asan Medical Center", biomarker: "AFP elevated", contact: "liver@amc.seoul.kr" },
  { id: "NCT-OM-1102", title: "Venetoclax plus azacitidine for AML in elderly patients", cancerType: "Leukemia", country: "Australia", phase: "Phase 3", eligibility: "Newly diagnosed AML, age ≥65, ineligible for intensive chemotherapy.", status: "Active, not recruiting", sponsor: "Peter MacCallum Cancer Centre", biomarker: "IDH1/2 or FLT3", contact: "haematology@petermac.org" },
  { id: "NCT-OM-1203", title: "Checkpoint inhibitor combination in melanoma brain metastases", cancerType: "Melanoma", country: "Australia", phase: "Phase 2", eligibility: "Melanoma with ≥1 untreated brain metastasis, ECOG 0-2.", status: "Recruiting", sponsor: "Melanoma Institute Australia", biomarker: "BRAF V600", contact: "trials@melanoma.org.au" },
  { id: "NCT-OM-1305", title: "Lenvatinib for radioiodine-refractory thyroid cancer", cancerType: "Thyroid Cancer", country: "Switzerland", phase: "Phase 2", eligibility: "RAI-refractory differentiated thyroid cancer, measurable disease.", status: "Recruiting", sponsor: "University Hospital Zurich", biomarker: "BRAF/RET", contact: "endocrine.oncology@usz.ch" },
  { id: "NCT-OM-1407", title: "Nivolumab in recurrent head and neck squamous cell carcinoma", cancerType: "Head & Neck Cancer", country: "India", phase: "Phase 3", eligibility: "Recurrent/metastatic HNSCC, platinum refractory.", status: "Recruiting", sponsor: "Tata Memorial Hospital", biomarker: "PD-L1 CPS≥1", contact: "hnscc@tmc.gov.in" },
  { id: "NCT-OM-1509", title: "CAR-T therapy for pediatric ALL", cancerType: "Pediatric Cancers", country: "United States", phase: "Phase 1/2", eligibility: "Age 1-25, B-cell ALL, relapsed/refractory.", status: "Recruiting", sponsor: "Children's Hospital of Philadelphia", biomarker: "CD19/CD22", contact: "pediatriconcology@chop.edu" },
  { id: "NCT-OM-1611", title: "Olaparib in BRCA-mutated pancreatic cancer", cancerType: "Pancreatic Cancer", country: "United Kingdom", phase: "Phase 2", eligibility: "Germline BRCA1/2 mutation, platinum-sensitive advanced pancreatic cancer.", status: "Recruiting", sponsor: "The Institute of Cancer Research", biomarker: "gBRCA1/2", contact: "gi.oncology@icr.ac.uk" },
  { id: "NCT-OM-1714", title: "Erdafitinib for FGFR-altered bladder cancer", cancerType: "Bladder Cancer", country: "Netherlands", phase: "Phase 3", eligibility: "FGFR2/3 alterations, locally advanced or metastatic urothelial carcinoma.", status: "Recruiting", sponsor: "Netherlands Cancer Institute", biomarker: "FGFR2/3", contact: "bladder@nki.nl" },
  { id: "NCT-OM-1819", title: "Sotorasib in KRAS G12C lung adenocarcinoma", cancerType: "Lung Cancer", country: "Germany", phase: "Phase 2", eligibility: "KRAS G12C-mutant NSCLC, ≥1 prior therapy.", status: "Active, not recruiting", sponsor: "University Hospital Munich", biomarker: "KRAS G12C", contact: "thoracic@lmu.de" },
  { id: "NCT-OM-1923", title: "Bevacizumab plus temozolomide in glioblastoma", cancerType: "Glioblastoma", country: "United States", phase: "Phase 2", eligibility: "Newly diagnosed GBM, ECOG 0-2, post-surgical resection.", status: "Recruiting", sponsor: "Mayo Clinic Comprehensive Cancer Center", biomarker: "IDH wildtype", contact: "neurooncology@mayo.edu" },
  { id: "NCT-OM-2027", title: "Selpercatinib for RET-positive colorectal cancer", cancerType: "Colon Cancer", country: "United States", phase: "Phase 2", eligibility: "RET fusion-positive mCRC, ≥1 prior line.", status: "Recruiting", sponsor: "Dana-Farber Cancer Institute", biomarker: "RET fusion", contact: "gi.oncology@dfci.harvard.edu" },
  { id: "NCT-OM-2131", title: "Nivolumab in MSI-H gastric cancer first-line", cancerType: "Stomach Cancer", country: "Japan", phase: "Phase 3", eligibility: "Unresectable advanced gastric/GEJ cancer, MSI-H or dMMR.", status: "Recruiting", sponsor: "National Cancer Center Japan", biomarker: "MSI-H/dMMR", contact: "gi@ncc.go.jp" },
  { id: "NCT-OM-2235", title: "Daratumumab-based quadruplet for newly diagnosed multiple myeloma", cancerType: "Multiple Myeloma", country: "Spain", phase: "Phase 3", eligibility: "NDMM eligible for autologous stem cell transplant.", status: "Recruiting", sponsor: "Hospital Clinic Barcelona", biomarker: "CD38+", contact: "myeloma@clinic.cat" },
  { id: "NCT-OM-2339", title: "Cervical cancer immunotherapy in LMIC settings", cancerType: "Cervical Cancer", country: "India", phase: "Phase 2", eligibility: "Recurrent/persistent cervical cancer, PD-L1 positive.", status: "Recruiting", sponsor: "ICMR National Cancer Grid", biomarker: "PD-L1+", contact: "gynoncology@ncg.org.in" },
  { id: "NCT-OM-2443", title: "Lutetium-PSMA for metastatic castration-resistant prostate cancer", cancerType: "Prostate Cancer", country: "Germany", phase: "Phase 3", eligibility: "PSMA-positive mCRPC, ≥1 AR-pathway inhibitor.", status: "Active, not recruiting", sponsor: "Technical University Munich", biomarker: "PSMA+", contact: "urology.oncology@tum.de" },
  { id: "NCT-OM-2547", title: "Olaratumab plus doxorubicin in advanced sarcoma", cancerType: "Sarcoma", country: "France", phase: "Phase 2", eligibility: "PDGFRα-expressing soft tissue sarcoma, ≥1 prior line.", status: "Recruiting", sponsor: "Centre Léon Bérard", biomarker: "PDGFRα+", contact: "sarcoma@lyon.unicancer.fr" },
  { id: "NCT-OM-2651", title: "Everolimus in advanced neuroendocrine tumors", cancerType: "Neuroendocrine Tumors", country: "Sweden", phase: "Phase 2", eligibility: "Well-differentiated grade 1-2 NET, progressive disease.", status: "Recruiting", sponsor: "Karolinska University Hospital", biomarker: "mTOR pathway", contact: "net@karolinska.se" }
];

export const architectureNodes = [
  { title: "Document Agent", icon: FileText, text: "Extracts pathology, labs, imaging, and genomics." },
  { title: "Reasoning Agent", icon: BrainCircuit, text: "Synthesizes evidence with confidence scoring." },
  { title: "Research Agent", icon: FlaskConical, text: "Retrieves studies, guidelines, and trials." },
  { title: "Clinical Guardrails", icon: Stethoscope, text: "Applies citations, audit trails, and safety checks." },
  { title: "Evaluation Loop", icon: Activity, text: "Tracks accuracy, latency, cost, and hallucination risk." },
  { title: "User Intelligence", icon: Users, text: "Monitors usage, quality, and operational health." }
];
