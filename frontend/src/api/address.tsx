import { fetchWithAuth, getCacheUserId } from "@/handler/token_handler";

export interface AddressResponse {
    id: string;
    full_name: string | null;
    phone_code: string | null;
    phone_number: string | null;
    address_line1: string | null;
    address_line2?: string | null;
    zip_code: string | null;
    is_default: boolean;
    city: string | null;
    country: string | null;
    state: string | null;
}

export interface AddressRequest {
    full_name: string | null;
    phone_number: string | null;
    address_line1: string | null;
    address_line2?: string | null;
    zip_code: string | null;
    is_default: boolean;
    city: string | null;
    country: string | null;
    state: string | null;
}

export const getAddresses = async (): Promise<AddressResponse[]> => {
    const userId = getCacheUserId();

    const res = await fetchWithAuth(`/api/v2/users/${userId}/addresses`); // proxied to backend via nginx
    if (!res.ok) throw new Error("Failed to get addresses");
    const data = await res.json();

    return data;
}

export const editAddress = async (address_id: string, payload: AddressRequest): Promise<AddressResponse> => {
    const userId = getCacheUserId();

    console.log("Editing address with payload in API channel:", payload);

    const res = await fetchWithAuth(`/api/v2/users/${userId}/addresses/${address_id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to edit address";
        throw new Error(errorMessage);
    }

    return data;
};

export const addAddress = async (payload: AddressRequest): Promise<AddressResponse> => {
    const userId = getCacheUserId();

    const res = await fetchWithAuth(`/api/v2/users/${userId}/addresses`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to add address";
        throw new Error(errorMessage);
    }

    return data;
};

export const deleteAddress = async (address_id: string): Promise<void> => {
    const userId = getCacheUserId();

    const res = await fetchWithAuth(`/api/v2/users/${userId}/addresses/${address_id}`, {
        method: "DELETE",
    })

    if (!res.ok) {
        const data = await res.json();
        const errorMessage =
            data?.errors?.[0]?.message || "Failed to delete address";
        throw new Error(errorMessage);
    }
};

export const setDefaultAddress = async (address_id: string): Promise<void> => {
    const userId = getCacheUserId();

    const res = await fetchWithAuth(`/api/v2/users/${userId}/addresses/${address_id}/default`, {
        method: "PATCH",
    })

    if (!res.ok) {
        const errorMessage =
            "Failed to set default address";
        throw new Error(errorMessage);
    }
};