import { Activity, Database, DollarSign, ShieldAlert, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

const panels: Array<[string, string, LucideIcon]> = [
  ["User analytics", "8,420 users - 612 active clinicians", Activity],
  ["Query logs", "9,742 reviewed questions this month", Database],
  ["Cost monitoring", "$214 projected model spend", DollarSign],
  ["Error monitoring", "11 errors - all below incident threshold", ShieldAlert]
];

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Admin dashboard"
        description="Inspect user analytics, query logs, audit events, cost monitoring, error monitoring, and system health."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {panels.map(([title, text, Icon]) => (
          <Card key={title}>
            <CardContent className="p-6">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <CardContent className="p-6">
          <h3 className="font-semibold">Audit logs</h3>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            {["PHI redaction completed", "Trial index refreshed", "Cost guardrail triggered", "System health check passed"].map((log) => (
              <div key={log} className="rounded-md bg-muted p-3">{log}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
