export type QueryProductValues = {
    id: string,
    name : string,
    shop_id: string
}

export const searchOnType = async(q: string): Promise<QueryProductValues[]> => {
    const res = await fetch(`/api/v2/search/product?q=${q}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMessage =
        data?.errors?.[0]?.message || "Failed to request";
        throw new Error(errorMessage);
    }

    return data;
}