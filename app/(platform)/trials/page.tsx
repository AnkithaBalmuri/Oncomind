"use client";

import { PageHeader } from "@/components/shared/page-header";
import { TrialsClient } from "./trials-client";
import { useTranslation } from "@/lib/translations";

export default function TrialsPage() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        eyebrow={t("trialsEyebrow")}
        title={t("trialsTitle")}
        description={t("trialsDesc")}
      />
      <TrialsClient />
    </>
  );
}
