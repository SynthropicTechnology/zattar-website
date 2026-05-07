import type { Metadata } from "next";
import { WebsiteShell } from "@/app/website/components/layout/website-shell";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Serviços Trabalhistas | Zattar Advogados",
  description:
    "Calculadoras, geradores de documentos e diagnósticos trabalhistas gratuitos, atualizados com a legislação 2026.",
};

export default function ServicosPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WebsiteShell>
      {/* pt-32 compensa a navbar flutuante do WebsiteShell (fixed top-4).
          pb consome o token semântico de section para coerência cross-page. */}
      <div className="pt-32 pb-[var(--section-py-desktop)]">
        <Container>{children}</Container>
      </div>
    </WebsiteShell>
  );
}
