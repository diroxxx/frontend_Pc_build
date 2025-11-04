import {useQuery} from "@tanstack/react-query";
import {getAllShopsNames} from "../api/getAllShopsNames.ts";

export const useShopsNames = () =>  {
    return useQuery<string[]>({
        queryKey: ["shopsNames"],
        queryFn:  () => getAllShopsNames()
    });
};