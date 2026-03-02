import { fetchWithAuth, getCacheUserId, getToken } from "@/handler/token_handler";

export interface CreateShopRequest {
    name: String,
    description: String | null
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_brand: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopsResponse {
  owned: Shop[];
  associate: Shop[];
}

export const getAssociateShops = async (): Promise<ShopsResponse> => {
    const token = getToken();
    const userId = getCacheUserId();
    if (!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/shops/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }

    return data;
}

export const requestCreateShop = async (payload : CreateShopRequest) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    await fetchWithAuth(`/api/v2/shops/create`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
}
