import { useState, useRef, useEffect,useMemo, useCallback } from 'react';
import instance from '../../../../components/instance';
import { useWebSocketStomp } from '../../../../hooks/webSocketHook';
import { useAtom } from 'jotai';
import { fetchShopsAtom, shopsAtom } from '../../../../atomContext/shopAtom';
import { fetchOfferUpdatesAtom, fetchOfferUpdateConfigAtom, type OfferUpdate, offerUpdateConfigAtom, offerUpdatesAtom, type OfferUpdateType } from '../../../../atomContext/adminAtom';
import {showToast} from "../../../../components/ui/ToastProvider/ToastContainer.tsx";

// Shop Selector Component
interface ShopSelectorProps {
    shops: any[];
    selectedShops: any[];
    onShopSelection: (shopName: string) => void;
}

const ShopSelector: React.FC<ShopSelectorProps> = ({ shops, selectedShops, onShopSelection }) => {
    if (shops.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                Brak dostępnych sklepów. Proszę dodać sklepy w sekcji zarządzania sklepami.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {shops.map(shop => {
                const isSelected = selectedShops.some(s => s.name === shop.name);
                return (
                    <span
                        key={shop.name}
                        onClick={() => onShopSelection(shop.name)}
                        className={`cursor-pointer px-3 py-1.5 rounded-md border transition-all duration-200 text-sm font-medium ${
                            isSelected
                                ? 'bg-ocean-blue text-white border-ocean-blue shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                    >
                        {shop.name}
                    </span>
                );
            })}
        </div>
    );
};


const OffersComponent = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const webSocketUrl = useMemo(() => 'ws://localhost:8080/offers', []);

    const intervalsInMinutes = [5, 15, 30, 60, 120, 240, 1440]; // in minutes

    const [updateType, setUpdateType] = useState<OfferUpdateType>('MANUAL');

    const [offerUpdates] = useAtom(offerUpdatesAtom);
    const [, fetchOfferUpdates] = useAtom(fetchOfferUpdatesAtom);

    const [shops] = useAtom(shopsAtom);
    const [, fetchShops] = useAtom(fetchShopsAtom);

    const [offerUpdateConfig, setOfferUpdateConfig] = useAtom(offerUpdateConfigAtom);
    const [, fetchOfferUpdateConfig] = useAtom(fetchOfferUpdateConfigAtom);

    const [selectedShops, setSelectedShops] = useState<string[]>([]);
    const [intervalInMinutes, setIntervalInMinutes] = useState<number>(60);


    useEffect(() => {
        fetchShops();
        fetchOfferUpdateConfig();
    }, [fetchShops, fetchOfferUpdateConfig]);


    const saveOfferUpdateConfig = async () => {
        try{
            if (!offerUpdateConfig) {
                showToast.error('No Configuration Found');
            }
            const configToSave = {
                ...offerUpdateConfig,
                intervalInMinutes: offerUpdateConfig?.type === 'MANUAL'
                    ? null
                    : offerUpdateConfig.intervalInMinutes,
            };



            const response = await instance.post('/admin/OfferUpdateConfig', configToSave);
            showToast.success(response.data.message);
        }catch (error) {
            showToast.error('Error saving configuration');
            return false;
        }
    }

    // Initialize offerUpdateConfig if it doesn't exist
    useEffect(() => {
        if (!offerUpdateConfig && shops.length > 0) {
            setOfferUpdateConfig({
                type: updateType,
                intervalInMinutes: 60,
                shops: []
            });
        }
    }, [shops, offerUpdateConfig, updateType, setOfferUpdateConfig]);


interface WebSocketMessage {
    body: string;
}


// interface OffersByShop {
//     [shopName: string]: {
//         [category: string]: number;
//         []
//     };
// }


const onWebSocketGetOffers = useCallback((message: WebSocketMessage) => {
    try {
        const parsed: Record<string, unknown> = JSON.parse(message.body);
        setMessages((prev: string[]) => [...prev, parsed as unknown as string]);
    } catch (error) {
        setMessages((prev: string[]) => [...prev, message.body]);
    }
    setIsUpdating(false);
}, []);
    
     const clientRef = useWebSocketStomp({
        url: webSocketUrl,
        topic: '/topic/offers',
        onMessage: onWebSocketGetOffers,
    }); 

    const handleManualFetchOffers = useCallback(async () => {

        try {

            await saveOfferUpdateConfig();

            setIsUpdating(true);
            clientRef.current?.publish({
                destination: '/app/offers',
                body: JSON.stringify({
                    shops: offerUpdateConfig?.shops?.map(shop => shop.name) || [],
                }),
            });
        } catch (error) {
            showToast.error('Error fetching offers');
            setIsUpdating(false);
        }
    }, [offerUpdateConfig]);


const handleShopSelection = useCallback((shopName: string) => {
        console.log('Kliknięto sklep:', shopName);
        console.log('Aktualna konfiguracja:', offerUpdateConfig);
        
        setOfferUpdateConfig(prevConfig => {
            if (!prevConfig) {
                console.log('Brak konfiguracji, tworzę nową');
                const shop = shops.find(shop => shop.name === shopName);
                return {
                    type: updateType,
                    intervalInMinutes: null,
                    shops: shop ? [shop] : []
                };
            }
            
            const isSelected = prevConfig.shops.some(shop => shop.name === shopName);
            console.log('Czy sklep jest wybrany:', isSelected);
            
            const updatedShops = isSelected
                ? prevConfig.shops.filter(shop => shop.name !== shopName)
                : [...prevConfig.shops, shops.find(shop => shop.name === shopName)!].filter(Boolean);

            console.log('Zaktualizowane sklepy:', updatedShops);

            return {
                ...prevConfig,
                shops: updatedShops,
            };
        });
    }, [shops, updateType]);

    return (
        <div className="space-y-6 p-6">
            {/* Header with Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-midnight-dark">Aktualizacja ofert</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Zarządzaj procesem aktualizacji ofert ze sklepów
                        </p>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium transition-colors ${updateType === 'MANUAL' ? 'text-ocean-blue' : 'text-gray-500'}`}>
                            Ręczna
                        </span>
                        <button
                           onClick={() => {
                            setUpdateType(updateType === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC');
                            if (offerUpdateConfig) {
                                setOfferUpdateConfig({
                                ...offerUpdateConfig,
                                type: updateType === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC'
                                });
                            }
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:ring-offset-2 ${
                                updateType === 'AUTOMATIC' 
                                    ? 'bg-ocean-blue' 
                                    : 'bg-gray-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    updateType === 'AUTOMATIC' ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className={`text-sm font-medium transition-colors ${updateType === 'AUTOMATIC' ? 'text-ocean-blue' : 'text-gray-500'}`}>
                            Automatyczna
                        </span>
                    </div>
                </div>
            </div>

            {/* Manual Mode */}
            {updateType === 'MANUAL' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-midnight-dark mb-4">Aktualizacja manualna</h3>
                    
                     {/* Shop Selection */}
                    <div className="mb-6">
                        <p className="block text-sm font-medium text-gray-700 mb-2">
                            Wybierz sklepy do aktualizacji
                        </p>
                        <ShopSelector 
                            shops={shops}
                            selectedShops={offerUpdateConfig?.shops || []}
                            onShopSelection={handleShopSelection}
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={handleManualFetchOffers}
                            disabled={isUpdating}
                            className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                                isUpdating
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-blue-horizontal hover:bg-gradient-blue-horizontal-hover shadow-lg hover:shadow-xl'
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
                    </div>

                    {/* Manual Results */}
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

            {/* Automatic Mode */}
            {updateType === 'AUTOMATIC' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-midnight-dark mb-6">Konfiguracja automatycznej aktualizacji</h3>
                    
                    <div className="space-y-6">
                        {/* Interval Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interwał aktualizacji
                            </label>
                            <select
                                value={offerUpdateConfig?.intervalInMinutes || undefined}
                                onChange={(e) => {
                                    const newInterval = Number(e.target.value);
                                    if (offerUpdateConfig) {
                                        setOfferUpdateConfig({ 
                                            ...offerUpdateConfig, 
                                            intervalInMinutes: newInterval
                                        });
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors"
                            >
                                {intervalsInMinutes.map((interval) => (
                                    <option key={interval} value={interval}>
                                        {interval < 60 ? `${interval} minut` : 
                                         interval === 60 ? '1 godzina' :
                                         interval === 120 ? '2 godziny' :
                                         interval === 240 ? '4 godziny' :
                                         interval === 1440 ? '24 godziny' : `${interval} minut`}
                                    </option>
                                ))}
                            </select>
                        </div>

                      {/* Shop Selection */}
                    <div className="mb-6">
                        <p className="block text-sm font-medium text-gray-700 mb-2">
                            Wybierz sklepy do aktualizacji
                        </p>
                        <ShopSelector 
                            shops={shops}
                            selectedShops={offerUpdateConfig?.shops || []}
                            onShopSelection={handleShopSelection}
                        />
                    </div>

                        {/* Save Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={async () => {
                                    try {
                                        await saveOfferUpdateConfig();
                                      showToast.success("Configuration saved successfully");
                                    } catch (error) {
                                        showToast.error('Error saving configuration');
                                    }
                                }}
                                className="w-full py-3 px-4 bg-gradient-blue-horizontal text-white rounded-lg hover:bg-gradient-blue-horizontal-hover font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Zapisz konfigurację
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OffersComponent;
