import customAxios from "../../lib/customAxios.tsx";
import type {ComponentsAmountPcDto} from "../dtos/ComponentsAmountPcDto.ts";

export const getComponentsPcStatsApi = async () => {
    const result = await customAxios.get<ComponentsAmountPcDto>('api/components/components-pc-stats');
    return result.data;
}