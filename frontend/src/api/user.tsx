import { fetchWithAuth, getCacheUserId, getToken } from "@/handler/token_handler";

interface UserResponse {
  id: string;
  username: string;
  display_name: string;
  email: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function get_user(): Promise<UserResponse> {
  const token = getToken();
  const userId = getCacheUserId();
  if (!token) throw new Error("No token found");

  const res = await fetchWithAuth(`/api/v2/users/${userId}`); // proxied to backend via nginx
  if (!res.ok) throw new Error("Ping failed");
  const data = await res.json();
  console.log("User data response:", data);
  return data;
}
