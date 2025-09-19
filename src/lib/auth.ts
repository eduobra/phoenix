export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // ✅ correct
    },
    body: JSON.stringify({ email, password }), // ✅ correct
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return await res.json();
};
