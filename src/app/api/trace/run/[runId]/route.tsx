import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await params;

    if (!runId) {
      return NextResponse.json({ error: "Missing runId" }, { status: 400 });
    }

    const fetchdata = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FOR_CUSTOMER_URL}/api/v1/trace/run/${runId}`);
    if (!fetchdata.ok) {
      return NextResponse.json({ error: "error" }, { status: 400 });
    }
    const data = await fetchdata.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching trace:", error);
    return NextResponse.json({ error: "Failed to fetch trace" }, { status: 500 });
  }
}
