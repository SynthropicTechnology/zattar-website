/**
 * <Section> — primitivo de layout que aplica padding-block (vertical)
 * a partir de tokens semânticos do design system (globals.css §15).
 *
 * Use em vez de hardcodar `py-* sm:py-* md:py-*` em páginas.
 *
 * Spacings:
 *   - "default" (default): 56/80/96px — seção padrão de landing
 *   - "compact":           40/56/64px — CTAs, banners curtos, faixas
 *   - "none":              0 — para casos onde o spacing vem do conteúdo
 *
 * Não aplica max-width nem padding-inline — combine com <Container>.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export type SectionSpacing = "default" | "compact" | "none";

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  /** Override do elemento HTML (default: section). Útil para <header>, <footer>, <aside>. */
  as?: "section" | "header" | "footer" | "aside" | "div";
}

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  default:
    "py-[var(--section-py-mobile)] md:py-[var(--section-py-tablet)] lg:py-[var(--section-py-desktop)]",
  compact:
    "py-[var(--section-py-compact-mobile)] md:py-[var(--section-py-compact-tablet)] lg:py-[var(--section-py-compact-desktop)]",
  none: "",
};

export function Section({
  spacing = "default",
  as: Tag = "section",
  className,
  ...props
}: SectionProps) {
  return (
    <Tag
      data-section={spacing}
      className={cn(SPACING_CLASSES[spacing], className)}
      {...props}
    />
  );
}
