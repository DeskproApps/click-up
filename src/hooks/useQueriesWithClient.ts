import { useQueries } from "@tanstack/react-query";
import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

const useQueriesWithClient = <TQueryFnData = null>(
    queries: Array<{
        queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
    } & Omit<UseQueryOptions<TQueryFnData, unknown, TQueryFnData, readonly unknown[]>, "queryFn">>,
): Array<UseQueryResult<TQueryFnData>> => {
    const { client } = useDeskproAppClient();

    return useQueries({
        queries: queries?.map(({ queryFn, ...options }) => ({
            queryFn: () => (client && queryFn(client)),
            ...(options ?? {}),
            enabled: options?.enabled === undefined ? !! client : (client && options?.enabled),
        }) as UseQueryOptions<TQueryFnData, unknown, TQueryFnData, readonly unknown[]>) ?? []
    });
};

export { useQueriesWithClient };
