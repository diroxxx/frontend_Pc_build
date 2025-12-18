import customAxios from "../../../../lib/customAxios.tsx";
import type {OfferUpdateStatsDto} from "../dto/OfferUpdateStatsDto.ts";

export async function GetOfferUpdateStatsApi():Promise<OfferUpdateStatsDto[]>  {
    const result = await customAxios.get('/offers/updates/stats');
    return result.data;
}