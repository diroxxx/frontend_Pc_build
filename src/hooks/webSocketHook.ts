import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";

type UseWebSocketOptions = {
  url: string;
  topic: string;
  onMessage: (message: IMessage) => void;
};

export function useWebSocketStomp({ url, topic, onMessage }: UseWebSocketOptions) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: url,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    client.onConnect = () => {
      subscriptionRef.current = client.subscribe(topic, onMessage);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
  }, [url, topic, onMessage]);
    return clientRef;
}