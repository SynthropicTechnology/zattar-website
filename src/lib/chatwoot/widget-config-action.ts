"use server";

export interface WidgetConfig {
  websiteToken: string;
  baseUrl: string;
}

export async function actionObterChatwootWidgetConfig(): Promise<WidgetConfig | null> {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    return {
      websiteToken,
      baseUrl: (widgetBaseUrl as string).replace(/\/$/, ""),
    };
  } catch {
    return null;
  }
}
