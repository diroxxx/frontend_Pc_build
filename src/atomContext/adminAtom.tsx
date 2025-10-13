import { atom } from "jotai";
import {type Shop } from "./shopAtom";
import instance from "../components/instance";
export type User =  {
    name: string;
    email: string;
    role: number;
}

export const usersListAtom = atom<User[]>([]);

export type OfferUpdateType = 'MANUAL' | 'AUTOMATIC';

export type OfferUpdateConfigAtom = {
    intervalInMinutes: number | null;
    type: OfferUpdateType;
    shops: Shop[];
}
export const offerUpdateConfigAtom = atom<OfferUpdateConfigAtom>();

export const fetchOfferUpdateConfigAtom = atom(
  null, // Initial value (read-only)
  async (get, set) => {
    // const response = await instance.get('/admin/offer-update-config');
    // set(offerUpdateConfigAtom, response.data);
  }
);

export type OfferUpdate = {
    shopName: string;
    startedAt: string;
    finishedAt: string | null;
    offersUpdated: number;
    offersDeleted: number;
    offersAdded: number;
}
export const offerUpdatesAtom = atom<OfferUpdate[]>([]);
export const fetchOfferUpdatesAtom = atom(
  null, // Initial value (read-only)
  async (get, set) => {
    const response = await instance.get('/admin/offer-updates');
    set(offerUpdatesAtom, response.data);
  }
);