import {useQuery} from "@tanstack/react-query";
import {getComponentsStatsApi} from "../api/GetComponentsStatsApi.ts";

export const useGetComponentsStats = () => {
    return useQuery({
        queryKey: ["componentsStats"],
        queryFn: getComponentsStatsApi
    });
};