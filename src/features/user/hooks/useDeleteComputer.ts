import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteComputerById} from "../api/deleteComputerById.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";

export const useDeleteComputer = (userEmail?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComputerById,
        onSuccess: async () => {
            showToast.success("Zestaw został usunięty");

            if (userEmail) {
                await queryClient.invalidateQueries({
                    queryKey: ["computers", userEmail],
                });
            }
        },
        onError: (error: never) => {
            console.error("Błąd usuwania:", error);
            showToast.error("Nie udało się usunąć zestawu");
        },
    });
};
