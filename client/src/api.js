const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function getImageUrl(path) {
  if (!path) {
    return "https://placehold.co/600x600/f2c84b/123047?text=AI+Center+UB";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${API_BASE}${path}`;
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.message
        ? payload.message
        : "Terjadi kesalahan pada server.";
    throw new Error(message);
  }

  return payload;
}
