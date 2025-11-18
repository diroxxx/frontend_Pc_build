import customAxios from "../../../../lib/customAxios"
import type { GameDto } from "../types/GameDto";

export const GetAllGamesApi = async (): Promise<GameDto[]> => {
    const response = await customAxios.get("api/games");
    return response.data;
};