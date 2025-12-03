import {useQuery} from "@tanstack/react-query";
import {getAllGpusApi} from "../api/getAllGpusApi.ts";

export const useAllGpus = () => {
    return useQuery({
        queryKey: ["allGpus"],
        queryFn: () => getAllGpusApi()
    });
};