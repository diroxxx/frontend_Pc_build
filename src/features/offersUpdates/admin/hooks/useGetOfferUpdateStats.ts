import {useQuery} from "@tanstack/react-query";
import type {OfferUpdateStatsDto} from "../dto/OfferUpdateStatsDto.ts";
import {GetOfferUpdateStatsApi} from "../api/GetOfferUpdateStatsApi.ts";

export const useGetOfferUpdateStats = () => {
    return useQuery<OfferUpdateStatsDto[]>({
        queryKey: ["offerUpdateStats"],
        queryFn: GetOfferUpdateStatsApi
    })
};