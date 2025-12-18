import customAxios from "../../../lib/customAxios.tsx";
export async function getBrandsApi(): Promise<string[]> {
    const res = await customAxios.get('/api/components/brands');
    return res.data;
}