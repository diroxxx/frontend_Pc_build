import customAxios from "../../../../lib/customAxios"
import type { GameFpsConfigDto } from "../types/GameFpsConfigDto"
import type { GameFpsVideoDto } from "../types/GameFpsVideoDto"

export const getYtVideoRecommendationApi = async (config:GameFpsConfigDto ): Promise<GameFpsVideoDto> => {

    const result = await customAxios.post("/api/yt/recommendations", config)
    console.log("getYtVideoRecommendationApi result:", result.data)
    return result.data

}