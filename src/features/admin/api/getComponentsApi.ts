import {type ComponentItem } from "../../../types/BaseItemDto.ts";
import customAxios from "../../../lib/customAxios.tsx";

export interface ComponentsResponse {
    items: ComponentItem[];
    hasMore: boolean;
    totalPages: number;
    totalElements: number;
}

export async function getComponentsApi(page: number = 0): Promise<ComponentsResponse> {
    const res = await customAxios.get(`/api/components?page=${page}&size=10`);
    return res.data;
}

