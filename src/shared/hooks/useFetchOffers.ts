import {useQuery} from "@tanstack/react-query";
import {getAllOffers, type OfferResponse} from "../api/getAllOffers.ts";

import   type {OfferFiltersType} from "../atoms/OfferLeftPanelFiltersAtom.ts";


export const useFetchOffers = (page: number,
                               filters?: OfferFiltersType) => {
    return useQuery<OfferResponse>({
        queryKey: ["offers", page, filters],
        queryFn: () => getAllOffers(page,filters),
        staleTime: 60_000
    });

}

