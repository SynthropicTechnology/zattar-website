import { WebsiteShell } from "@/app/website/components/layout/website-shell";
import { MarketingCard } from "@/app/website/components/shared/marketing-card";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { buildWebsiteMetadata } from "../../_metadata/build-metadata";

export const metadata = buildWebsiteMetadata({
  title: "Tendências",
  description:
    "Análises de tendências no Direito do Trabalho: automação, precedentes, métricas do judiciário e comportamento do contencioso.",
  path: "/insights/tendencias",
});

export default function InsightsTendenciasPage() {
  return (
    <WebsiteShell hideClosingCta>
      <div className="pt-32 pb-24 container">
        {/* Hero Featured Section */}
        <section className="relative mb-24 rounded-[2.5rem] overflow-hidden group shadow-2xl">
          <div className="aspect-16/7 md:aspect-21/9 w-full bg-surface-container overflow-hidden relative">
            <Image
              alt="Tribunal futurista com interfaces holográficas"
              src="/website/insights/tendencias/hero.webp"
              fill
              priority
              sizes="(max-width: 1408px) 100vw, 1408px"
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-luminosity hover:mix-blend-normal"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/60 to-transparent flex flex-col justify-end p-8 md:p-16">
            <span className="text-marketing-overline text-primary mb-4 flex items-center gap-2 drop-shadow-md">
              <span className="w-8 h-px bg-primary shadow-[0_0_10px_rgb(var(--color-primary)/0.8)]"></span>
              Artigo em Destaque
            </span>
            <div className="max-w-3xl">
              <Heading level="marketing-hero" className="mb-6 drop-shadow-lg">
                A Ascensão da IA Generativa na <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dim drop-shadow-[0_0_15px_rgb(var(--color-primary)/0.4)]">
                  Análise Jurisprudencial
                </span>
              </Heading>
              <Text variant="marketing-lead" className="mb-8 max-w-2xl drop-shadow-md">
                Como algoritmos de processamento de linguagem natural estão transformando décadas de precedentes em insights estratégicos instantâneos para grandes firmas.
              </Text>
              <a href="#artigos" className="group/btn flex items-center gap-4 text-primary font-bold hover:gap-6 transition-all duration-300">
                LER ARTIGO COMPLETO
                <span className="bg-primary/10 p-2 rounded-full group-hover/btn:bg-primary/20 border border-primary/20 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
          <div className="flex gap-3 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide">
            <Link href="/insights" className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-sm whitespace-nowrap border border-foreground/5 hover:bg-foreground/10">
              Todos
            </Link>
            <button className="px-6 py-2.5 rounded-full bg-primary text-on-primary-fixed font-bold text-sm whitespace-nowrap shadow-[0_0_15px_rgb(var(--color-primary)/0.3)]">
              Tendências
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-sm whitespace-nowrap border border-foreground/5 hover:bg-foreground/10">
              Estudos de Caso
            </button>
            <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors font-semibold text-sm whitespace-nowrap border border-foreground/5 hover:bg-foreground/10">
              Notícias
            </button>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors w-5 h-5" />
            <input
              className="w-full bg-surface-container-high border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none shadow-inner"
              placeholder="Pesquisar insights..."
              type="text"
            />
          </div>
        </div>

        {/* Bento Grid Articles */}
        <div id="artigos" className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Big Card 1 */}
          <MarketingCard
            variant="solid"
            padding="sm"
            className="md:col-span-8 group overflow-hidden hover:border-primary/30 flex flex-col md:flex-row h-full p-0!"
          >
            <div className="md:w-1/2 overflow-hidden bg-surface-container-highest relative min-h-64">
              <Image
                alt="Direito Digital"
                src="/website/insights/tendencias/chart.webp"
                fill
                sizes="(max-width: 768px) 100vw, 470px"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity hover:mix-blend-normal"
              />
            </div>
            <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-wider">Direito Digital</span>
                <Heading level="marketing-title" as="h3" className="mb-4 group-hover:text-primary transition-colors">
                  Privacidade de Dados em Ambientes de Metaverso Corporativo
                </Heading>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">
                  Analisamos os novos desafios jurídicos impostos pela LGPD em ambientes virtuais de trabalho e a responsabilidade civil no processamento de dados biométricos.
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest font-bold">5 min de leitura</span>
                <Link href="/contato" className="text-primary text-sm font-bold flex items-center gap-2 group/btn">
                  Ler Mais <ArrowRight className="group-hover/btn:translate-x-1 transition-transform w-4 h-4" />
                </Link>
              </div>
            </div>
          </MarketingCard>

          {/* Small Card 1 */}
          <MarketingCard
            variant="solid"
            padding="lg"
            className="md:col-span-4 group hover:border-primary/30 flex flex-col justify-between"
          >
            <div>
              <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-wider">IA Jurídica</span>
              <Heading level="card" as="h3" className="mb-4 group-hover:text-primary transition-colors">
                O Impacto do GPT-4 na Redação de Petições Iniciais
              </Heading>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Um estudo comparativo minucioso sobre a eficácia de minutas geradas por IA vs. profissionais seniores.
              </p>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest font-bold">3 min de leitura</span>
              <Link href="/contato" className="text-primary text-sm font-bold flex items-center gap-2 group/btn">
                Ler Mais <ArrowRight className="group-hover/btn:translate-x-1 transition-transform w-4 h-4" />
              </Link>
            </div>
          </MarketingCard>

          {/* Small Card 2 */}
          <MarketingCard
            variant="solid"
            padding="lg"
            className="md:col-span-4 group hover:border-primary/30 flex flex-col justify-between"
          >
            <div>
              <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-wider">Trabalhista</span>
              <Heading level="card" as="h3" className="mb-4 group-hover:text-primary transition-colors">
                Novas Decisões sobre o Vínculo Empregatício em Apps
              </Heading>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                O cenário atual do STF e as profundas implicações para a economia sob demanda (gig economy) no Brasil.
              </p>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest font-bold">8 min de leitura</span>
              <Link href="/contato" className="text-primary text-sm font-bold flex items-center gap-2 group/btn">
                Ler Mais <ArrowRight className="group-hover/btn:translate-x-1 transition-transform w-4 h-4" />
              </Link>
            </div>
          </MarketingCard>

          {/* Big Card 2 */}
          <MarketingCard
            variant="solid"
            padding="sm"
            className="md:col-span-8 group overflow-hidden hover:border-primary/30 flex flex-col md:flex-row h-full p-0!"
          >
            <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-between order-2 md:order-1">
              <div>
                <span className="bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-wider">Case Study</span>
                <Heading level="marketing-title" as="h3" className="mb-4 group-hover:text-primary transition-colors">
                  Como a Zattar Engine Reduziu Custos Jurídicos em 40%
                </Heading>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 line-clamp-3">
                  Acompanhe a implementação passo a passo de sistemas de triagem automatizada de processos em uma das maiores empresas de tecnologia corporativa da América Latina.
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest font-bold">12 min de leitura</span>
                <Link href="/contato" className="text-primary text-sm font-bold flex items-center gap-2 group/btn">
                  Ler Mais <ArrowRight className="group-hover/btn:translate-x-1 transition-transform w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 overflow-hidden bg-surface-container-high relative order-1 md:order-2 min-h-64">
              <Image
                alt="Ambiente corporativo de tecnologia minimalista"
                src="/website/insights/tendencias/trend.webp"
                fill
                sizes="(max-width: 768px) 100vw, 470px"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity hover:mix-blend-normal"
              />
            </div>
          </MarketingCard>
        </div>

        {/* Newsletter Section */}
        <section className="mt-32 bg-linear-to-br from-surface-container-high to-surface-container p-12 md:p-16 rounded-[2.5rem] border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-dim/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="max-w-xl relative z-10">
            <Heading level="marketing-section" className="mb-6">
              Assine nossa <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dim">Curadoria Jurídica</span>
            </Heading>
            <Text variant="marketing-lead">
              Receba quinzenalmente as análises mais profundas sobre tecnologia, leis trabalhistas materiais e o futuro da jurisprudência digital diretamente no seu e-mail.
            </Text>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto relative z-10">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                className="bg-surface border border-outline-variant/20 focus:border-primary/50 text-on-surface rounded-xl px-6 py-5 focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant/60 w-full sm:w-72 outline-none transition-all shadow-inner"
                placeholder="seu@email.com"
                type="email"
              />
              <Button asChild size="2xl" className="font-headline shadow-lg shadow-primary/20">
                <a href="mailto:contato@zattaradvogados.com?subject=Assinar Curadoria Jur%C3%ADdica">
                  Assinar Agora
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </WebsiteShell>
  );
}
