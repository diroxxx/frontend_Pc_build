import { atom } from "jotai";

export type User =  {
    name: string;
    email: string;
    role: number;
}

export const usersListAtom = atom<User[]>([]);

