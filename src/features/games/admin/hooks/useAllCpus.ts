import {useQuery} from "@tanstack/react-query";
import {getAllCpusApi} from "../api/getAllCpusApi.ts";

export const useAllCpus = () => {
    return useQuery({
        queryKey: ["allCpus"],
        queryFn: () => getAllCpusApi()
    });
};