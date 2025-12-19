import customAxios from "../../../../lib/customAxios.tsx";
import{type OfferUpdateInfo} from "../dto/OfferUpdateInfo.ts";

export async function fetchOfferUpdates(): Promise<OfferUpdateInfo[]> {
    const response = await customAxios.get<OfferUpdateInfo[]>("/api/offersUpdates");
    return response.data;
}