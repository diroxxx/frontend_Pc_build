import type {ComputerDto} from "../types/ComputerDto.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {saveComputerByUserEmail} from "../features/computers/user/api/saveComputerByUserEmail.ts";

export const useSaveComputerByUserEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, computer }: { email: string; computer: ComputerDto }) =>
            saveComputerByUserEmail(email, computer),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["computers"] });
        },

        onError: (error) => {
            console.error(" Błąd zapisu zestawów:", error);

        },
    });
};