import type {ComponentItem, ItemType} from "../types/BaseItemDto.ts";
import type {OfferSpec} from "../atomContext/componentAtom.tsx";
import {ItemConditionEnum} from "../types/ItemConditionEnum.ts";
import customAxios from "../lib/customAxios.tsx";

export interface OfferResponse {
    items: OfferSpec[];
    hasMore: boolean;
    totalPages: number;
    totalElements: number;
}

export async function getAllOffers(page: number = 0,
    filters?: {
    itemType?:ItemType;
    brand?: string;
    minPrize?: number;
    maxPrize?: number;
    itemCondition?: ItemConditionEnum }): Promise<OfferResponse> {

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', '30');
    if (filters?.itemType) params.append('itemType', filters.itemType);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.minPrize) params.append('minPrize', filters.minPrize.toString());
    if (filters?.maxPrize) params.append('maxPrize', filters.maxPrize.toString());
    if (filters?.itemCondition) params.append('itemCondition', filters.itemCondition);
    const res = await customAxios.get(`/api/offers?${params.toString()}`);
    return res.data;
}