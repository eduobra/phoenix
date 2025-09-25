import { NextResponse } from "next/server";
import { axiosInstaceBackend } from "@/lib/axiosInstanct";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const xApiKey = req.headers.get("x-api-key");
    const payload = await req.json();

    const res = await axiosInstaceBackend.post(`/api/chat`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        "x-api-key": xApiKey,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    let message = "Internal server error";

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message || "Request failed with Axios error";
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
