import { fetchWithAuth, getCacheUserId, getToken } from "@/handler/token_handler";

interface UserResponse {
  id: string;
  username: string;
  display_name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export async function getUser(): Promise<UserResponse> {
  const token = getToken();
  const userId = getCacheUserId();
  if (!token) throw new Error("No token found");

  const res = await fetchWithAuth(`/api/v2/users/${userId}`); // proxied to backend via nginx
  if (!res.ok) throw new Error("Failed to get user data");
  const data = await res.json();
  return data;
}

export const updateDisplayName = async (display_name: string) => {
  const token = getToken();
  const userId = getCacheUserId();
  if (!token) throw new Error("No token found");

  const res = await fetchWithAuth(`/api/v2/users/${userId}/display_name`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ display_name }),
  });
  
  if (!res.ok) throw new Error("Failed to update display name");
  return res.json();
};

export const updateUsername = async (username: string) => {
  const token = getToken();
  const userId = getCacheUserId();
  if (!token) throw new Error("No token found");

  const res = await fetchWithAuth(`/api/v2/users/${userId}/username`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) throw new Error("Failed to update Username");
  return res.json();
};