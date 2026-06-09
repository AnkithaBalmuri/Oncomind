const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mock.oncomind.local";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (API_URL.includes("mock.oncomind.local")) {
    throw new Error("Mock mode is active. Replace NEXT_PUBLIC_API_URL to connect a backend.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
