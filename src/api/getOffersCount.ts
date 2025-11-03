import customAxios from "../lib/customAxios.tsx";

export async function getOffersCount (): Promise<number> {
    const res = await customAxios.get('/offers/count');
    return res.data;
}