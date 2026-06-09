import type { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type Metric = {
  label: string;
  value: string;
  change: string;
  tone: "blue" | "emerald" | "indigo" | "rose" | "amber";
};

export type ChartPoint = {
  name: string;
  value: number;
  confidence?: number;
  cost?: number;
};

export type Citation = {
  title: string;
  source: string;
  year: number;
  relevance: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  citations?: Citation[];
};

export type UploadedDocument = {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "TXT" | "PNG" | "JPG";
  status: "Processed" | "Processing" | "Needs Review";
  progress: number;
  uploadedAt: string;
  size?: number;
  pages?: number;
  extractedText?: string;
  ocrStatus?: "Not started" | "Extracted" | "OCR queued" | "Failed";
  source?: "knowledge-base" | "patient-upload";
  category?: "Cancer Reports" | "Pathology Reports" | "Blood Tests" | "Scan Reports" | "Prescriptions" | "Hospital Discharge Summaries" | "Treatment Plans" | "Other Documents";
  cancerType?: string;
  hospitalName?: string;
  doctorName?: string;
  date?: string;
  keywords?: string[];
  summary?: string;
  keyFindings?: string[];
  stage?: string;
  biomarkers?: string[];
  relatedDocumentIds?: string[];
};

export type CancerReport = {
  cancerType: string;
  stage: string;
  biomarkers: string[];
  riskLevel: "Low" | "Moderate" | "High";
  findings: string[];
};

export type Trial = {
  id: string;
  title: string;
  cancerType: string;
  country: string;
  phase: string;
  eligibility: string;
  status: string;
  sponsor?: string;
  biomarker?: string;
  contact?: string;
};

export type Source = {
  title: string;
  journal: string;
  summary: string;
  evidence: "Strong" | "Moderate" | "Emerging";
};
