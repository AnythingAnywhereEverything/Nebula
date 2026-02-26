import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "@/api/address";

export const useAddress = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      try {
        return await getAddresses();
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};