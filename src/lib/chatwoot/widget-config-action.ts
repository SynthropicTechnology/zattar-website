"use server";

import { createServiceClient } from "@/lib/supabase/service-client";

export interface WidgetConfig {
  websiteToken: string;
  baseUrl: string;
}

/**
 * Hosts permitidos para o widget Chatwoot. Bate com TRUSTED_DOMAINS.chatwoot
 * em src/middleware/security-headers.ts — manter ambos sincronizados. Se o
 * banco devolver outro host, ignoramos a config (defesa contra dado errado).
 */
const ALLOWED_CHATWOOT_HOSTS = new Set(["chat.sinesys.app"]);

export async function actionObterChatwootWidgetConfig(): Promise<WidgetConfig | null> {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("integracoes")
      .select("configuracao")
      .eq("tipo", "chatwoot")
      .eq("ativo", true)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    const config = data.configuracao as Record<string, unknown>;
    const websiteToken = config.website_token as string | undefined;
    const widgetBaseUrl = config.widget_base_url as string | undefined;

    if (!websiteToken || !widgetBaseUrl) return null;

    const baseUrl = widgetBaseUrl.replace(/\/$/, "");

    let host: string;
    try {
      host = new URL(baseUrl).hostname;
    } catch {
      console.warn(
        `[chatwoot] widget_base_url inválida na tabela integracoes: ${baseUrl}`,
      );
      return null;
    }

    if (!ALLOWED_CHATWOOT_HOSTS.has(host)) {
      console.warn(
        `[chatwoot] host ${host} não permitido. Hosts válidos: ${[...ALLOWED_CHATWOOT_HOSTS].join(", ")}. Atualize a tabela integracoes.`,
      );
      return null;
    }

    return { websiteToken, baseUrl };
  } catch {
    return null;
  }
}
