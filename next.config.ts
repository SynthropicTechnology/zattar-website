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
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toolbar",
      "@radix-ui/react-tooltip",
    ],
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
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.zattaradvogados.com.br" },
      { protocol: "http", hostname: "localhost", port: "1337" },
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
