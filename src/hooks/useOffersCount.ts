import {useQuery} from "@tanstack/react-query";
import {getOffersCount} from "../features/admin/api/getOffersCount.ts";

export const useOffersCount = () =>  {
    return useQuery<number>({
        queryKey: ["offersCount"],
        queryFn:  () => getOffersCount()
    });
};