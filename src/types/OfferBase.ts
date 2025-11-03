import type {
    CaseSpec,
    CoolerSpec,
    GraphicsCardSpec,
    MemorySpec,
    MotherboardSpec, PowerSupplySpec,
    ProcessorSpec, StorageSpec
} from "../atomContext/componentAtom.tsx";

export interface OfferBase {
    title: string;
    condition: string;
    photoUrl: string;
    websiteUrl: string;
    price: number;
    shop: string;
}


export type ComponentOffer = ProcessorOffer | CoolerOffer | GraphicsCardOffer |
    MemoryOffer | MotherboardOffer | PowerSupplyOffer | StorageOffer | CaseOffer;

export interface ProcessorOffer extends ProcessorSpec, OfferBase {}
export interface CoolerOffer extends CoolerSpec, OfferBase {}
export interface GraphicsCardOffer extends GraphicsCardSpec, OfferBase {}
export interface MemoryOffer extends MemorySpec, OfferBase {}
export interface MotherboardOffer extends MotherboardSpec, OfferBase {}
export interface PowerSupplyOffer extends PowerSupplySpec, OfferBase {}
export interface StorageOffer extends StorageSpec, OfferBase {}
export interface CaseOffer extends CaseSpec, OfferBase {}

