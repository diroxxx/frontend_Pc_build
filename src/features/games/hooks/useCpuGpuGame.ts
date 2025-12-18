import {useQuery} from "@tanstack/react-query";
import type {CpuGpuRecGameDto} from "../dto/CpuGpuRecGameDto.ts";
import {getBestMatchCpuGpuForGame} from "../api/getBestMatchCpuGpuForGame.ts";

export const useCpuGpuGame = (gameTitle: string | undefined, budget: number) => {

    return useQuery<CpuGpuRecGameDto>({
        queryKey: ["cpuGpuGame", gameTitle, budget],
        queryFn: () => getBestMatchCpuGpuForGame(gameTitle!, budget),
        enabled: false,

    });
};