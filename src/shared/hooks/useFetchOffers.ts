import {keepPreviousData, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAllOffers, type OfferResponse} from "../api/getAllOffers.ts";

import   type {OfferFiltersType} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import {useEffect} from "react";


export const useFetchOffers = (page: number,
                               filters?: OfferFiltersType) => {
    const queryClient = useQueryClient();

    const query = useQuery<OfferResponse>({
        queryKey: ["offers", page, filters],
        queryFn: () => getAllOffers(page,filters),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60_000
    });
    
    useEffect(() => {
        if (query.data?.hasMore) {
            queryClient.prefetchQuery({
                queryKey: ["offers", page + 1, filters],
                queryFn: () => getAllOffers(page + 1, filters),
            });
        }
    },[filters, page, query.data?.hasMore, queryClient])

    return query;
}
