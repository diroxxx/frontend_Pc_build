import {atom} from 'jotai';

export type computer= {
    price: number;
    isvisible: boolean;
    offerId: number
}

export const listOfComputers = atom<computer[]>([]);