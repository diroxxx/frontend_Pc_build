import {useQuery} from "@tanstack/react-query";
import {getGpuModelsApi} from "../api/getGpuModelsApi.ts";

export const useGpuModels = () => {
    return useQuery({
        queryKey: ["gpuModels"],
        queryFn: getGpuModelsApi
    })
}