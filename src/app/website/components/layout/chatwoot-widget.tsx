"use client";

import { useEffect } from "react";

/**
 * Widget Chatwoot — config hardcoded. O websiteToken e baseUrl ficam
 * visíveis no DOM de qualquer site que usa Chatwoot (não são secrets),
 * então não há ganho de segurança em buscar via API. Pattern oficial:
 * setar window.chatwootSettings antes de carregar o SDK.
 */
const CHATWOOT_BASE_URL = "https://chat.sinesys.app";
const CHATWOOT_WEBSITE_TOKEN = "m6HpbV44F5e34uoRcy4HjodV";
const SCRIPT_ID = "chatwoot-sdk";

interface ChatwootSettings {
  position: "left" | "right";
  type: "standard" | "expanded_bubble";
  launcherTitle: string;
}

declare global {
  interface Window {
    chatwootSettings?: ChatwootSettings;
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: {
      reset: () => void;
    };
  }
}

export function ChatwootWidget() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    window.chatwootSettings = {
      position: "right",
      type: "standard",
      launcherTitle: "",
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `${CHATWOOT_BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: CHATWOOT_WEBSITE_TOKEN,
        baseUrl: CHATWOOT_BASE_URL,
      });
    };

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    return () => {
      window.$chatwoot?.reset();
      document.getElementById(SCRIPT_ID)?.remove();
    };
  }, []);

  return null;
}
