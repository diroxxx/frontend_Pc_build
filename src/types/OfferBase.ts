import type { CaseItem, CoolerItem, GraphicsCardItem, MemoryItem, MotherboardItem, PowerSupplyItem, ProcessorItem, StorageItem } from "./BaseItemDto.ts";
export interface OfferBase {
    title: string;
    condition: string;
    photoUrl: string;
    websiteUrl: string;
    price: number;
    shopName: string;
}


export type ComponentOffer = ProcessorOffer | CoolerOffer | GraphicsCardOffer |
    MemoryOffer | MotherboardOffer | PowerSupplyOffer | StorageOffer | CaseOffer;

export interface ProcessorOffer extends ProcessorItem, OfferBase {}
export interface CoolerOffer extends CoolerItem, OfferBase {}
export interface GraphicsCardOffer extends GraphicsCardItem, OfferBase {}
export interface MemoryOffer extends MemoryItem, OfferBase {}
export interface MotherboardOffer extends MotherboardItem, OfferBase {}
export interface PowerSupplyOffer extends PowerSupplyItem, OfferBase {}
export interface StorageOffer extends StorageItem, OfferBase {}
export interface CaseOffer extends CaseItem, OfferBase {}

