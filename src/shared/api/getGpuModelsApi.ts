import customAxios from "../../lib/customAxios.tsx";

export const getGpuModelsApi = async ():Promise<string[]> => {
    const result = await customAxios.get("/api/components/gpuModels");
    return result.data;
}