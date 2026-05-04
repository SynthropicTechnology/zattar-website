"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
  nonce?: string;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-right" richColors closeButton theme="system" className="font-sans" />
    </ThemeProvider>
  );
}
