import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateComputerName} from "../api/updateComputerName.ts";
import type {ComputerDto} from "../../../types/ComputerDto.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";
import {useAtomValue} from "jotai";
import {userAtom} from "../../../atomContext/userAtom.tsx";


export const useUpdateComputerName = () => {
    const queryClient = useQueryClient();
    const user = useAtomValue(userAtom);

    return useMutation({
        mutationFn: ({ computerId, newName }: { computerId: number; newName: string }) =>
            updateComputerName(newName, computerId),

        onMutate: async ({ computerId, newName }) => {
            await queryClient.cancelQueries({ queryKey: ["computers", user?.email] });

            const previousComputers = queryClient.getQueryData<ComputerDto[]>(["computers", user?.email]);

            queryClient.setQueryData<ComputerDto[]>(["computers", user?.email], old =>
                old
                    ? old.map(c =>
                        c.id === computerId
                            ? { ...c, name: newName }
                            : c
                    )
                    : []
            );

            return { previousComputers };
        },

        onError: (err, _, context) => {
            if (context?.previousComputers) {
                queryClient.setQueryData(["computers", user?.email], context.previousComputers);
            }
            showToast.error("Nie udało się zmienić nazwy zestawu");
        },

        onSuccess: () => {
            showToast.success("Nazwa zestawu została zmieniona!");
        },

        onSettled: async () => {
            if (user?.email) {
                await queryClient.invalidateQueries({ queryKey: ["computers", user.email] });
            }
        },
    });
};
