import customAxios from "../../../lib/customAxios.tsx";
import type {CpuGpuRecGameDto} from "../dto/CpuGpuRecGameDto.ts";

export  const getBestMatchCpuGpuForGame = async (gameTitle: string, budget: number) => {

    const result = await customAxios.get<CpuGpuRecGameDto>("/api/games/cpu-gpu?gameTitle=" + gameTitle + "&budget=" + budget);
    console.log(result.data);
    return result.data;

}