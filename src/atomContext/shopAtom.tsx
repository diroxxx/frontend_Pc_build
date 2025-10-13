import { atom } from "jotai";
import instance from "../components/instance"

export type Shop = {
    name: string;
}
export const shopsAtom = atom<Shop[]>([]);

export const fetchShopsAtom = atom(
  null,
  async (_get, set) => {
    try {

      const response = await instance.get('api/shops');
      const shops: Shop[] = response.data;

      set(shopsAtom, shops);

    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  }
);