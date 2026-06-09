import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
    </main>
  );
}
