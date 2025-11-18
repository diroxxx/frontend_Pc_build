import { useQuery } from "@tanstack/react-query"
import  type { GameDto } from "../types/GameDto"
import { GetAllGamesApi } from "../api/GetAllGames"

export const useGetAllGamesApi =  () => {
    return useQuery<GameDto[]>({
        queryKey: ["allGames"],
        queryFn: () => GetAllGamesApi()
    })
}