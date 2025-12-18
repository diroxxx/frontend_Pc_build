import type {ComputerDto} from "../../../../shared/dtos/ComputerDto.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {saveComputerByUserEmail} from "../api/saveComputerByUserEmail.ts";

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