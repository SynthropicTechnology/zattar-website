import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json") || contentType.includes("application/csp-report")) {
      const body = await request.json();
      const report = body["csp-report"] ?? (Array.isArray(body) ? body[0]?.body : body.body);
      if (report) {
        console.warn("[CSP Violation]", JSON.stringify(report));
      }
    }
  } catch {
    // ignora erros de parse
  }
  return new NextResponse(null, { status: 204 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
