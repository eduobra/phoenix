import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ traceId: string }> }) {
  try {
    const { traceId } = await params;

    if (!traceId) {
      return NextResponse.json({ error: "Missing traceId" }, { status: 400 });
    }

    const fetchdata = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_FOR_CUSTOMER_URL}/api/v1/trace/${traceId}`);
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
