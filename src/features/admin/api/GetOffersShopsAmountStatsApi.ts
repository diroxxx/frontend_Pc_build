import customAxios from "../../../lib/customAxios.tsx";
import type {ShopAmountOfOffersDto} from "../../../types/ShopAmountOfOffersDto.ts";

export const GetOffersShopsAmountStatsApi = async (): Promise<ShopAmountOfOffersDto[]> => {
    const result = await customAxios.get('/offers/updates/stats/shops');
    return result.data;
}