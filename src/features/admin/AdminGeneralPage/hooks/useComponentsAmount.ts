import {useQuery} from "@tanstack/react-query";
import {getAmountOfComponentsApi} from "../api/getAmountOfComponentsApi.ts";

export const useComponentsAmount = () => {
    return useQuery({
        queryKey: ["componentsAmount"],
        queryFn: () => getAmountOfComponentsApi()
    });
};