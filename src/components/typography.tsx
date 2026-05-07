import * as React from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// DESIGN SYSTEM: Typed Typography Components
// Padrão canônico do projeto — seguindo a filosofia shadcn/ui de tokens inline.
// =============================================================================

// font-weight é incluído como utility class (ganha cascade sobre @apply em
// @layer components — Tailwind preflight reseta h1-h6 weight para inherit, e
// o reset h1-h6 customizado em globals.css §base só aplica font-heading,
// deixando weight herdar de body=400. Forçar via utility resolve definitivamente.
const HEADING_LEVELS = {
  page: { className: 'text-page-title font-bold', tag: 'h1' as const },
  section: { className: 'text-section-title font-semibold', tag: 'h2' as const },
  card: { className: 'text-card-title font-semibold tracking-[-0.01em]', tag: 'h3' as const },
  subsection: { className: 'text-subsection-title font-semibold tracking-[-0.005em]', tag: 'h4' as const },
  widget: { className: 'text-widget-title font-semibold', tag: 'h3' as const },
  // Display — hero, empty states dramáticos (spec Glass Briefing)
  'display-1': { className: 'text-display-1 font-bold', tag: 'h1' as const },
  'display-2': { className: 'text-display-2 font-bold', tag: 'h1' as const },
  // Marketing — apenas src/app/website/*
  // marketing-hero: H1 de páginas utilitárias/categoria (48px max)
  // marketing-hero-display: H1 da Home / landings-manifesto (68px max)
  // Critério: declaração curta com presença máxima → display; categoria/utilidade → hero
  'marketing-hero': { className: 'text-marketing-hero font-extrabold', tag: 'h1' as const },
  'marketing-hero-display': { className: 'text-marketing-hero-display font-extrabold', tag: 'h1' as const },
  'marketing-section': { className: 'text-marketing-section font-bold', tag: 'h2' as const },
  'marketing-title': { className: 'text-marketing-title font-bold', tag: 'h3' as const },
} as const;

type HeadingLevel = keyof typeof HEADING_LEVELS;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

function Heading({ level, as: asTag, className: userClassName, children, ...props }: HeadingProps) {
  const config = HEADING_LEVELS[level];
  const Tag = asTag ?? config.tag;
  return (
    <Tag className={cn(config.className, userClassName)} {...props}>
      {children}
    </Tag>
  );
}
Heading.displayName = 'Heading';

const TEXT_VARIANTS = {
  'kpi-value': { className: 'text-kpi-value', tag: 'span' as const },
  label: { className: 'text-label', tag: 'span' as const },
  caption: { className: 'text-caption', tag: 'p' as const },
  'widget-sub': { className: 'text-widget-sub', tag: 'p' as const },
  'meta-label': { className: 'text-meta-label', tag: 'span' as const },
  'micro-caption': { className: 'text-micro-caption', tag: 'span' as const },
  'micro-badge': { className: 'text-micro-badge', tag: 'span' as const },
  overline: { className: 'text-overline', tag: 'span' as const },
  body: { className: 'text-body', tag: 'p' as const },
  'body-lg': { className: 'text-body-lg', tag: 'p' as const },
  'body-sm': { className: 'text-body-sm', tag: 'p' as const },
  // description: 14px (Tailwind text-sm) — descrições curtas em footers,
  // sub-blocos. Diferente de caption (13px metadata) e body-sm (16px texto longo).
  description: { className: 'text-sm leading-[1.5]', tag: 'p' as const },
  helper: { className: 'text-helper', tag: 'span' as const },
  // Marketing — apenas src/app/website/*
  'marketing-lead': { className: 'text-marketing-lead', tag: 'p' as const },
  'marketing-overline': { className: 'text-marketing-overline', tag: 'span' as const },
} as const;

type TextVariant = keyof typeof TEXT_VARIANTS;

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  as?: React.ElementType;
  children: React.ReactNode;
}

function Text({ variant, as: asTag, className: userClassName, children, ...props }: TextProps) {
  const config = TEXT_VARIANTS[variant];
  const Tag = asTag ?? config.tag;
  return (
    <Tag className={cn(config.className, userClassName)} {...props}>
      {children}
    </Tag>
  );
}
Text.displayName = 'Text';

export { Heading, Text };
export type { HeadingLevel, TextVariant, HeadingProps, TextProps };
export { HEADING_LEVELS, TEXT_VARIANTS };
