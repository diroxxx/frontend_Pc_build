import { atom } from "jotai";
import customAxios from "../../lib/customAxios.tsx"

export type Shop = {
    name: string;
}
export const shopsAtom = atom<Shop[]>([]);

export const fetchShopsAtom = atom(
  null,
  async (_get, set) => {
    try {
      const response = await customAxios.get('api/shops');
      const shops: Shop[] = response.data;

      set(shopsAtom, shops);

    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  }
);