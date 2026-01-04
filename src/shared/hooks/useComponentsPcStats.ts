import {useQuery} from "@tanstack/react-query";
import {getComponentsPcStatsApi} from "../api/getComponentsPcStatsApi.ts";

export const useComponentsPcStats = () => {

    return useQuery({
        queryKey: ['components-pc-stats'],
        queryFn: () =>  getComponentsPcStatsApi(),
    })
}