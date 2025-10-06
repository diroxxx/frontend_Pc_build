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
            try{
                const parsed = JSON.parse(message.body);
                setMessages((prev) => [...prev, parsed]);
                // console.log(parsed.);
            } catch (error) {
            setMessages((prev) => [...prev, message.body]);
            }

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
{messages.length > 0 && (
    <div className="mt-6">
        <div className="bg-gradient-to-r from-ocean-white to-ocean-light-blue rounded-lg p-4 mb-6 border border-ocean-light-blue">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-ocean-blue rounded-full"></div>
                    <h3 className="text-lg font-semibold text-midnight-dark">Statystyki ofert</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Wszystkie oferty:</span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-ocean-dark-blue text-ocean-white">
                        {messages.reduce((total, msg) => 
                            total + Object.values(msg).reduce((shopTotal, cats) => 
                                typeof cats === 'object' && cats !== null 
                                    ? shopTotal + Object.values(cats as Record<string, number>).reduce((sum, count) => Number(sum) + Number(count), 0)
                                    : shopTotal, 0), 0)}
                    </span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            {messages.map((msg, idx) =>
                Object.entries(msg).map(([shop, cats]) =>
                    typeof cats === 'object' && cats !== null ? (
                        <div key={shop + idx} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-ocean-blue rounded-full mr-3"></div>
                                    <h4 className="text-md font-semibold text-midnight-dark">{shop}</h4>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Łącznie:</span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-ocean-dark-blue text-ocean-white">
                                        {Object.values(cats).reduce((sum: number, count) => sum + Number(count), 0)}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {Object.entries(cats).map(([category, count]) => (
                                    <div key={category} className="bg-ocean-white rounded-md px-3 py-2 border border-ocean-light-blue">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-midnight-dark font-medium">{category}</span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-ocean-blue text-ocean-white">
                                                {String(count)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div key={shop + idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-ocean-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-ocean-red font-medium">Błąd danych dla sklepu: {shop}</span>
                            </div>
                        </div>
                    )
                )
            )}
        </div>
    </div>
)}
    </div>
)}
        </div>
    );
};

export default OffersComponent;