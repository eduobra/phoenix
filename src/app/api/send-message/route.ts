import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ Kunin ang Authorization header
    const authHeader = req.headers.get("authorization");

    // ✅ Kunin ang x-api-key header
    const xApiKey = req.headers.get("x-api-key");

    // ✅ Kunin ang payload (request body)
    const payload = await req.json();

    // ✅ Kunin ang query param (optional)
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    // ✅ Forward request sa backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/chat?conversationId=${conversationId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(xApiKey ? { "x-api-key": xApiKey } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Azure OpenAI API Error:", error);

    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
