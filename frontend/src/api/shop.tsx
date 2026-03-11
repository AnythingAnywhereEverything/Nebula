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
  shop_profile_url: string | null;
  shop_banner_url: string | null;
  rating:string;
  review_amount: string;
}

export interface UpdateShopInfo {
    id: string;
    name: string;
    description:string;
}

export interface ShopsResponse {
  owned: Shop[];
  associate: Shop[];
}
export interface RequestNewRole {
    name: string
    description: string,
    permissions: number
}

export interface UpdateShopRole {
    id: string;
    name: string;
    description: string;
    permissions: number;
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
export const getCurrentShopInfo = async (
    shopId: string
): Promise<Shop> => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/shops/${shopId}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        },
    })
    const data = await res.json()
    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }
    
    return data;
}

export const updateShopInfo = async ( payload: UpdateShopInfo ) =>{
    const token = getToken()
    if (!token) throw new Error("No token found");

    await fetchWithAuth(`/api/v2/shops/${payload.id}/info`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
}

export const updateShopProfile = async (shopId:string ,file: File) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const formData = new FormData();
    formData.append("file", file); // key must match backend field name

  for (const [key, value] of formData.entries()) {
  }
  const res = await fetchWithAuth(`/api/v2/shops/${shopId}/profile`, {
    method: "PATCH",
    body: formData,
  });

}
export const updateShopBanner = async (shopId:string ,file: File) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const formData = new FormData();
    formData.append("file", file); // key must match backend field name

  for (const [key, value] of formData.entries()) {
  }
  const res = await fetchWithAuth(`/api/v2/shops/${shopId}/banner`, {
    method: "PATCH",
    body: formData,
  });
}

export const getShopRole = async ( shop_id:string ) => {
    const token = getToken();
    if(!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/role`, {
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

export const getShopTotalProducts = async (
    shop_id:string
): Promise<number> => {
    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/product_total`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    })

    const data = await res.json()
    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }
    return data;

}


export const createNewRole = async (shop_id: string ,payload : RequestNewRole) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    
    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/role`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }
    return data;
}

export const updateRole = async (shop_id : string, payload:UpdateShopRole) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/role`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
}

export const deleteRole = async (shop_id: string, role_id:string) => {
    const token = getToken();
    if (!token) throw new Error("No token found");
    
    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/role/${role_id}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

}

export const getShopMember = async (shop_id:string) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const res = await fetchWithAuth(`/api/v2/shops/${shop_id}/members`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    
    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }
    return data;
}
