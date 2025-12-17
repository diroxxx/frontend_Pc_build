import customAxios from "../../lib/customAxios.tsx";
import type {ComponentOffer} from "../../types/OfferBase.ts";

import type  {OfferFiltersType} from "../atoms/OfferLeftPanelFiltersAtom.ts";

export interface OfferResponse {
    offers: ComponentOffer[];
    hasMore: boolean;
    totalPages: number;
    totalElements: number;
}

export async function getAllOffers(page: number = 0,
    filters?: OfferFiltersType): Promise<OfferResponse> {


    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', '30');
    if (filters?.componentType) params.append('componentType', filters.componentType);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.minPrize) params.append('minPrize', filters.minPrize.toString());
    if (filters?.maxPrize) params.append('maxPrize', filters.maxPrize.toString());
    if (filters?.itemCondition) params.append('componentCondition', filters.itemCondition);
    if (filters?.shopName) params.append('shopName', filters.shopName);
    if (filters?.query) params.append('query', filters.query);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const res = await customAxios.get(`/offers?${params.toString()}`);
    return res.data;
}