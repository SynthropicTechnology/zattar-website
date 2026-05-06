/**
 * Security Headers Module
 *
 * Implementa headers HTTP de segurança para proteção contra:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MITM (Man-in-the-Middle)
 * - MIME-type sniffing
 * - Information disclosure
 * - Spectre / XS-Leaks (via COOP/CORP)
 *
 * Default fail-closed: a CSP entra em enforcement em qualquer ambiente que
 * não tenha `CSP_REPORT_ONLY=true` explicitamente. Para ativar a janela de
 * observação (report-only) em prod, setar essa env no Cloudron e remover
 * depois de validar reports.
 */

/**
 * CSP só é montada em prod (ou em dev com flag explícita).
 */
export const CSP_ENABLED =
  process.env.NODE_ENV !== "development" || process.env.ENABLE_CSP_IN_DEV === "true";

/**
 * Modo report-only para CSP. Default é false (enforcement) — fail-closed.
 * Setar `CSP_REPORT_ONLY=true` apenas durante janela de validação inicial.
 */
export const REPORT_ONLY_MODE = process.env.CSP_REPORT_ONLY === "true";

/**
 * URI para relatórios de violação CSP
 */
export const CSP_REPORT_URI = process.env.CSP_REPORT_URI || "/api/csp-report";

/**
 * Domínios confiáveis ativamente usados pelo site público.
 *
 * Quando um domínio sair do código, retire-o daqui também — cada entrada
 * extra na CSP aumenta a superfície de ataque.
 */
const TRUSTED_DOMAINS = {
  // Supabase — REST/realtime/auth
  supabase: ["https://*.supabase.co", "wss://*.supabase.co"],
  // Google Fonts (next/font carrega via inline + CSS)
  fonts: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
  // Chatwoot self-hosted — SDK em /packs/js/sdk.js + realtime via wss:.../cable
  chatwoot: ["https://chat.sinesys.app", "wss://chat.sinesys.app"],
  // Cloudflare Stream — vídeo do hero da home
  cloudflareStream: ["https://customer-lvnfk43x7eec1csc.cloudflarestream.com"],
  // Google Maps — iframe embed do mapa do escritório em /contato
  googleMaps: ["https://www.google.com", "https://maps.google.com"],
} as const;

/**
 * Assets públicos que não precisam de headers de segurança
 */
const PUBLIC_ASSETS = [
  "/robots.txt",
  "/favicon.ico",
  "/sitemap.xml",
] as const;

/**
 * Prefixos de assets públicos
 */
const PUBLIC_ASSET_PREFIXES = [
  "/android-chrome-",
  "/apple-touch-icon",
  "/_next/static/",
] as const;

/**
 * Verifica se deve aplicar headers de segurança para o pathname
 */
export function shouldApplySecurityHeaders(pathname: string): boolean {
  if (PUBLIC_ASSETS.includes(pathname as (typeof PUBLIC_ASSETS)[number])) {
    return false;
  }

  for (const prefix of PUBLIC_ASSET_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return false;
    }
  }

  return true;
}

/**
 * Constrói as diretivas CSP
 */
export function buildCSPDirectives(
  nonce?: string,
  reportOnly: boolean = REPORT_ONLY_MODE,
): string {
  const isProduction = process.env.NODE_ENV === "production";

  // script-src: nonce + strict-dynamic (sem unsafe-eval). Chatwoot SDK é
  // permitido como external host, mas o boot script usa nonce.
  const scriptSrc = nonce
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' ${TRUSTED_DOMAINS.chatwoot[0]}`
    : `'self' 'unsafe-inline' ${TRUSTED_DOMAINS.chatwoot[0]}`;

  const styleSrc = nonce
    ? `'self' 'nonce-${nonce}' ${TRUSTED_DOMAINS.fonts[0]} ${TRUSTED_DOMAINS.chatwoot[0]}`
    : `'self' 'unsafe-inline' ${TRUSTED_DOMAINS.fonts[0]} ${TRUSTED_DOMAINS.chatwoot[0]}`;

  // CSP3: separar <style> (elem) de style="..." (attr).
  // Widgets de terceiros (Chatwoot) injetam <style> sem nonce. Com nonce no
  // CSP3, 'unsafe-inline' é ignorado, causando violações inevitáveis.
  // Solução pragmática: 'unsafe-inline' apenas para style-src-elem (risco
  // baixo) e manter nonce no script-src (risco alto — XSS).
  const styleSrcElem = `'self' 'unsafe-inline' ${TRUSTED_DOMAINS.fonts[0]} ${TRUSTED_DOMAINS.chatwoot[0]}`;
  const styleSrcAttr = "'unsafe-inline'";

  const directives: Record<string, string> = {
    "default-src": "'self'",
    "script-src": scriptSrc,
    "style-src": styleSrc,
    "style-src-elem": styleSrcElem,
    "style-src-attr": styleSrcAttr,
    "font-src": `'self' ${TRUSTED_DOMAINS.fonts[1]} data: ${TRUSTED_DOMAINS.chatwoot[0]}`,
    "img-src": `'self' data: blob: ${TRUSTED_DOMAINS.supabase[0]} ${TRUSTED_DOMAINS.chatwoot[0]} ${TRUSTED_DOMAINS.cloudflareStream[0]}`,
    "connect-src": `'self' ${TRUSTED_DOMAINS.supabase.join(" ")} ${TRUSTED_DOMAINS.chatwoot.join(" ")}`,
    "frame-src": `'self' ${TRUSTED_DOMAINS.chatwoot[0]} ${TRUSTED_DOMAINS.cloudflareStream[0]} ${TRUSTED_DOMAINS.googleMaps.join(" ")}`,
    "media-src": `'self' blob: ${TRUSTED_DOMAINS.supabase[0]} ${TRUSTED_DOMAINS.cloudflareStream[0]}`,
    "worker-src": "'self' blob:",
    "object-src": "'none'",
    "base-uri": "'self'",
    "form-action": "'self'",
    "frame-ancestors": "'none'",
    "report-uri": CSP_REPORT_URI,
    "report-to": "csp-endpoint",
  };

  // upgrade-insecure-requests é ignorado em report-only (warning ruidoso no
  // console). Aplicar apenas em enforcement.
  if (isProduction && !reportOnly) {
    directives["upgrade-insecure-requests"] = "";
  }

  return Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join("; ");
}

/**
 * Constrói a Permissions-Policy
 * Desabilita recursos não utilizados para maior segurança
 */
export function buildPermissionsPolicy(): string {
  const policies: Record<string, string> = {
    geolocation: "()",
    camera: "()",
    microphone: "()",
    payment: "()",
    usb: "()",
    magnetometer: "()",
    gyroscope: "()",
    accelerometer: "()",
    autoplay: "(self)",
    "encrypted-media": "(self)",
    fullscreen: "(self)",
    "picture-in-picture": "(self)",
  };

  return Object.entries(policies)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
}

/**
 * Retorna o URI para relatórios CSP
 */
export function getCSPReportUri(): string {
  return CSP_REPORT_URI;
}

/**
 * Interface para os headers de segurança
 */
export interface SecurityHeaders {
  "Content-Security-Policy"?: string;
  "Content-Security-Policy-Report-Only"?: string;
  "Strict-Transport-Security": string;
  "X-Frame-Options": string;
  "X-Content-Type-Options": string;
  "Referrer-Policy": string;
  "Permissions-Policy": string;
  "X-DNS-Prefetch-Control": string;
  "Cross-Origin-Opener-Policy": string;
  "Cross-Origin-Resource-Policy": string;
  "Report-To"?: string;
}

/**
 * Constrói todos os headers de segurança
 */
export function buildSecurityHeaders(
  nonce?: string,
  reportOnly: boolean = REPORT_ONLY_MODE
): SecurityHeaders {
  const isProduction = process.env.NODE_ENV === "production";
  const cspDirectives = buildCSPDirectives(nonce, reportOnly);

  const headers: SecurityHeaders = {
    // HSTS — força HTTPS (apenas em produção)
    "Strict-Transport-Security": isProduction
      ? "max-age=31536000; includeSubDomains; preload"
      : "max-age=0",

    // Anti-clickjacking
    "X-Frame-Options": "DENY",

    // Anti-MIME-sniffing
    "X-Content-Type-Options": "nosniff",

    // Referer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions Policy
    "Permissions-Policy": buildPermissionsPolicy(),

    // DNS prefetch
    "X-DNS-Prefetch-Control": "on",

    // Cross-Origin Opener Policy — isola janela de outras origens (Spectre,
    // window.opener leaks). 'same-origin' é o nível mais seguro suportado
    // pelos navegadores; só quebra integrações que precisam de window.opener
    // cross-origin (não é nosso caso).
    "Cross-Origin-Opener-Policy": "same-origin",

    // Cross-Origin Resource Policy — controla quem pode embedar nossos
    // assets. 'same-site' permite subdomínios (*.zattaradvogados.com.br) sem
    // expor recursos a origens completamente externas.
    "Cross-Origin-Resource-Policy": "same-site",
  };

  if (CSP_ENABLED) {
    if (reportOnly) {
      headers["Content-Security-Policy-Report-Only"] = cspDirectives;
    } else {
      headers["Content-Security-Policy"] = cspDirectives;
    }
  }

  if (CSP_ENABLED && isProduction) {
    headers["Report-To"] = JSON.stringify({
      group: "csp-endpoint",
      max_age: 10886400,
      endpoints: [{ url: CSP_REPORT_URI }],
    });
  }

  return headers;
}

/**
 * Aplica headers de segurança em um objeto Headers
 */
export function applySecurityHeaders(
  headers: Headers,
  nonce?: string,
  reportOnly: boolean = REPORT_ONLY_MODE
): void {
  const securityHeaders = buildSecurityHeaders(nonce, reportOnly);

  for (const [key, value] of Object.entries(securityHeaders)) {
    if (value) {
      headers.set(key, value);
    }
  }

  if (nonce) {
    headers.set("x-nonce", nonce);
  }
}

/**
 * Gera um nonce criptograficamente seguro para CSP.
 * Falha alto (throw) em ambientes sem `crypto` em vez de cair em fallback
 * fraco — nonce previsível derrota a defesa contra XSS.
 */
export function generateNonce(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  throw new Error(
    "[security-headers] crypto API indisponível — não é seguro gerar nonce CSP em runtime sem CSPRNG.",
  );
}
