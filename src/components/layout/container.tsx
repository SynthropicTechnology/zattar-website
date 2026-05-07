/**
 * <Container> — primitivo de layout que aplica max-width + padding lateral
 * a partir de tokens semânticos do design system (globals.css §15).
 *
 * Use SEMPRE este componente em vez de hardcodar `max-w-* mx-auto px-*` em
 * páginas. Garante coerência arquitetural: design system muda em um lugar
 * (tokens em @theme) e propaga universalmente.
 *
 * Sizes:
 *   - "content" (default): 1152px — landing institucional
 *   - "narrow":            1024px — leitura longa (artigos, prosa)
 *   - "wide":              1280px — dashboards, listagens densas
 *
 * O padding-inline é responsivo (24/32/48px) e independente do size.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export type ContainerSize = "content" | "narrow" | "wide";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  size?: ContainerSize;
  /** Override do elemento HTML (default: div). Use "section", "header", "aside"
   *  para preservar semântica ao substituir uma <section>/<header> existente. */
  as?: "div" | "section" | "header" | "footer" | "aside" | "main";
}

const SIZE_CLASSES: Record<ContainerSize, string> = {
  content: "max-w-[var(--container-max)]",
  narrow: "max-w-[var(--container-narrow)]",
  wide: "max-w-[var(--container-wide)]",
};

export function Container({
  size = "content",
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      data-container={size}
      className={cn(
        "mx-auto w-full",
        "px-[var(--container-px-mobile)] md:px-[var(--container-px-tablet)] lg:px-[var(--container-px-desktop)]",
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
