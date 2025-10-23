import {type OfferUpdateInfo} from "../../../types/OfferUpdateInfo.ts";
import {atom} from "jotai";

export const offersUpdateInfoAtom = atom< OfferUpdateInfo[] | null>(null);