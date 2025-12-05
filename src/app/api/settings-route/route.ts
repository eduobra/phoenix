// app/api/settings-route/route.ts
import { NextResponse } from "next/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/settings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization"); // <- use get(), not put()
    if (!authHeader) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const body = await req.json(); // { theme, accent_color, language, session_timeout_control, time_zone }

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL_LOCAL}/settings`, {
      method: "PUT", // change PATCH -> PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}