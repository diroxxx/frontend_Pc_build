import {useQuery} from "@tanstack/react-query";
import {getAllOffers, type OfferResponse} from "../api/getAllOffers.ts";
import type {ItemType} from "../types/BaseItemDto.ts";
import {ItemConditionEnum} from "../types/ItemConditionEnum.ts";
import type {OfferSpec} from "../atomContext/componentAtom.tsx";


export const useFetchOffers = (page: number,
                               filters?: {
                                   itemType?:ItemType;
                                   brand?: string;
                                   minPrize?: number;
                                   maxPrize?: number;
                                   itemCondition?: ItemConditionEnum }) => {
    return useQuery<OfferResponse>({
        queryKey: ["offers", page, filters],
        queryFn: () => getAllOffers(page,filters)
    });

}

