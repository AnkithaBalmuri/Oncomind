"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-md">
        <CardContent className="p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-2xl font-semibold">Something needs attention</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The workspace hit an unexpected state. Retry the view or check the console when integrating a backend.
          </p>
          <Button className="mt-6" onClick={reset}>Retry</Button>
        </CardContent>
      </Card>
    </main>
  );
}
