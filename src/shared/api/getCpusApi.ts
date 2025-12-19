import customAxios from "../../lib/customAxios.tsx";

export const getCpusApi = async (): Promise<string[]> => {
    const result = await customAxios.get("/api/components/cpus");
    return result.data;
}