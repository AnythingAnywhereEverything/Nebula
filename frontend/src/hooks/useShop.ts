import { getAssociateShops } from "@/api/shop";
import { useQuery } from "@tanstack/react-query";

export const useShop = () => {
  return useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      try {
        return await getAssociateShops();
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};