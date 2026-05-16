import customAxios from "../../../lib/customAxios.tsx";
import type { UnknownOfferDto, UnknownOffersPageResponse, AssignToComponentDto, ComponentSearchResultDto } from "../dto/UnknownOfferDto.ts";
import type { ComponentTypeEnum } from "../../../shared/dtos/BaseItemDto.ts";

export async function getUnknownOffersApi(page: number = 0, size: number = 10): Promise<UnknownOffersPageResponse> {
    const res = await customAxios.get(`/offers/unknown?page=${page}&size=${size}`);
    return res.data;
}

export async function assignOfferToComponentApi(dto: AssignToComponentDto): Promise<void> {
    // TODO: Zaimplementować endpoint POST /api/offers/unknown/assign
    // await customAxios.post("offers/unknown/assign", dto);
    void dto;
}

export async function dismissUnknownOfferApi(offerId: number): Promise<void> {
    // TODO: Zaimplementować endpoint DELETE /api/offers/unknown/{offerId}
    // await customAxios.delete(`offers/unknown/${offerId}`);
    void offerId;
}

export async function searchComponentsApi(
    _query: string,
    _type?: ComponentTypeEnum
): Promise<ComponentSearchResultDto[]> {
    // TODO: Zaimplementować endpoint GET /api/components/search?query=X&type=Y
    // const params = new URLSearchParams({ query: _query });
    // if (_type) params.append("type", _type);
    // const res = await customAxios.get(`components/search?${params}`);
    // return res.data;
    return [];
}

export async function createComponentAndAssignApi(
    _componentData: Record<string, unknown>,
    _offerId: number
): Promise<void> {
    // TODO: Zaimplementować endpoint POST /api/offers/unknown/create-and-assign
    // await customAxios.post("offers/unknown/create-and-assign", {
    //     component: _componentData,
    //     offerId: _offerId,
    // });
}

export type { UnknownOfferDto };
