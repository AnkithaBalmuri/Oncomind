"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthForm({
  title,
  description,
  action,
  footer
}: {
  title: string;
  description: string;
  action: string;
  footer: React.ReactNode;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const isReset = action === "Send reset link";

  function handleSubmit() {
    if (!email.trim()) {
      setStatus("Please enter your email first.");
      return;
    }

    if (isReset) {
      setStatus("Reset link sent in demo mode. Connect Clerk to send real emails.");
      return;
    }

    setStatus(`${action} successful in demo mode. Opening your RAG workspace...`);
    window.localStorage.setItem("oncomind-demo-user", email);
    window.setTimeout(() => router.push("/dashboard"), 650);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-10">
      <Card className="w-full max-w-md overflow-hidden border-sky-100 bg-white/90 shadow-soft">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-md bg-primary text-base font-semibold text-primary-foreground">OM</div>
            <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <p className="mt-2 text-xs font-semibold uppercase text-primary">Cancer RAG AI workspace</p>
          </div>
          <form className="space-y-4">
            <label className="block text-sm font-medium text-slate-900">
              Email
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" type="email" placeholder="clinician@hospital.org" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
            </label>
            {action !== "Send reset link" ? (
              <label className="block text-sm font-medium text-slate-900">
                Password
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" type="password" placeholder="password" />
                </div>
              </label>
            ) : null}
            {status ? (
              <div className="flex gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {status}
              </div>
            ) : null}
            <Button className="w-full" size="lg" type="button" onClick={handleSubmit}>{action}</Button>
          </form>
          <div className="mt-6 grid gap-2 rounded-lg border bg-sky-50 p-4 text-sm text-muted-foreground">
            <p>Demo creates a local session and opens the dashboard.</p>
            <p>For real accounts, connect Clerk authentication.</p>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </CardContent>
      </Card>
    </main>
  );
}
