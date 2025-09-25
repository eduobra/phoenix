import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { axiosInstaceBackend } from "@/lib/axiosInstanct";

export async function POST(req: Request) {
  try {
    // ✅ Always validate required headers (avoid undefined errors)
    const authHeader = req.headers.get("authorization") || "";
    const xApiKey = req.headers.get("x-api-key") || "";

    // ✅ Safely parse body
    const payload = await req.json();

    // ✅ Ensure absolute URL for serverless environment (Vercel needs this if using backend API)
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
