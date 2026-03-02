import { requestCreateShop } from "@/api/shop";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useShopService = () => {
  const queryClient = useQueryClient();

  const createShopMut = useMutation({
      mutationFn: requestCreateShop,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["shops"] });
      },
  });

  return {
    createShop: createShopMut.mutateAsync
  };
};