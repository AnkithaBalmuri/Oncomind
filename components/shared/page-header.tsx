import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 max-w-3xl">
      {eyebrow ? <Badge className="mb-3 border-primary/20 bg-primary/10 text-primary">{eyebrow}</Badge> : null}
      <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}
