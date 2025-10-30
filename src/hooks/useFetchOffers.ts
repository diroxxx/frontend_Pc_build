import {useQuery} from "@tanstack/react-query";
import {getAllOffers} from "../api/getAllOffers.ts";
import type {ItemType} from "../types/BaseItemDto.ts";
import {ItemConditionEnum} from "../types/ItemConditionEnum.ts";


export const useFetchOffers = (page: number,
                               filters?: {
                                   itemType?:ItemType;
                                   brand?: string;
                                   minPrize?: number;
                                   maxPrize?: number;
                                   itemCondition?: ItemConditionEnum }) => {
    return useQuery({
        queryKey: ["offers"],
        queryFn: getAllOffers(page,filters)
    });

}

