/**
 * <MarketingButton> — Wrapper sobre o <Button> shadcn que adiciona variantes
 * específicas de marketing (outline com hover primary tint, glass com blur).
 *
 * **Por que existe:** o `<Button>` em src/components/ui/button.tsx é
 * propriedade do shadcn CLI — ao rodar `npx shadcn@latest add button`, o
 * arquivo é sobrescrito, perdendo customizações inline. Variantes de marketing
 * vivem AQUI (fora de ui/) para sobreviver a updates do shadcn.
 *
 * **Como usar:**
 *   <MarketingButton variant="outline">Conheça</MarketingButton>
 *   <MarketingButton variant="glass">Saiba mais</MarketingButton>
 *
 * **Como adicionar nova variant:** estender VARIANT_CLASSES abaixo. Não tocar
 * em src/components/ui/button.tsx.
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MarketingVariant = "outline" | "glass";

type ButtonProps = React.ComponentProps<typeof Button>;

export interface MarketingButtonProps
  extends Omit<ButtonProps, "variant"> {
  variant?: MarketingVariant;
}

const VARIANT_CLASSES: Record<MarketingVariant, string> = {
  outline:
    "border-border bg-background text-foreground hover:bg-primary/5 hover:text-primary dark:bg-transparent dark:hover:bg-input/30",
  glass:
    "border-border/50 bg-background/60 text-foreground backdrop-blur-sm hover:bg-background/80 dark:bg-background/20",
};

export function MarketingButton({
  variant = "outline",
  className,
  ...props
}: MarketingButtonProps) {
  return (
    <Button
      variant="ghost"
      data-marketing-variant={variant}
      className={cn(VARIANT_CLASSES[variant], "border", className)}
      {...props}
    />
  );
}
