import customAxios from "../../../lib/customAxios.tsx";
import type {CpuGpuRecGameDto} from "../dto/CpuGpuRecGameDto.ts";

export  const getBestMatchCpuGpuForGame = async (gameTitle: string, budget?: number) => {

     const budgetParam = budget !== undefined && budget > 0 ? `&budget=${budget}` : '';
    const result = await customAxios.get<CpuGpuRecGameDto>(`/api/games/cpu-gpu?gameTitle=${gameTitle}${budgetParam}`);
    console.log(result.data);
    return result.data;

}