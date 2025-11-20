import customAxios from "../../../../lib/customAxios"
import type { GameFpsComponentsDto } from "../types/GameFpsComponentsDto"

export const getAllFpsComponentsApi = async (): Promise<GameFpsComponentsDto> => {
    const result = await customAxios.get("/api/components/fps")
    return result.data
}
