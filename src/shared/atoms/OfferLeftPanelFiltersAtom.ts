import {atom} from "jotai";
import type {ComponentTypeEnum} from "../../types/BaseItemDto.ts";
import type {ItemConditionEnum} from "../../types/ItemConditionEnum.ts";
import type {SortByOffersEnum} from "../../types/SortByOffersEnum.ts";

export type OfferFiltersType = {
    componentType?: ComponentTypeEnum;
    brand?: string;
    minPrize?: number;
    maxPrize?: number;
    itemCondition?: ItemConditionEnum;
    shopName?: string;
    query?: string;
    sortBy?: SortByOffersEnum;
}

export const offerLeftPanelFiltersAtom = atom<OfferFiltersType>({
    componentType: undefined,
    brand: "",
    minPrize: 0,
    maxPrize: 99999,
    itemCondition: undefined,
    shopName: "",
    query: "",
    sortBy: undefined

})