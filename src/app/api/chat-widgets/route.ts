import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { axiosInstanceBackendForCustomer } from "@/lib/axiosInstanct";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const backendRes = await axiosInstanceBackendForCustomer.post(`/api/v1/ask/about`, payload, {
      responseType: "stream", // ensures backend response is stream
    });

    const readable = new ReadableStream({
      start(controller) {
        backendRes.data.on("data", (chunk: Buffer) => {
          controller.enqueue(chunk);
        });

        backendRes.data.on("end", () => {
          controller.close();
        });

        backendRes.data.on("error", (err: Error) => {
          controller.error(err);
        });
      },
    });

    return new Response(readable, {
      status: backendRes.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        // optional: allow frontend fetch streaming
        "Transfer-Encoding": "chunked",
      },
    });
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
