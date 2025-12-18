import customAxios from "../../../../lib/customAxios.tsx";
import type {ComponentsStats} from "../../../offersUpdates/admin/dto/ComponentsStats.ts";

export async function getComponentsStatsApi():Promise<ComponentsStats[]> {
    const res = await customAxios.get('/offers/stats');
    return res.data;
}