import { createHmac } from "crypto";

export async function computeHmac(message: string, secret: string): Promise<string> {
  const isSecure = typeof window !== "undefined" && window.crypto?.subtle;

  if (isSecure) {
    try {
      const encoder = new TextEncoder();

      const key = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await window.crypto.subtle.sign("HMAC", key, encoder.encode(message));

      return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (err) {
      console.warn("Web Crypto fallback due to error:", err);
    }
  }

  // 🔁 Fallback: Node.js built-in crypto
  return createHmac("sha256", secret).update(message).digest("hex");
}
