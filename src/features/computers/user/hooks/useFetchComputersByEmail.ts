import {useQuery} from "@tanstack/react-query";
import {getAllComputersByUserEmail} from "../api/getAllComputersByUserEmail.ts";
import type {ComputerDto} from "../../../../shared/dtos/ComputerDto.ts";

export const useFetchComputersByEmail = (email?: string) => {
    return useQuery <ComputerDto[]>({
        queryKey: ["computers", email],
        queryFn: () => getAllComputersByUserEmail(email!),
        enabled: !!email,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
};