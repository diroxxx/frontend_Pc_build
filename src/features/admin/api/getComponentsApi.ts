import {type ComponentItem } from "../../../types/BaseItemDto.ts";
import customAxios from "../../../lib/customAxios.tsx";
import type { ComponentTypeEnum } from "../../../types/BaseItemDto.ts";
export interface ComponentsResponse {
    items: ComponentItem[];
    hasMore: boolean;
    totalPages: number;
    totalElements: number;
}

export async function getComponentsApi(page: number = 0, filters?: {itemType?:ComponentTypeEnum; brand?: string; searchTerm: string }): Promise<ComponentsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', '30');
    console.log('Filters in API call:', filters);

    if (filters?.itemType) params.append('componentType', filters.itemType);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const res = await customAxios.get(`/api/components?${params.toString()}`);
    return res.data;
}

