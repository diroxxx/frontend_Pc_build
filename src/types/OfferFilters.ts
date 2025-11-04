import type {ItemType} from "./BaseItemDto.ts";
import type {ItemConditionEnum} from "./ItemConditionEnum.ts";

export interface OfferFilters {
    itemType?: ItemType;
    brand?: string;
    minPrize?: number;
    maxPrize?: number;
    itemCondition?: ItemConditionEnum;
    shopName?: string;
}
