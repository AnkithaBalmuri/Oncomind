"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryDistribution, usageTrend } from "@/lib/mock-data";

const colors = ["#2563eb", "#4f46e5", "#10b981", "#06b6d4", "#f59e0b"];

export function UsageTrendChart() {
  return (
    <Card className="border-sky-200 bg-sky-50/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-extrabold text-slate-950">Usage Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={usageTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QueryDistributionChart() {
  return (
    <Card className="border-indigo-200 bg-indigo-50/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-extrabold text-slate-950">Query Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={queryDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
              {queryDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ConfidenceAnalyticsChart() {
  return (
    <Card className="border-emerald-200 bg-emerald-50/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-extrabold text-slate-950">Confidence Analytics</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={usageTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
            <XAxis dataKey="name" />
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function EvaluationTrendChart() {
  return (
    <Card className="border-violet-200 bg-violet-50/90 shadow-sm">
      <CardHeader>
        <CardTitle className="font-extrabold text-slate-950">Latency and Cost Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usageTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cost" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
