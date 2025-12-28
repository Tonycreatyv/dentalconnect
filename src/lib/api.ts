const API_URL = "https://api.creatyv.io";

export async function signup(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Signup failed: " + err);
  }

  return await res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Login failed: " + err);
  }

  const data = await res.json();
  localStorage.setItem("token", data.session.access_token);
  return data;
}

export async function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  return await res.json();
}
