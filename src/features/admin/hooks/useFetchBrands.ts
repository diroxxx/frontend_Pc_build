import { getBrandsApi } from "../../pcParts/api/getComponentsBrandsApi.ts";
import { useQuery } from "@tanstack/react-query";
export const useFetchBrands = () => {
    return useQuery({
        queryKey: ["brands"],
        queryFn: getBrandsApi,
        // staleTime: 10 * 60 * 1000,
    });
}