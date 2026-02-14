// hooks/useUser.js
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/user";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await getUser();
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};