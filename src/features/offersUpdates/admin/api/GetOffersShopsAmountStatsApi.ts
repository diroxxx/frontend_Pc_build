import customAxios from "../../../../lib/customAxios.tsx";
import type {ShopAmountOfOffersDto} from "../dto/ShopAmountOfOffersDto.ts";

export const GetOffersShopsAmountStatsApi = async (): Promise<ShopAmountOfOffersDto[]> => {
    const result = await customAxios.get('/api/offersUpdates/stats/shops');
    return result.data;
}