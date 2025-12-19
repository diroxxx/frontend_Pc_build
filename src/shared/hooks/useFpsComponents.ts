import { useQuery } from "@tanstack/react-query"
import type { GameFpsComponentsDto } from "../../features/games/dto/GameFpsComponentsDto.ts"
import { getAllFpsComponentsApi } from "../api/getAllFpsComponentsApi.ts"

export const useFpsComponents = () => {
    return useQuery<GameFpsComponentsDto>({
        queryKey: ["fps-components"],
        queryFn: () => getAllFpsComponentsApi()
    })
}