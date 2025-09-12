import { useState,useRef } from 'react';
import instance from '../../../components/instance';
import { useWebSocketStomp } from '../../../hooks/webSocketHook';
const OffersComponent = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const webSocketUrl = 'ws://localhost:8080/offers';

    const clientRef = useWebSocketStomp({
        url: webSocketUrl,
        topic: '/topic/offers',
        onMessage: (message) => {

            setMessages((prev) => [...prev, message.body]);
            setIsUpdating(false);
        },
    });

    const handleFetchOffers = () => {
        setIsUpdating(true);
        clientRef.current?.publish({
            destination: '/app/offers',
            body: '',
        });
    };

    return (
        <div className="p-6">
            <button
                onClick={handleFetchOffers}
                disabled={isUpdating}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                    isUpdating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-ocean-blue hover:bg-ocean-dark-blue hover:shadow-lg'
                }`}
            >
                {isUpdating ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Pobieranie ofert...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Pobierz oferty
                    </>
                )}
            </button>
            {messages.length > 0 && (
                <div className="mt-4 p-3 rounded-lg text-center text-sm bg-gray-100 text-gray-800">
                    {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OffersComponent;