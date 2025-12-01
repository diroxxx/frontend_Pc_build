import {useQuery} from "@tanstack/react-query";
import type {CpuGpuRecGameDto} from "../types/CpuGpuRecGameDto.ts";
import {getBestMatchCpuGpuForGame} from "../api/getBestMatchCpuGpuForGame.ts";

export const useCpuGpuGame = (gameTitle: string | undefined, budget: number | undefined) => {

    return useQuery<CpuGpuRecGameDto>({
        queryKey: ["cpuGpuGame", gameTitle, budget],
        queryFn: () => getBestMatchCpuGpuForGame(gameTitle!, budget!),
        enabled: false,

    });
};