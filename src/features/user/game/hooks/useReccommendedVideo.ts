import { useQuery } from "@tanstack/react-query"
import type { GameFpsConfigDto } from "../types/GameFpsConfigDto"
import { getYtVideoRecommendationApi } from "../api/getYtVideoRecommendationApi"
import type { GameFpsVideoDto } from "../types/GameFpsVideoDto"

export const useReccommendedVideo = (config?:GameFpsConfigDto) => {
    return useQuery<GameFpsVideoDto>({
        queryKey: ["yt-recommendation-video"],
        queryFn: () => getYtVideoRecommendationApi(config!),
        enabled: false
    })
}