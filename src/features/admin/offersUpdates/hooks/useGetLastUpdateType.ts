import {useQuery} from "@tanstack/react-query";
import {getLastUpdateTypeApi} from "../api/getLastUpdateTypeApi.ts";

export const useGetLastUpdateType = () => {

    return useQuery({
        queryKey: ["lastUpdateType"],
        queryFn: () => getLastUpdateTypeApi()
    })

}