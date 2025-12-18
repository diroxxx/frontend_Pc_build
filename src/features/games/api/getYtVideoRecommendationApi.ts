import customAxios from "../../../lib/customAxios.tsx"
import type { GameFpsConfigDto } from "../dto/GameFpsConfigDto.ts"
import type { GameFpsVideoDto } from "../dto/GameFpsVideoDto.ts"

export const getYtVideoRecommendationApi = async (config:GameFpsConfigDto ): Promise<GameFpsVideoDto> => {

    const result = await customAxios.post("/api/yt/recommendations", config)
    console.log("getYtVideoRecommendationApi result:", result.data)
    return result.data

}