import type {OfferShopUpdate} from "./OfferShopUpdate.ts";

export type OfferUpdateInfo = {
    id: number,
    startedAt: string,
    finishedAt?: string,
    shops?: OfferShopUpdate[]
}