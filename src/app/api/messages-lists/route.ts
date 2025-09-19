import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")!;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/conversations/sessions/${sessionId}/messages`,
      {
        method: "GET", // or POST depending on your backend
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        credentials: "include",
      }
    );
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Azure OpenAI API Error:", error);

    // Safely handle the error type
    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
