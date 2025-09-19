import { NextResponse } from "next/server";
import OpenAI from "openai";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `${process.env.OPENAI_ENDPOINT}/openai/deployments/${process.env.OPENAI_DEPLOYMENT_ID}`,
  defaultQuery: { "api-version": process.env.OPENAI_API_VERSION },
  defaultHeaders: { "api-key": process.env.OPENAI_API_KEY },
});

// Replace this with a secret known only to server and client
const HMAC_SECRET = process.env.HMAC_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    // Extract headers
    const apiKey = req.headers.get("x-api-key");
    const authHeader = req.headers.get("Authorization");

    if (!apiKey || !authHeader) {
      return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    // Read body as text to compute HMAC
    const bodyText = await req.text();

    // Compute HMAC
    const computedHmac = crypto.createHmac("sha256", HMAC_SECRET).update(bodyText).digest("hex");

    // Compare with Authorization header
    if (computedHmac !== authHeader) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    // Parse JSON after HMAC check
    const { message } = JSON.parse(bodyText);
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant integrated with Azure OpenAI." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message?.content || "No response generated.";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Azure OpenAI API Error:", error);

    // Safely handle the error type
    const message = error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
