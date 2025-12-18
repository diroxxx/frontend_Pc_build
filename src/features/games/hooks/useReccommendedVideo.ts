import { useQuery } from "@tanstack/react-query"
import type { GameFpsConfigDto } from "../dto/GameFpsConfigDto.ts"
import { getYtVideoRecommendationApi } from "../api/getYtVideoRecommendationApi.ts"
import type { GameFpsVideoDto } from "../dto/GameFpsVideoDto.ts"

export const useReccommendedVideo = (config?:GameFpsConfigDto) => {
    return useQuery<GameFpsVideoDto>({
        queryKey: ["yt-recommendation-video"],
        queryFn: () => getYtVideoRecommendationApi(config!),
        enabled: false
    })
}