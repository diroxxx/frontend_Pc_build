import { useQuery } from "@tanstack/react-query"
import type { GameFpsComponentsDto } from "../types/GameFpsComponentsDto"
import { getAllFpsComponentsApi } from "../api/getAllFpsComponentsApi"

export const useFpsComponents = () => {
    return useQuery<GameFpsComponentsDto>({
        queryKey: ["fps-components"],
        queryFn: () => getAllFpsComponentsApi()
    })
}