/**
 * Server Action: Submissão de lead do formulário público.
 * ============================================================================
 * Wrapper em publicFormAction (compatível com useActionState do React 19) que
 * chama o service submitLead. Captura IP e user-agent via headers do Next.
 *
 * Consumido por: src/app/website/contato/_components/contact-form.tsx
 * ============================================================================
 */

'use server';

import { headers } from 'next/headers';

import { publicFormAction } from '@/lib/safe-action';
import { getClientIpFromHeaders } from '@/lib/utils/get-client-ip';

import { PublicLeadInputSchema } from '../domain';
import { submitLead } from '../service';

async function extractMetadata() {
  const h = await headers();
  const ip = getClientIpFromHeaders(h);
  const userAgent = h.get('user-agent') ?? null;

  return { ip: ip === 'unknown' ? null : ip, userAgent };
}

export const submitLeadAction = publicFormAction(
  PublicLeadInputSchema,
  async (input) => {
    const metadata = await extractMetadata();
    const result = await submitLead(input, metadata);

    if (result.kind === 'honeypot') {
      // Resposta de sucesso fake pra bot não saber que foi detectado
      return { success: true as const };
    }

    return { success: true as const, leadId: result.lead.id };
  },
);
