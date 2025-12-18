import {useQuery} from "@tanstack/react-query";
import {getOffersCount} from "../features/offers/api/getOffersCount.ts";

export const useOffersCount = () =>  {
    return useQuery<number>({
        queryKey: ["offersCount"],
        queryFn:  () => getOffersCount()
    });
};