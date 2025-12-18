import type {Shop} from "../../../../shared/atoms/shopAtom.tsx";

export type OfferUpdateConfigDto = {
    intervalInMinutes: string | null;
    type: OfferUpdateType;
    shops: Shop[];
}
export type OfferUpdateType = 'MANUAL' | 'AUTOMATIC';
