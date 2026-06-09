import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">This OncoMind workspace route does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
