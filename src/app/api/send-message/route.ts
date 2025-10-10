import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { axiosInstaceBackend } from "@/lib/axiosInstanct";

export const runtime = "nodejs"; // ✅ use Node runtime, not Edge, so we can access streams

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const xApiKey = req.headers.get("x-api-key") || "";

  const payload = await req.json();

  // ✅ Handle streaming request
  if (payload.stream) {
    try {
      const response = await axiosInstaceBackend.post(`/api/chat`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
          ...(xApiKey && { "x-api-key": xApiKey }),
        },
        responseType: "stream",
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          response.data.on("data", (chunk: Buffer) => {
            controller.enqueue(encoder.encode(chunk.toString()));
          });

          response.data.on("end", () => controller.close());
          response.data.on("error", (err: Error) => controller.error(err));
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "Transfer-Encoding": "chunked",
        },
      });
    } catch (error) {
      console.error("Streaming error:", error);
      return NextResponse.json({ error: "Failed to stream response" }, { status: 500 });
    }
  }

  // ✅ Normal request fallback
  try {
    const res = await axiosInstaceBackend.post(`/api/chat`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...(xApiKey && { "x-api-key": xApiKey }),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    let message = "Internal server error";
    let status = 500;

    if (axios.isAxiosError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as AxiosError<any>;
      status = axiosError.response?.status || 500;
      message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Request failed with Axios error";
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
