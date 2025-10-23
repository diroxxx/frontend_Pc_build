import { useState, useEffect, useMemo, useCallback } from 'react';
import customAxios from '../../../lib/customAxios.tsx';
import { useWebSocketStomp } from '../../../hooks/webSocketHook.ts';
import { useAtom } from 'jotai';
import { fetchShopsAtom, shopsAtom } from '../atoms/shopAtom.tsx';
import { fetchOfferUpdatesAtom, fetchOfferUpdateConfigAtom, offerUpdateConfigAtom, offerUpdatesAtom, type OfferUpdateType } from '../atoms/adminAtom.tsx';
import { showToast } from "../../../lib/ToastContainer.tsx";
import toast from "react-hot-toast";
import {useOfferUpdates} from "../hooks/useOffersUpdates.ts";
import OffersUpdatesView from "./OffersUpdatesView.tsx";

// Shop Selector Component
interface Shop {
    name: string;
    [key: string]: any;
}
interface ShopSelectorProps {
    shops: Shop[];
    selectedShopNames: string[];
    onShopToggle: (shopName: string) => void;
}
const ShopSelector: React.FC<ShopSelectorProps> = ({ shops, selectedShopNames, onShopToggle }) => {
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
                const isSelected = selectedShopNames.includes(shop.name);
                return (
                    <span
                        key={shop.name}
                        onClick={() => onShopToggle(shop.name)}
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

const intervalsInMinutes = [5, 15, 30, 60, 120, 240, 1440];

const OffersComponent = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const webSocketUrl = useMemo(() => 'ws://localhost:8080/offers', []);
    const [updateType, setUpdateType] = useState<OfferUpdateType>('MANUAL');
    const [shops] = useAtom(shopsAtom);
    const [, fetchShops] = useAtom(fetchShopsAtom);
    const [offerUpdateConfig, setOfferUpdateConfig] = useAtom(offerUpdateConfigAtom);
    const [, fetchOfferUpdateConfig] = useAtom(fetchOfferUpdateConfigAtom);
    const [selectedShopNames, setSelectedShopNames] = useState<string[]>([]);
    const [intervalInMinutes, setIntervalInMinutes] = useState<number>(60);

    const { data, isLoading, error, handleManualFetchOffers } = useOfferUpdates();


    useEffect(() => {
        fetchShops();
        fetchOfferUpdateConfig();
    }, [fetchShops, fetchOfferUpdateConfig]);

    useEffect(() => {
        if (offerUpdateConfig?.shops) {
            setSelectedShopNames(offerUpdateConfig.shops.map(s => s.name));
        }
    }, [offerUpdateConfig]);

    const handleUpdateTypeToggle = useCallback(() => {
        setUpdateType(prev => prev === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC');
        setOfferUpdateConfig(prev =>
            prev
                ? { ...prev, type: prev.type === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC' }
                : { type: 'MANUAL', intervalInMinutes: null, shops: [] }
        );
    }, [setOfferUpdateConfig]);

    const handleShopToggle = useCallback((shopName: string) => {
        setSelectedShopNames(prev =>
            prev.includes(shopName)
                ? prev.filter(n => n !== shopName)
                : [...prev, shopName]
        );
    }, []);

    const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIntervalInMinutes(Number(e.target.value));
    };

    const getConfigToSave = useCallback(() => {
        return {
            type: updateType,
            intervalInMinutes: updateType === 'MANUAL' ? null : intervalInMinutes,
            shops: shops.filter(shop => selectedShopNames.includes(shop.name)),
        };
    }, [updateType, intervalInMinutes, shops, selectedShopNames]);

    const saveOfferUpdateConfig = useCallback(async () => {
        try {
            const configToSave = getConfigToSave();
            const response = await customAxios.post('/admin/OfferUpdateConfig', configToSave);
            console.log("Odpowiedź backendu:", response.data);

            showToast.success(response.data.message || "Configuration saved!");
            setOfferUpdateConfig(configToSave);
        } catch (error) {
            showToast.error('Error saving configuration');
            return false;
        }
    }, [getConfigToSave, setOfferUpdateConfig]);

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
                    <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium transition-colors ${updateType === 'MANUAL' ? 'text-ocean-blue' : 'text-gray-500'}`}>
                            Ręczna
                        </span>
                        <button
                            onClick={handleUpdateTypeToggle}
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
                            selectedShopNames={selectedShopNames}
                            onShopToggle={handleShopToggle}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleManualFetchOffers(selectedShopNames)}
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
                    {/*<OffersUpdatesView/>*/}
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
                                value={intervalInMinutes}
                                onChange={handleIntervalChange}
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
                                selectedShopNames={selectedShopNames}
                                onShopToggle={handleShopToggle}
                            />
                        </div>
                        {/* Save Button */}
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={saveOfferUpdateConfig}
                                className="w-full py-3 px-4 bg-gradient-blue-horizontal text-white rounded-lg hover:bg-gradient-blue-horizontal-hover font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Zapisz konfigurację
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <OffersUpdatesView/>
        </div>
    );
};

export default OffersComponent;