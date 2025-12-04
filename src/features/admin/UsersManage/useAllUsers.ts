import {useQuery} from "@tanstack/react-query";
import {getAllUsersApi} from "./geAllUsersApi.ts";

export const useAllUsers = () => {
    return useQuery({
        queryKey: ["useAllUsers"],
        queryFn: () => getAllUsersApi()
    })
}