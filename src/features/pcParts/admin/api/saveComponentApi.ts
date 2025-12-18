import type {ComponentItem} from "../../../../shared/dtos/BaseItemDto.ts";
import customAxios from "../../../../lib/customAxios.tsx";

export const saveComponentApi = async (component: ComponentItem) => {
    const result = await customAxios.post('/api/components', component);
    return result.data;
}