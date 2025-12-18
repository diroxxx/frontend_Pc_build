import type {ComponentTypeEnum} from "../../../types/BaseItemDto.ts";

export type OfferRecDto = {
    title: string,
    brand: string,
    model: string,
    condition: string,
    photoUrl: string,
    websiteUrl: string
    price: number,
    shopName: string,
    componentType: ComponentTypeEnum
}