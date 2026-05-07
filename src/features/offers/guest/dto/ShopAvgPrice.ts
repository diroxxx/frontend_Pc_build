import type { MonthAvgPriceDto } from "./MonthPriceDto";

export interface ShopAvgPrice {
    shop: string;
    monthlyPrices: MonthAvgPriceDto[];
}