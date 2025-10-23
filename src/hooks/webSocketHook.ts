import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import { getAuthToken } from '../lib/Auth.tsx';


type UseWebSocketOptions = {
  url: string;
  topic: string;
  onMessage: (message: IMessage) => void;
};

let globalClient: Client | null = null;

export function useWebSocketStomp({ url, topic, onMessage }: UseWebSocketOptions) {
    const subscriptionRef = useRef<StompSubscription | null>(null);
    const token = getAuthToken();

    useEffect(() => {
        if (!globalClient) {
            globalClient = new Client({
                brokerURL: url,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                reconnectDelay: 5000,
                debug: (str) => console.log("[STOMP]", str),
            });

            globalClient.activate();
        }

        const client = globalClient;

        const onConnect = () => {
            console.log(`Połączono z STOMP (${topic})`);
            subscriptionRef.current = client.subscribe(topic, onMessage);
        };

        client.onConnect = onConnect;

        if (client.connected) {
            onConnect();
        }

        return () => {
            try {
                if (subscriptionRef.current) {
                    subscriptionRef.current.unsubscribe();
                    console.log(`Odsubskrybowano temat: ${topic}`);
                }
            } catch (err) {
                console.warn("Nie udało się odsubskrybować (brak połączenia):", err);
            }
        };
    }, [url, topic, onMessage]);

    return globalClient;
}