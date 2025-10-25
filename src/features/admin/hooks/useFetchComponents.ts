import { useQuery, useQueryClient } from "@tanstack/react-query";
import {type BaseItem, type ComponentItem} from "../../../types/BaseItemDto.ts";
import {getComponentsApi} from "../api/getComponentsApi.ts";

export const useFetchComponents = () => {
    const queryClient = useQueryClient();

    return  useQuery<ComponentItem[]>({
        queryKey: ["components"],
        queryFn:  getComponentsApi,
        // staleTime: 10_000,
    });


};