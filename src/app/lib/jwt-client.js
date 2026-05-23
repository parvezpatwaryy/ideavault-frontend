"use client";

export async function syncJwtForUser(user) {
  if (!user?.email || typeof window === "undefined") return;

  const existingEmail = localStorage.getItem("ideavault_user_email");
  const existingToken = localStorage.getItem("ideavault_access_token");
  if (existingToken && existingEmail === user.email) return;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      name: user.name || user.email,
    }),
  });

  if (!response.ok) return;

  const data = await response.json();
  if (data.token) {
    localStorage.setItem("ideavault_access_token", data.token);
    localStorage.setItem("ideavault_user_email", user.email);
  }
}
