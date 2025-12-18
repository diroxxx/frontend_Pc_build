import {atom} from "jotai";
import type {ComponentTypeEnum} from "../dtos/BaseItemDto.ts";
import type {ItemConditionEnum} from "../dtos/ItemConditionEnum.ts";
import { SortByOffersEnum} from "../dtos/SortByOffersEnum.ts";

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
    query: undefined,
    sortBy: SortByOffersEnum.NEWEST

})