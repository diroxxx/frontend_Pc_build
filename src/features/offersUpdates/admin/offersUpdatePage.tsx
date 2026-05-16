import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { fetchShopsAtom, shopsAtom } from '../../../shared/atoms/shopAtom.tsx';
import { showToast } from "../../../lib/ToastContainer.tsx";
import { useOfferUpdates } from "./hooks/useOffersUpdates.ts";
import OffersUpdatesView from "./components/OffersUpdatesView.tsx";
import { LoadingSpinner } from "../../../assets/components/ui/LoadingSpinner.tsx";
import ComponentsStatsPanel from "./components/ComponentsStatsPanel.tsx";
import { putOfferUpdateConfig } from './api/putOfferUpdateConfig.ts';
import type { OfferUpdateConfigDto, OfferUpdateType } from "./dto/OfferUpdateConfigDto.ts";
import { IntervalsMap } from "./dto/intervalsMap.ts";
import { useGetLastUpdateType } from "./hooks/useGetLastUpdateType.ts";
import { Zap, Save, Clock } from "lucide-react";

interface Shop { name: string; [key: string]: any; }

const updateTypeLabel: Record<string, string> = {
    MANUAL: "Manualna",
    AUTOMATIC: "Automatyczna",
};

const OffersComponent = () => {
    const [updateType, setUpdateType] = useState<OfferUpdateType>('MANUAL');
    const [shops] = useAtom(shopsAtom);
    const [, fetchShops] = useAtom(fetchShopsAtom);
    const [offerUpdateConfig, setOfferUpdateConfig] = useState<OfferUpdateConfigDto>();
    const [selectedShopNames, setSelectedShopNames] = useState<string[]>([]);
    const [interval, setInterval] = useState<string>();

    const { data: updates, handleManualFetchOffers } = useOfferUpdates();
    const { data: lastOfferUpdateType } = useGetLastUpdateType();
    const lastType = lastOfferUpdateType || "MANUAL";

    useEffect(() => { fetchShops(); }, [fetchShops]);

    useEffect(() => {
        if (offerUpdateConfig?.shops) setSelectedShopNames(offerUpdateConfig.shops.map(s => s.name));
        if (offerUpdateConfig?.intervalInMinutes) setInterval(offerUpdateConfig.intervalInMinutes);
        if (offerUpdateConfig?.type) setUpdateType(offerUpdateConfig.type);
    }, [offerUpdateConfig]);

    useEffect(() => {
        if (updateType === 'AUTOMATIC' && !interval)
            setInterval(Object.keys(IntervalsMap)[0]);
    }, [updateType, interval]);

    useEffect(() => {
        const saved = localStorage.getItem("selectedShops");
        if (saved) setSelectedShopNames(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedShops", JSON.stringify(selectedShopNames));
    }, [selectedShopNames]);

    const hasOngoingUpdate = useMemo(() => {
        if (!updates) return false;
        return updates.some(update =>
            update.shops?.filter(s => selectedShopNames.includes(s.shopName))
                         .some(s => s.status === 'RUNNING')
        );
    }, [updates, selectedShopNames]);

    const handleUpdateTypeToggle = useCallback(() => {
        const newType = updateType === 'AUTOMATIC' ? 'MANUAL' : 'AUTOMATIC';
        setUpdateType(newType);
        if (newType === 'AUTOMATIC') setSelectedShopNames([]);
        setOfferUpdateConfig(prev =>
            prev ? { ...prev, type: newType, shops: newType === 'AUTOMATIC' ? [] : prev.shops }
                 : { type: newType, intervalInMinutes: null, shops: [] }
        );
    }, [updateType]);

    const handleShopToggle = useCallback((shopName: string) => {
        setSelectedShopNames(prev =>
            prev.includes(shopName) ? prev.filter(n => n !== shopName) : [...prev, shopName]
        );
    }, []);

    const saveOfferUpdateConfig = useCallback(async () => {
        try {
            if (updateType !== 'AUTOMATIC') { showToast.error("Ta funkcja działa tylko dla automatycznej aktualizacji"); return; }
            if (!interval) { showToast.error("Proszę wybrać prawidłowy interwał aktualizacji"); return; }
            await putOfferUpdateConfig(interval);
            showToast.success("Konfiguracja automatycznej aktualizacji zapisana!");
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Błąd podczas zapisywania konfiguracji');
        }
    }, [updateType, interval]);

    return (
        <div className="space-y-4">

            {/* ── Pasek kontrolny — jedna zwarta karta ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-4">

                {/* Ostatnia aktualizacja */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                    <Clock size={12} className="text-gray-400" />
                    Ostatnia: <span className="font-semibold text-gray-700">{updateTypeLabel[lastType]}</span>
                </div>

                <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

                {/* Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium ${updateType === 'MANUAL' ? 'text-ocean-blue' : 'text-gray-400'}`}>Ręczna</span>
                    <button
                        onClick={handleUpdateTypeToggle}
                        disabled={hasOngoingUpdate}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            updateType === 'AUTOMATIC' ? 'bg-ocean-blue' : 'bg-gray-200'
                        } ${hasOngoingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                            updateType === 'AUTOMATIC' ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                    </button>
                    <span className={`text-xs font-medium ${updateType === 'AUTOMATIC' ? 'text-ocean-blue' : 'text-gray-400'}`}>Auto</span>
                </div>

                <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

                {/* Sklepy (manual) */}
                {updateType === 'MANUAL' && (
                    <>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs text-gray-400 flex-shrink-0">Sklepy:</span>
                            {shops.map(shop => {
                                const isSelected = selectedShopNames.includes(shop.name);
                                return (
                                    <button
                                        key={shop.name}
                                        type="button"
                                        onClick={() => !hasOngoingUpdate && handleShopToggle(shop.name)}
                                        disabled={hasOngoingUpdate}
                                        className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all ${
                                            isSelected
                                                ? 'bg-ocean-blue text-white border-ocean-blue'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-ocean-blue hover:text-ocean-blue'
                                        } ${hasOngoingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {shop.name}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handleManualFetchOffers(selectedShopNames)}
                            disabled={hasOngoingUpdate || selectedShopNames.length === 0}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ml-auto ${
                                hasOngoingUpdate || selectedShopNames.length === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-blue-horizontal text-white shadow hover:shadow-md hover:-translate-y-0.5'
                            }`}
                        >
                            {hasOngoingUpdate
                                ? <><LoadingSpinner size={13} /> W toku...</>
                                : <><Zap size={13} /> Pobierz{selectedShopNames.length > 0 ? ` (${selectedShopNames.length})` : ''}</>
                            }
                        </button>
                    </>
                )}

                {/* Interwał (auto) */}
                {updateType === 'AUTOMATIC' && (
                    <>
                        <span className="text-xs text-gray-400">Interwał:</span>
                        <select
                            value={interval}
                            onChange={e => setInterval(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ocean-blue transition-colors"
                        >
                            {Object.entries(IntervalsMap).map(([key]) => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                        <span className="text-xs text-gray-400">— obejmuje wszystkie sklepy</span>
                        <button
                            onClick={saveOfferUpdateConfig}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold bg-gradient-blue-horizontal text-white shadow hover:shadow-md hover:-translate-y-0.5 transition-all flex-shrink-0 ml-auto"
                        >
                            <Save size={13} /> Zapisz
                        </button>
                    </>
                )}
            </div>

            {/* ── Główna treść: historia + statystyki obok ── */}
            <div className="flex gap-4 items-start">
                <div className="flex-1 min-w-0">
                    <OffersUpdatesView />
                </div>
                <div className="w-72 flex-shrink-0">
                    <ComponentsStatsPanel />
                </div>
            </div>
        </div>
    );
};

export default OffersComponent;
