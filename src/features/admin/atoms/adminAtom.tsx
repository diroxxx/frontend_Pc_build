import {atom, useSetAtom} from "jotai";
import {type Shop } from "./shopAtom.tsx";
import customAxios from "../../../lib/customAxios.tsx";
import {useCallback} from "react";
export type User =  {
    username: string;
    email: string;
    role: string;
}
// import {type User} from "./userAtom.tsx";

export const usersListAtom = atom<User[]>([]);

export const useFetchAllUsers = () => {
    const setUsers = useSetAtom(usersListAtom);

    return useCallback( async () => {
       await customAxios.get("admin/users")
            .then(response => {
                console.log("Fetched users:", response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, [setUsers]);
};


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
    // const response = await instance.get('/admin/offer-updates');
    // set(offerUpdatesAtom, response.data);
  }
);