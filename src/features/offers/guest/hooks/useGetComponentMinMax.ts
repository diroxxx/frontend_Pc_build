import { useQuery } from "@tanstack/react-query"
import { getMinMaxStats } from "../api/getMinMaxStats"

export const useGetComponentMinMax = (componentId: number) => {
    return useQuery({
        queryKey: ["minMax", componentId],
        queryFn: () => getMinMaxStats(componentId),
    })


}