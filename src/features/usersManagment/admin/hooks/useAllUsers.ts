import {useQuery} from "@tanstack/react-query";
import {getAllUsersApi} from "../api/geAllUsersApi.ts";

export const useAllUsers = () => {
    return useQuery({
        queryKey: ["useAllUsers"],
        queryFn: () => getAllUsersApi()
    })
}