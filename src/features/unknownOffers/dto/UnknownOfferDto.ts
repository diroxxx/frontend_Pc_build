import type { OfferBase } from "../../../shared/dtos/OfferBase.ts";

export interface UnknownOfferDto extends OfferBase {
    id: number;
}

export interface UnknownOffersPageResponse {
    offers: UnknownOfferDto[];
    hasMore: boolean;
    totalPages: number;
    totalElements: number;
}

export interface AssignToComponentDto {
    offerId: number;
    componentId: number;
}

export interface ComponentSearchResultDto {
    id: number;
    brand: string;
    model: string;
    componentType: string;
}
