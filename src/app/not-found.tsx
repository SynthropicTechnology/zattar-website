import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Heading, Text } from '@/components/typography';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex animate-in flex-col items-center gap-4 text-center zoom-in-95 fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <Heading level="marketing-section" as="h1">
            Página Não Encontrada
          </Heading>
          <Text variant="marketing-lead" className="max-w-md text-muted-foreground">
            A página que você está procurando não existe ou foi movida. Verifique o endereço ou volte para o início.
          </Text>
        </div>
        <Button asChild>
          <Link href="/">Voltar para o Início</Link>
        </Button>
      </div>
    </div>
  );
}
