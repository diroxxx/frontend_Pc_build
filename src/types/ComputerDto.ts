import type {ComponentOffer} from "./OfferBase.ts";

export type ComputerDto = {
    id: number;
    name: string;
    price: number;
    isVisible: boolean;
    offers: ComponentOffer[]
}