import customAxios from "../../lib/customAxios.tsx"
import type { GameFpsComponentsDto } from "../../features/games/dto/GameFpsComponentsDto.ts"

export const getAllFpsComponentsApi = async (): Promise<GameFpsComponentsDto> => {
    const result = await customAxios.get("/api/components/fps")
    return result.data
}
