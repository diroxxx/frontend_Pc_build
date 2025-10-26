import {QueryClient, useQuery, useQueryClient} from "@tanstack/react-query";
import {type RefObject, useCallback, useEffect, useMemo, useRef} from "react";
import type {OfferUpdateInfo} from "../../../types/OfferUpdateInfo.ts";
import type {OfferShopUpdate} from "../../../types/OfferShopUpdate.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";
import {useWebSocketStomp} from "../../../hooks/webSocketHook.ts";
import type {IMessage} from "@stomp/stompjs";
export function useShopOfferUpdates(updateId: number, isActive: boolean) {
    const queryClient = useQueryClient();
    const topic = `/topic/offers/${updateId}`;
    // const url = "ws://localhost:8080/offers";
    const url = "http://localhost:8080/offers";

    const onMessage = useCallback((msg: IMessage) => {
        try {
            const parsed: OfferShopUpdate = JSON.parse(msg.body);

            queryClient.setQueryData<OfferUpdateInfo[]>(["offersUpdates"], (old = []) =>
                old.map((update) =>
                    update.id === updateId
                        ? {
                            ...update,
                            shops: mergeOrAddShopUpdate(update.shops ?? [], parsed),
                        }
                        : update
                )
            );

            showToast.success(`Zaktualizowano dane dla sklepu: ${parsed.shopName}`);
        } catch (err) {
            console.error("WebSocket parse error:", err);
        }
    }, [queryClient, updateId]);

    useWebSocketStomp({
        url,
        topic,
        onMessage,
    });

    useEffect(() => {
        if (!isActive) {
            console.log(`Nieaktywny updateId=${updateId}, pomijam subskrypcję`);
            return;
        }

        console.log(`Subskrybowano updateId=${updateId}`);

        return () => {
            console.log(`Zakończono subskrypcję dla updateId=${updateId}`);
        };
    }, [isActive, updateId]);
}

function mergeOrAddShopUpdate(
    existing: OfferShopUpdate[],
    incoming: OfferShopUpdate
): OfferShopUpdate[] {
    const idx = existing.findIndex((s) => s.shopName === incoming.shopName);
    if (idx !== -1) {
        const updated = [...existing];
        updated[idx] = { ...updated[idx], ...incoming };
        return updated;
    }
    return [...existing, incoming];
}