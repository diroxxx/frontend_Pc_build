import customAxios from "../../../../lib/customAxios.tsx";
import{type OfferUpdateInfo} from "../../../../types/OfferUpdateInfo.ts";

export async function fetchOfferUpdates(): Promise<OfferUpdateInfo[]> {
    const response = await customAxios.get<OfferUpdateInfo[]>("/offers/updates");
    return response.data;
}