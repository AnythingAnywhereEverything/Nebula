// useAddressService

import { addAddress, deleteAddress, editAddress, setDefaultAddress } from "@/api/address";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddressService = () => {
    const queryClient = useQueryClient();

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["addresses"] });
    };

    const addAddressMutation = useMutation({
        mutationFn: addAddress,
        onSuccess: handleSuccess,
    });

    const editAddressMutation = useMutation({
        mutationFn: ({ address_id, payload }: { address_id: string; payload: any }) =>
            editAddress(address_id, payload),
        onSuccess: handleSuccess,
    });

    const deleteAddressMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: handleSuccess,
    });

    const setDefaultAddressMutation = useMutation({
        mutationFn: ({ address_id }: { address_id: string }) =>
            setDefaultAddress(address_id),
        onSuccess: handleSuccess,
    });

    return {
        addAddress: addAddressMutation.mutateAsync,
        editAddress: editAddressMutation.mutateAsync,
        deleteAddress: deleteAddressMutation.mutateAsync,
        setDefaultAddress: setDefaultAddressMutation.mutateAsync,

        addAddressLoading: addAddressMutation.isPending,
        editAddressLoading: editAddressMutation.isPending,

        addAddressSuccess: addAddressMutation.isSuccess,
        editAddressSuccess: editAddressMutation.isSuccess,
        // deleteAddress: deleteAddressMutation.mutateAsync,
    };
}