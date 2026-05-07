import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/ui/typography";

interface EditorialHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  gradient?: boolean;
  titleClassName?: string;
  className?: string;
}

/**
 * Editorial section header — kicker + title + optional description + action buttons.
 * Consome design tokens via <Heading level="marketing-section"> e <Text>.
 *
 * `gradient` aplica o text-gradient signature ao título.
 */
export function EditorialHeader({
  kicker,
  title,
  description,
  actions,
  gradient,
  titleClassName,
  className,
}: EditorialHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6",
        className
      )}
    >
      <div className="max-w-2xl">
        <Text variant="marketing-overline" className="block mb-2">
          {kicker}
        </Text>
        <Heading
          level="marketing-section"
          className={cn(gradient && "text-gradient", titleClassName)}
        >
          {title}
        </Heading>
        {description && (
          <Text variant="marketing-lead" className="mt-4 max-w-lg">
            {description}
          </Text>
        )}
      </div>
      {actions && <div className="flex gap-4 shrink-0">{actions}</div>}
    </div>
  );
}
