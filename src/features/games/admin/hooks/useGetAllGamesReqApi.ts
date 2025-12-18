import {useQuery} from "@tanstack/react-query";
import {getAllGamesReqApi} from "../api/getAllGamesReqApi.ts";

export const useGetAllGamesReqApi = () => {
    return useQuery( {
        queryKey: ["getAllGamesReqApi"],
        queryFn: () => getAllGamesReqApi()
    });
};