import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { axiosInstaceBackend } from "@/lib/axiosInstanct";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") || "";

  const payload = await req.json();

  // ✅ ALWAYS normal request — streaming removed
  try {
    const res = await axiosInstaceBackend.post(`/telemetry/query`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
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
