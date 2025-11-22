import {atom, useSetAtom} from "jotai";
import customAxios from "../../../lib/customAxios.tsx";
import {useCallback} from "react";
export type User =  {
    username: string;
    email: string;
    role: string;
}

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
export type OfferUpdate = {
    shopName: string;
    startedAt: string;
    finishedAt: string | null;
    offersUpdated: number;
    offersDeleted: number;
    offersAdded: number;
}