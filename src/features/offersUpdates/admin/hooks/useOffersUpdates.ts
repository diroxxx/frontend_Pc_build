import { useCallback} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOfferUpdates } from "../api/offerUpdateApi.ts";
import {type OfferUpdateInfo } from '../dto/OfferUpdateInfo.ts'
import { useWebSocketStomp } from '../../../../shared/hooks/webSocketHook.ts';
import { showToast } from "../../../../lib/ToastContainer.tsx";
import {useGetComponentsStats} from "./useGetComponentsStats.ts";

export function useOfferUpdates() {
    const queryClient = useQueryClient();
    const webSocketUrl = "http://localhost:8080/offers";
    const {refetch} = useGetComponentsStats();

    const query = useQuery<OfferUpdateInfo[]>({
        queryKey: ["offersUpdates"],
        queryFn: fetchOfferUpdates,
    });

    const client = useWebSocketStomp({
        url: webSocketUrl,
        topic: "/topic/offers",
        onMessage: (msg) => {
            try {
                const parsed: OfferUpdateInfo = JSON.parse(msg.body);
                queryClient.setQueryData<OfferUpdateInfo[]>(["offersUpdates"], (old = []) => {
                    const existing = old.find((o) => o.id === parsed.id);
                    if (existing) {
                        return old.map((o) => (o.id === parsed.id ? { ...o, ...parsed } : o));
                    }
                    return [...old, parsed];
                });

                // queryClient.invalidateQueries({ queryKey: ["componentsStats"] });
                refetch();
                
            } catch (err) {
                console.error("WebSocket parse error:", err);
            }
        },
    });

    const handleManualFetchOffers = useCallback(
        (shops: string[]) => {
            if (!client || !client.connected) {
                showToast.error("Brak połączenia z serwerem WebSocket.");
                return;
            }
            client.publish({
                destination: "/app/offers",
                body: JSON.stringify({ shops }),
            });
            showToast.info("Żądanie aktualizacji wysłane");
        },
        [client]
    );

    return { ...query, handleManualFetchOffers };
}
