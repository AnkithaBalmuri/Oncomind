import { dashboardMetrics, queryDistribution, usageTrend } from "@/lib/mock-data";

export const analyticsService = {
  async getDashboard() {
    return { metrics: dashboardMetrics, usageTrend, queryDistribution };
  },
  async getAdmin() {
    return {
      users: 8420,
      activeClinicians: 612,
      errors: 11,
      uptime: "99.98%",
      logs: ["PHI redaction completed", "Trial index refreshed", "Cost guardrail triggered"]
    };
  }
};
