import { axiosInstaceBackend } from "@/lib/axiosInstanct";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization")!;
  try {
    const res = await axiosInstaceBackend.get(`/conversations/users/sessions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });
    const data = res.data;

    return NextResponse.json(data);
  } catch (error) {
    console.log({ error });
    return NextResponse.json([]);
  }
}
