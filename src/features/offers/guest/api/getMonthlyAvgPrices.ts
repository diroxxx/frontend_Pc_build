import customAxios from "../../../../lib/customAxios";
import type { ShopAvgPrice } from "../dto/ShopAvgPrice";

export const getMonthlyAvgPrices = async (componentId: number): Promise<ShopAvgPrice[]> => {
    const res = await customAxios.get<ShopAvgPrice[]>(`/api/components/${componentId}/stats/avgPrices`);
    return res.data;
}