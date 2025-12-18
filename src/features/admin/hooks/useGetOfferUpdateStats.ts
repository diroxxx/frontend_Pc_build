import {useQuery} from "@tanstack/react-query";
import type {OfferUpdateStatsDto} from "../../../types/OfferUpdateStatsDto.ts";
import {GetOfferUpdateStatsApi} from "../offersUpdates/api/GetOfferUpdateStatsApi.ts";

export const useGetOfferUpdateStats = () => {
    return useQuery<OfferUpdateStatsDto[]>({
        queryKey: ["offerUpdateStats"],
        queryFn: GetOfferUpdateStatsApi
    })
};