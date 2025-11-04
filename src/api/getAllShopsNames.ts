import customAxios from "../lib/customAxios.tsx";

export async function getAllShopsNames (): Promise<string[]> {
    const res = await customAxios.get('/offers/shops');
    return res.data;
}