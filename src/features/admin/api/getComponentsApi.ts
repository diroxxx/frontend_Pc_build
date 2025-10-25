import {type ComponentItem } from "../../../types/BaseItemDto.ts";
import customAxios from "../../../lib/customAxios.tsx";

export async function getComponentsApi() : Promise<ComponentItem[]> {
    const response = await customAxios.get<ComponentItem[]>('/api/components');
    return response.data
}