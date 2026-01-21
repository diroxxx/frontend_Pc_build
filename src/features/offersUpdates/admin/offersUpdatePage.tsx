import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { fetchShopsAtom, shopsAtom } from '../../../shared/atoms/shopAtom.tsx';
import { showToast } from "../../../lib/ToastContainer.tsx";
import {useOfferUpdates} from "./hooks/useOffersUpdates.ts";
import OffersUpdatesView from "./components/OffersUpdatesView.tsx";
import {LoadingSpinner} from "../../../assets/components/ui/LoadingSpinner.tsx";
import ComponentsStatsPanel from "./components/ComponentsStatsPanel.tsx";
import { putOfferUpdateConfig } from './api/putOfferUpdateConfig.ts';
import type {OfferUpdateConfigDto, OfferUpdateType} from "./dto/OfferUpdateConfigDto.ts";
import {IntervalsMap} from "./dto/intervalsMap.ts";
import {useGetLastUpdateType} from "./hooks/useGetLastUpdateType.ts";

interface Shop {
    name: string;
    [key: string]: any;
}
interface ShopSelectorProps {
    shops: Shop[];
    selectedShopNames: string[];
    onShopToggle: (shopName: string) => void;
    isDisabled: boolean;
}
const ShopSelector  = ({ shops, selectedShopNames, onShopToggle, isDisabled }: ShopSelectorProps) => {
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
                        onClick={() => !isDisabled && onShopToggle(shop.name)}
                        className={`px-3 py-1.5 rounded-md border transition-all duration-200 text-sm font-medium ${
                            isDisabled 
                                ? 'cursor-not-allowed opacity-50' 
                                : 'cursor-pointer'
                        } ${
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

const updateTypeLabel: Record<string, string> = {
    MANUAL: "Manualna",
    AUTOMATIC: "Automatyczna",
}
const OffersComponent = () => {
    const [updateType, setUpdateType] = useState<OfferUpdateType>('MANUAL');
    const [shops] = useAtom(shopsAtom);
    const [, fetchShops] = useAtom(fetchShopsAtom);
    const [offerUpdateConfig, setOfferUpdateConfig] = useState<OfferUpdateConfigDto>();
    const [selectedShopNames, setSelectedShopNames] = useState<string[]>([]);
    const [interval, setInterval] = useState<string>();

    const { data: updates, isLoading, error, handleManualFetchOffers } = useOfferUpdates();
    const {data: lastOferUpdateType} = useGetLastUpdateType();
    const lastType = lastOferUpdateType || "MANUAL";

    useEffect(() => {
        fetchShops();
    }, [fetchShops]);

    useEffect(() => {
        if (offerUpdateConfig?.shops) {
            setSelectedShopNames(offerUpdateConfig.shops.map(s => s.name));
        }
        if (offerUpdateConfig?.intervalInMinutes) {
            setInterval(offerUpdateConfig.intervalInMinutes);
        }
        if (offerUpdateConfig?.type) {
            setUpdateType(offerUpdateConfig.type);
        }
    }, [offerUpdateConfig]);

    useEffect(() => {
    if (updateType === 'AUTOMATIC' && !interval) {
        const firstKey = Object.keys(IntervalsMap)[0];
        setInterval(firstKey);
    }
}, [updateType, interval]);

    useEffect(() => {
        const saved = localStorage.getItem("selectedShops");
        if (saved) {
            setSelectedShopNames(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedShops", JSON.stringify(selectedShopNames));
    }, [selectedShopNames]);

    const hasOngoingUpdate = useMemo(() => {
        if (!updates) return false;
        
        return updates.some((update) => {
            const relevantShops = update.shops?.filter(s => 
                selectedShopNames.includes(s.shopName)
            );
            
            if (!relevantShops?.length) return false;
            
            return relevantShops.some(shop => shop.status === 'RUNNING');
        });
    }, [updates, selectedShopNames]);

    const handleUpdateTypeToggle = useCallback(() => {
        const newType = updateType === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC';
        setUpdateType(newType);
        
        if (newType === 'AUTOMATIC') {
            setSelectedShopNames([]);
        }
        
        setOfferUpdateConfig(prev =>
            prev
                ? { ...prev, type: newType, shops: newType === 'AUTOMATIC' ? [] : prev.shops }
                : { type: newType, intervalInMinutes: null, shops: [] }
        );
    }, [updateType, setOfferUpdateConfig]);

    const handleShopToggle = useCallback((shopName: string) => {
        setSelectedShopNames(prev =>
            prev.includes(shopName)
                ? prev.filter(n => n !== shopName)
                : [...prev, shopName]
        );
    }, []);

    const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInterval(e.target.value);
    };

const saveOfferUpdateConfig = useCallback(async () => {
    try {
        if (updateType !== 'AUTOMATIC') {
            showToast.error("Ta funkcja działa tylko dla automatycznej aktualizacji");
            return;
        }
        if (!interval) {
            showToast.error("Proszę wybrać prawidłowy interwał aktualizacji");
            return;
        }
        await putOfferUpdateConfig(interval);
        showToast.success("Konfiguracja automatycznej aktualizacji zapisana!");
    } catch (error: any) {
        console.error('Błąd podczas zapisywania konfiguracji:', error);
        showToast.error(error.response?.data?.message || 'Błąd podczas zapisywania konfiguracji');
    }
}, [updateType, interval]);
    

    return (
        <div className="space-y-5 p-5">
            <span className="text-sm font-medium rounded-lg bg-ocean-blue text-ocean-white shadow-sm border border-gray-200 p-3 mb-6 ">
                Ostatnia aktualizacja - {updateTypeLabel[lastType]}

            </span>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-5">


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
                            disabled={hasOngoingUpdate}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:ring-offset-2 ${
                                updateType === 'AUTOMATIC'
                                    ? 'bg-ocean-blue'
                                    : 'bg-gray-200'
                            } ${hasOngoingUpdate ? 'opacity-50 cursor-not-allowed' : ''}  `}
                            title={hasOngoingUpdate ? "Nie można przełączyć na automatyczną podczas trwającej ręcznej aktualizacji" : ""}

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {updateType === 'MANUAL' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-midnight-dark mb-4">Aktualizacja manualna</h3>
                            <div className="mb-6">
                                <p className="block text-sm font-medium text-gray-700 mb-2">
                                    Wybierz sklepy do aktualizacji
                                </p>
                                <ShopSelector
                                    shops={shops}
                                    selectedShopNames={selectedShopNames}
                                    onShopToggle={handleShopToggle}
                                    isDisabled={hasOngoingUpdate}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleManualFetchOffers(selectedShopNames)}
                                    disabled={hasOngoingUpdate || selectedShopNames.length === 0}
                                    className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                                        hasOngoingUpdate
                                            ? "bg-gray-200 cursor-not-allowed"
                                            : "bg-gradient-blue-horizontal hover:bg-gradient-blue-horizontal-hover shadow-lg hover:shadow-xl"
                                    }`}
                                >
                                    {hasOngoingUpdate ? (
                                        <>
                                            <LoadingSpinner size={32} />
                                        </>
                                    ) : (
                                        <>
                                            Pobierz oferty
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {updateType === 'AUTOMATIC' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg mb-3">Konfiguracja automatycznej aktualizacji</h3>
                            <div className="space-y-2">
                                <div>
                                    <p className={"text-sm font-medium text-gray-600 mb-1"}>Aktualizacje bedą zawierały wszystkie dostępne sklepy</p>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Interwał aktualizacji
                                    </label>
                                    <select
                                        value={interval}
                                        onChange={handleIntervalChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors"
                                    >
                                        {Object.entries(IntervalsMap).map(([key,interval]) => (
                                            <option key={interval} value={ key}>
                                                {key}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {updateType != 'AUTOMATIC' &&  <div className="mb-6">
                                    <p className="block text-sm font-medium text-gray-700 mb-2">
                                        Wybierz sklepy do aktualizacji
                                    </p>
                                    <ShopSelector
                                        shops={shops}
                                        selectedShopNames={selectedShopNames}
                                        onShopToggle={handleShopToggle}
                                        isDisabled={hasOngoingUpdate}
                                    />
                                </div>}
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
                </div>

                <div className="lg:col-span-1">
                    <div className="h-full">
                        <ComponentsStatsPanel />
                    </div>
                </div>
            </div>

            <OffersUpdatesView />
        </div>
    );
};

export default OffersComponent;