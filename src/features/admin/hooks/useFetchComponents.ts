import {keepPreviousData, useQuery, useQueryClient} from "@tanstack/react-query";
import {getComponentsApi} from "../api/getComponentsApi.ts";
import {useEffect} from "react";
import type { ComponentTypeEnum } from "../../../types/BaseItemDto.ts";

export const useFetchComponents = (page: number, filters?: {itemType?: ComponentTypeEnum; brand?: string; searchTerm: string}) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["components", page, filters],
        queryFn: () => getComponentsApi(page, filters),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (query.data?.hasMore) {
            queryClient.prefetchQuery({
                queryKey: ["components", page + 1, filters],
                queryFn: () => getComponentsApi(page + 1, filters),
            });
        }
    }, [page, query.data, queryClient, filters]);

    return query;
};