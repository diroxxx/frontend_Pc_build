import {useQuery} from "@tanstack/react-query";
import {GetOffersShopsAmountStatsApi} from "../api/GetOffersShopsAmountStatsApi.ts";
import type {ShopAmountOfOffersDto} from "../../../types/ShopAmountOfOffersDto.ts";

export const useGetOffersShopsAmountStats = () => {
    return useQuery<ShopAmountOfOffersDto[]>({
        queryKey: ["offersShopsAmountStats"],
        queryFn: GetOffersShopsAmountStatsApi
    })

};