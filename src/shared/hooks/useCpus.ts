import {getCpusApi} from "../api/getCpusApi.ts";
import {useQuery} from "@tanstack/react-query";

export const useCpus = () => {
    return useQuery({
        queryKey: ["cpus"],
        queryFn:  getCpusApi
    })
}