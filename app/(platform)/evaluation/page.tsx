"use client";

import { EvaluationTrendChart } from "@/components/shared/analytics-charts";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { evaluationMetrics } from "@/lib/mock-data";
import { useTranslation } from "@/lib/translations";

export default function EvaluationPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        eyebrow={t("evalEyebrow")}
        title={t("evalTitle")}
        description={t("evalDesc")}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {evaluationMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </div>
      <div className="mt-6">
        <EvaluationTrendChart />
      </div>
    </>
  );
}
