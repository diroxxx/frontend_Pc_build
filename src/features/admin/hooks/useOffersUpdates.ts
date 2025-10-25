// src/hooks/useOffersUpdates.ts
import {useEffect, useCallback, useMemo} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOfferUpdates } from "../api/offerUpdateApi.ts";
import {type OfferUpdateInfo } from '../../../types/OfferUpdateInfo.ts'
import { useWebSocketStomp } from '../../../hooks/webSocketHook';
import { showToast } from "../../../lib/ToastContainer";
// import SockJS from "sockjs-client";

export function useOfferUpdates() {
    const queryClient = useQueryClient();
    const webSocketUrl = "ws://localhost:8080/offers";
    // const socket = new SockJS("http://localhost:8080/offers");

    const query = useQuery<OfferUpdateInfo[]>({
        queryKey: ["offersUpdates"],
        queryFn: fetchOfferUpdates,
        // staleTime: 10_000,
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
                showToast.info(`Nowa aktualizacja #${parsed.id}`);
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
