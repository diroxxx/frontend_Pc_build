import customAxios from "../../../../lib/customAxios.tsx";
import type {CpuRecDto} from "../../dto/GameReqCompDto.ts";

export const getAllCpusApi = async () => {
    const response = await customAxios.get<CpuRecDto>("api/games/cpus");
    return response.data;
};