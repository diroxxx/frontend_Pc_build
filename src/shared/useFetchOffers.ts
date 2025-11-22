import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {getAllOffers, type OfferResponse} from "../api/getAllOffers.ts";
import type {OfferFilters} from "../types/OfferFilters.ts";


export const useFetchOffers = (page: number,
                               filters?: OfferFilters) => {
    return useQuery<OfferResponse>({
        queryKey: ["offers", page, filters],
        queryFn: () => getAllOffers(page,filters),
        placeholderData: keepPreviousData,

    });

}

