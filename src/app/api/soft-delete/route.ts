import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { axiosInstaceBackend } from "@/lib/axiosInstanct";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const xApiKey = req.headers.get("x-api-key") || "";

  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // ✅ call backend delete endpoint
    const res = await axiosInstaceBackend.delete(
      `/conversations/sessions/${session_id}/delete`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
          ...(xApiKey && { "x-api-key": xApiKey }),
        },
      }
    );

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
