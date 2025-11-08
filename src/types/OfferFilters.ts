import type {ComponentTypeEnum} from "./BaseItemDto.ts";
import type {ItemConditionEnum} from "./ItemConditionEnum.ts";
import type {SortByOffersEnum} from "./SortByOffersEnum.ts";

export interface OfferFilters {
    componentType?: ComponentTypeEnum;
    brand?: string;
    minPrize?: number;
    maxPrize?: number;
    itemCondition?: ItemConditionEnum;
    shopName?: string;
    query?: string;
    sortBy?: SortByOffersEnum;
}
