import customAxios from "../../../../lib/customAxios";
import type { ComponentItem } from "../../../../shared/dtos/BaseItemDto";

export const updateComponentApi = async (component: ComponentItem) => {
    console.log("API - Updating component:", component);
    const result = await customAxios.put(`/api/components/${component.id}`, component);
    return result.data;
}