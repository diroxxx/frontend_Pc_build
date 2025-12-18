import {useQuery} from "@tanstack/react-query";
import {getComponentsStatsApi} from "../AdminComponents/api/GetComponentsStatsApi.ts";

export const useGetComponentsStats = () => {
    return useQuery({
        queryKey: ["componentsStats"],
        queryFn: getComponentsStatsApi,
        enabled: true,
    });
};