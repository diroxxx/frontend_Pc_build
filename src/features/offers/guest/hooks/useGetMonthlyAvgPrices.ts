import { useQuery } from "@tanstack/react-query"
import { getMonthlyAvgPrices } from "../api/getMonthlyAvgPrices"

export const useGetMonthlyAvgPrices = (componentId: number) => {
    return useQuery({
        queryKey: ["monthlyAvgPrices", componentId],
        queryFn: () => getMonthlyAvgPrices(componentId),
    })
}