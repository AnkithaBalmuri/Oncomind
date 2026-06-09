import { evaluationMetrics, usageTrend } from "@/lib/mock-data";

export const evaluationService = {
  async getMetrics() {
    return { metrics: evaluationMetrics, trend: usageTrend };
  }
};
