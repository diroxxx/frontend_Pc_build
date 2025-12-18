import customAxios from "../../../lib/customAxios.tsx"
import type { GameDto } from "../dto/GameDto.ts";

export const GetAllGamesApi = async (): Promise<GameDto[]> => {
    const response = await customAxios.get("api/games");
    return response.data;
};