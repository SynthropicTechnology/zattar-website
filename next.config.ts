import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["ioredis"],
  transpilePackages: ["remark-gfm"],
  experimental: {
    cpus: 2,
    serverActions: {
      bodySizeLimit: "10mb",
      allowedOrigins: [
        "http://localhost:3000",
        "https://zattaradvogados.com",
        "https://zattaradvogados.com.br",
      ],
    },
    // Apenas pacotes efetivamente importados pelo bundle. Radix-UI agregada
    // (`from "radix-ui"`) já é tree-shaken pelo Next sem listar aqui.
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dialog"],
  },
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname, "src"),
    },
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === "true",
  },
  logging: {
    browserToTerminal: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Subdomínios do Zattar (CDN, future cms.* etc.)
      { protocol: "https", hostname: "*.zattaradvogados.com.br" },
      // CMS Strapi de produção (URL definida em cloudron/deploy.sh)
      { protocol: "https", hostname: "strapi.sinesys.online" },
      // Strapi local em dev. Em prod o Next ignora padrões http://localhost,
      // mas explicitar via NODE_ENV deixa a intenção visível.
      ...(process.env.NODE_ENV !== "production"
        ? ([{ protocol: "http", hostname: "localhost", port: "1337" }] as const)
        : []),
    ],
  },
  async rewrites() {
    return [
      { source: "/expertise",               destination: "/website/expertise" },
      { source: "/solucoes",                destination: "/website/solucoes" },
      { source: "/contato",                 destination: "/website/contato" },
      { source: "/faq",                     destination: "/website/faq" },
      { source: "/insights",                destination: "/website/insights" },
      { source: "/insights/tendencias",     destination: "/website/insights/tendencias" },
      { source: "/insights/:slug",          destination: "/website/insights/:slug" },
      { source: "/politica-de-privacidade", destination: "/website/politica-de-privacidade" },
      { source: "/termos-de-uso",           destination: "/website/termos-de-uso" },
    ];
  },
};

export default nextConfig;
