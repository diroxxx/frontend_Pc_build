import {keepPreviousData, useQuery, useQueryClient} from "@tanstack/react-query";
import {getComponentsApi} from "../api/getComponentsApi.ts";
import {useEffect} from "react";

export const useFetchComponents = (page: number) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["components", page],
        queryFn: () => getComponentsApi(page),
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });

    useEffect(() => {
        if (query.data?.hasMore) {
            queryClient.prefetchQuery({
                queryKey: ["components", page + 1],
                queryFn: () => getComponentsApi(page + 1),
            });
        }
    }, [page, query.data, queryClient]);

    return query;
};