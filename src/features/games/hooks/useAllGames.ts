import { useQuery } from "@tanstack/react-query"
import  type { GameDto } from "../dto/GameDto.ts"
import { GetAllGamesApi } from "../api/GetAllGames.ts"

export const useGetAllGamesApi =  () => {
    return useQuery<GameDto[]>({
        queryKey: ["allGames"],
        queryFn: () => GetAllGamesApi()
    })
}