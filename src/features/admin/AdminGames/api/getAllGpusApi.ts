import customAxios from "../../../../lib/customAxios.tsx";
import type {GpuRecDto} from "../../types/GameReqCompDto.ts";

export const getAllGpusApi = async () => {
    const response = await customAxios.get<GpuRecDto>("api/games/gpus");
    return response.data;
};