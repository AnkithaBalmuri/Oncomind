"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Brain, CheckCircle2, FileText, FlaskConical, Mic, PlayCircle, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { architectureNodes } from "@/lib/mock-data";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 }
};

const features = [
  { icon: FileText, title: "Report Analysis", desc: "Extract cancer type, stage, biomarkers, and treatment indicators from uploaded pathology reports.", color: "text-amber-600 bg-amber-50" },
  { icon: FlaskConical, title: "Research Retrieval", desc: "Access evidence-graded research papers, compare studies, and get plain-language summaries.", color: "text-violet-600 bg-violet-50" },
  { icon: Search, title: "Clinical Trial Matching", desc: "Search 25+ cancer types across 20 countries with phase, biomarker, and status filters.", color: "text-emerald-600 bg-emerald-50" },
  { icon: Mic, title: "Voice Assistant", desc: "Full voice-to-voice interaction — speak questions and hear AI-powered answers.", color: "text-rose-600 bg-rose-50" },
  { icon: Brain, title: "Medical Glossary", desc: "Plain-language definitions of oncology terms, biomarkers, and treatment concepts.", color: "text-blue-600 bg-blue-50" },
  { icon: TrendingUp, title: "Follow-Up Tracking", desc: "Track appointments, lab tests, and medication schedules throughout your care journey.", color: "text-teal-600 bg-teal-50" }
];

const metrics = [
  { value: "94.2%", label: "Answer Accuracy" },
  { value: "96.8%", label: "Citation Faithfulness" },
  { value: "1.24s", label: "Avg. Response Time" },
  { value: "25+", label: "Cancer Types" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-50" />
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(230 80% 56%), transparent 70%)" }} />
          <div className="pointer-events-none absolute -right-32 -top-20 h-80 w-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(163 80% 38%), transparent 70%)" }} />

          <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.1 }}>
              <motion.div variants={fadeUp}>
                <Badge className="mb-5 border-primary/20 bg-primary/10 text-primary gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Production-grade Cancer RAG Platform
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-none"
              >
                OncoMind AI
                <span className="block mt-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(230 80% 56%), hsl(163 80% 38%))" }}>
                  for Cancer Care
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg font-medium leading-8 text-muted-foreground">
                A professional Cancer Intelligence platform for patients, doctors, and researchers. Upload reports, ask questions, explore clinical trials, and prepare for oncology visits — all in one place.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2 font-bold shadow-primary-glow">
                  <Link href="/dashboard">
                    Open Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 font-semibold">
                  <Link href="/chat">
                    <PlayCircle className="h-4 w-4" />
                    Try AI Chat
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
                {["Cited answers", "Confidence scoring", "Biomarker extraction", "Clinical trial matching"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero visual — abstract AI dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:block"
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card/80 p-6 shadow-soft backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-bold text-muted-foreground">Cancer Intelligence Dashboard</span>
                </div>

                {/* Mock metric cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Reports Analyzed", value: "17", color: "from-blue-500/10 to-indigo-500/10 border-blue-200/60" },
                    { label: "Confidence Score", value: "93.4%", color: "from-emerald-500/10 to-teal-500/10 border-emerald-200/60" },
                    { label: "Trials Matched", value: "8", color: "from-violet-500/10 to-purple-500/10 border-violet-200/60" },
                    { label: "Citations", value: "541", color: "from-amber-500/10 to-orange-500/10 border-amber-200/60" }
                  ].map((m) => (
                    <div key={m.label} className={`rounded-xl border bg-gradient-to-br p-3 ${m.color}`}>
                      <p className="text-xs font-bold text-muted-foreground">{m.label}</p>
                      <p className="text-xl font-black text-foreground mt-1">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Mock chat */}
                <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="rounded-lg bg-primary/10 px-3 py-2">
                      <p className="text-xs font-semibold text-foreground">What does ER-positive mean for my treatment?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(230 80% 56%), hsl(163 80% 38%))" }}>
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="rounded-lg bg-card border px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground">ER-positive means estrogen receptors are present. This enables hormone therapies like tamoxifen...</p>
                      <Badge className="mt-1.5 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">93% confidence · 2 citations</Badge>
                    </div>
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/50 to-transparent rounded-b-2xl" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Metrics strip */}
        <section className="border-y bg-card/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-3xl font-black text-foreground">{m.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary">Platform Capabilities</Badge>
            <h2 className="text-4xl font-black tracking-tight text-foreground">Built for real oncology workflows</h2>
            <p className="mt-4 text-base font-medium leading-7 text-muted-foreground">
              OncoMind AI is designed around what patients, doctors, and researchers actually need — from report analysis to treatment comparison to trial discovery.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="clinical-card group hover:-translate-y-1 transition-transform duration-200">
                  <CardContent className="p-6">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Architecture */}
        <section className="py-20" style={{ background: "radial-gradient(ellipse at center, hsl(230 80% 56% / 0.06), transparent 60%), hsl(var(--muted) / 0.3)" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <Badge className="mb-4 border-primary/20 bg-primary/10 text-primary">Multi-Agent Architecture</Badge>
              <h2 className="text-4xl font-black tracking-tight text-foreground">Powered by specialized AI agents</h2>
              <p className="mt-4 text-base font-medium leading-7 text-muted-foreground">
                Each request passes through dedicated agents for document extraction, reasoning, research retrieval, clinical guardrails, and evaluation.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {architectureNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <Card key={node.title} className="clinical-card">
                    <CardContent className="p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mt-4 text-base font-black text-foreground">{node.title}</h3>
                      <p className="mt-2 text-sm font-medium leading-5 text-muted-foreground">{node.text}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(230 80% 56%), hsl(230 80% 45%))" }} />
          <div className="dot-grid absolute inset-0 opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_.7fr] items-center">
              <div>
                <h2 className="text-3xl font-black text-white sm:text-4xl">
                  Ready for a smarter oncology workflow?
                </h2>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/80">
                  Build patient-ready summaries, clinician-grade citations, and enterprise telemetry into one platform.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" variant="secondary" className="gap-2 font-bold">
                    <Link href="/dashboard">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2 font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20">
                    <Link href="/hub">
                      <ShieldCheck className="h-4 w-4" />
                      Explore Knowledge Hub
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-3">
                {["Oncology program director", "Precision medicine lead", "Clinical AI product team"].map((quote) => (
                  <div key={quote} className="rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-white backdrop-blur-sm">
                    &quot;OncoMind AI makes complex cancer information easier to review, explain, and act on.&quot;
                    <p className="mt-2 text-xs font-bold text-white/70">— {quote}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
