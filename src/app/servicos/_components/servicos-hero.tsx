import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/typography";

interface ServicosHeroProps {
  /** Eyebrow opcional acima do título. Mantido como prop para compat,
   *  mas não passado nas páginas (decisão de design: hero sem kicker). */
  eyebrow?: string;
  title: string;
  titleHighlight: string;
  description: string;
  /** Optional back-link above the title. */
  backHref?: string;
  backLabel?: string;
  className?: string;
}

/**
 * Editorial hero shared across /servicos pages.
 * Mirrors the website visual language: kicker + display title with gradient
 * highlight + description + ambient radial glow. Meant to sit at the top of
 * every services page for a coherent rhythm with the rest of the site.
 */
export function ServicosHero({
  eyebrow,
  title,
  titleHighlight,
  description,
  backHref,
  backLabel,
  className,
}: ServicosHeroProps) {
  return (
    <section
      className={cn(
        "relative mb-16 sm:mb-20 overflow-hidden",
        className
      )}
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-md h-112 bg-[radial-gradient(circle_at_center,rgb(var(--color-primary)/0.08)_0%,transparent_70%)] pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-headline text-sm tracking-tight mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {backLabel ?? "Voltar"}
          </Link>
        )}

        {eyebrow && (
          <Text variant="marketing-overline" className="inline-block mb-4">
            {eyebrow}
          </Text>
        )}

        <Heading level="marketing-hero" className="mb-6">
          {title}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dim">
            {titleHighlight}
          </span>
        </Heading>

        <Text variant="marketing-lead" className="max-w-2xl">
          {description}
        </Text>
      </div>
    </section>
  );
}
