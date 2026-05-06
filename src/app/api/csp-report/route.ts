import { NextResponse, type NextRequest } from "next/server";

import { getRedisClient } from "@/lib/redis/client";
import { getClientIp } from "@/lib/utils/get-client-ip";

const MAX_BODY_BYTES = 16_384; // 16 KiB
const RATE_LIMIT_WINDOW_SEC = 60;
const RATE_LIMIT_MAX_REPORTS = 60; // por IP por janela

/**
 * Rate-limit fail-open: se Redis estiver indisponível, libera para evitar
 * perder reports legítimos durante incidente de infra. Limita a 60 req/min
 * por IP — suficiente para uma página com várias violações sem virar vetor
 * de log flooding.
 */
async function shouldAcceptReport(ip: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis) return true;

  const key = `csp-report:ratelimit:${ip}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW_SEC);
    }
    return count <= RATE_LIMIT_MAX_REPORTS;
  } catch {
    return true;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request);

  if (!(await shouldAcceptReport(ip))) {
    return new NextResponse(null, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (
      contentType.includes("application/json") ||
      contentType.includes("application/csp-report") ||
      contentType.includes("application/reports+json")
    ) {
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) {
        return new NextResponse(null, { status: 413 });
      }

      const body = JSON.parse(text) as unknown;
      const report = extractReport(body);
      if (report) {
        console.warn("[CSP Violation]", JSON.stringify(report).slice(0, 2_000));
      }
    }
  } catch {
    // ignora erros de parse — endpoint é best-effort
  }

  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: { "Cache-Control": "no-store" },
  });
}

function extractReport(body: unknown): unknown {
  if (typeof body !== "object" || body === null) return null;
  if (Array.isArray(body)) return body[0] ?? null;

  const record = body as Record<string, unknown>;
  return record["csp-report"] ?? record.body ?? null;
}
