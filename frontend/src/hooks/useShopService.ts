import { requestCreateShop, updateShopBanner, updateShopProfile } from "@/api/shop";
import { updateProfilePicture } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateShopProfileInput = {
    shopId: string
    file: File
}

export const useShopService = () => {
  const queryClient = useQueryClient();

  const handleChangeSuccess = (updatedShop: any) => {
    queryClient.setQueryData(["shops"], updatedShop);
  };

  const createShopMut = useMutation({
      mutationFn: requestCreateShop,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["shops"] });
      },
  });

  const shopProfileMutation = useMutation({
    mutationFn: ({ shopId, file }: UpdateShopProfileInput) => 
        updateShopProfile(shopId, file),
    onSuccess: handleChangeSuccess
    }
  );

  const shopBannerMutation = useMutation({
    mutationFn: ({shopId, file}: UpdateShopProfileInput) =>
      updateShopBanner(shopId, file),
    onSuccess: handleChangeSuccess
  });

  return {
    createShop: createShopMut.mutateAsync,
    shopUpdateProfile: shopProfileMutation.mutateAsync,
    shopUpdateBanner: shopBannerMutation.mutateAsync, 
  };
};