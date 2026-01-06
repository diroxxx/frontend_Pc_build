import {ComponentTypeEnum} from "../dtos/BaseItemDto.ts";
import  {ItemConditionEnum} from "../dtos/ItemConditionEnum.ts";
import {offerLeftPanelFiltersAtom} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import {useAtom} from "jotai";
import {useCallback, useEffect, useMemo, useState} from "react";
import type {OfferFiltersType} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import {useFetchBrands} from "../hooks/useFetchBrands.ts";
import {useShopsNames} from "../hooks/useShopsNames.ts";
import {offerPageAtom} from "../atoms/OfferPageAtom.ts";

type OffersFiltersProps = {
    chooseComponentTypeParam?: ComponentTypeEnum;
};

const categoryLabels: Record<ComponentTypeEnum, string> = {
    PROCESSOR: "CPU",
    GRAPHICS_CARD: "GPU",
    MOTHERBOARD: "Płyta główna",
    CPU_COOLER: "Chłodzenie cpu",
    CASE_PC: "Obudowa",
    MEMORY: "RAM",
    POWER_SUPPLY: "Zasilacz",
    STORAGE: "Pamięć",
};

const conditionLabel: Record<ItemConditionEnum, string> = {
    NEW: "Nowe",
    USED: "Używane",
};

export const OffersSideFilters = ({ chooseComponentTypeParam }: OffersFiltersProps) => {
    const [offerLeftPanelFilters, setOfferLeftPanelFilters] = useAtom(offerLeftPanelFiltersAtom);
    const [, setPage] = useAtom(offerPageAtom);

    const [tempFilters, setTempFilters] = useState<OfferFiltersType>(() => ({
        componentType: offerLeftPanelFilters.componentType ?? undefined,
        brand: offerLeftPanelFilters.brand ?? "",
        minPrize: offerLeftPanelFilters.minPrize ?? 0,
        maxPrize: offerLeftPanelFilters.maxPrize ?? 99999,
        itemCondition: offerLeftPanelFilters.itemCondition ?? undefined,
        shopName: offerLeftPanelFilters.shopName ?? "",
        query: offerLeftPanelFilters.query ?? "",
        sortBy: offerLeftPanelFilters.sortBy ?? undefined,
    }));

    useEffect(() => {
        setTempFilters({
            componentType: offerLeftPanelFilters.componentType ?? undefined,
            brand: offerLeftPanelFilters.brand ?? "",
            minPrize: offerLeftPanelFilters.minPrize ?? 0,
            maxPrize: offerLeftPanelFilters.maxPrize ?? 99999,
            itemCondition: offerLeftPanelFilters.itemCondition ?? undefined,
            shopName: offerLeftPanelFilters.shopName ?? "",
            query: offerLeftPanelFilters.query ?? "",
            sortBy: offerLeftPanelFilters.sortBy ?? undefined,
        });
    }, [offerLeftPanelFilters]);

    useEffect(() => {
        if (chooseComponentTypeParam) {
            setTempFilters((prev) => ({ ...prev, componentType: chooseComponentTypeParam }));
            setOfferLeftPanelFilters((prev) => ({ ...prev, componentType: chooseComponentTypeParam }));
        }
    }, [chooseComponentTypeParam, setOfferLeftPanelFilters]);

    const { data: brandsData } = useFetchBrands();
    const brands = brandsData ?? [];
    const componentConditions = useMemo(() => Object.values(ItemConditionEnum), []);
    const componentTypes = useMemo(() => Object.values(ComponentTypeEnum), []);
    const { data: shopsData } = useShopsNames();
    const shopsNames = shopsData ?? [];

    const setMinPrize = useCallback((value: number) => {
        setTempFilters((prev) => {
            const newMin = Math.max(0, Math.floor(value));
            const max = prev.maxPrize ?? 99999;
            return { ...prev, minPrize: Math.min(newMin, max) };
        });
    }, []);

    const setMaxPrize = useCallback((value: number) => {
        setTempFilters((prev) => {
            const newMax = Math.max(0, Math.floor(value));
            const min = prev.minPrize ?? 0;
            return { ...prev, maxPrize: Math.max(newMax, min) };
        });
    }, []);

    const applyFilters = useCallback(() => {
        setPage(0);
        const sanitized: OfferFiltersType = {
            ...tempFilters,
            brand: tempFilters.brand ?? "",
            shopName: tempFilters.shopName ?? "",
            minPrize: tempFilters.minPrize ?? 0,
            maxPrize: tempFilters.maxPrize ?? 99999,
        };
        setOfferLeftPanelFilters(sanitized);
        sessionStorage.removeItem('compatibilityFilter');

    }, [setPage, setOfferLeftPanelFilters, tempFilters]);

    const clearFilters = useCallback(() => {
        setPage(0);
        const empty: OfferFiltersType = {
            componentType: undefined,
            brand: "",
            minPrize: 0,
            maxPrize: 99999,
            itemCondition: undefined,
            shopName: "",
            query: "",
            sortBy: undefined,
        };
        setOfferLeftPanelFilters(empty);
        setTempFilters(empty);
        sessionStorage.removeItem('compatibilityFilter');
    }, [setPage, setOfferLeftPanelFilters]);

    return (
        <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>

                <div className="mb-6">
                    <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Kategoria
                    </label>
                    <select
                        id="category-select"
                        value={tempFilters.componentType ?? ""}
                        onChange={(e) =>
                            setTempFilters((prev) => ({
                                ...prev,
                                componentType: e.target.value ? (e.target.value as ComponentTypeEnum) : undefined,
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Wszystkie kategorie</option>
                        {componentTypes.map((type) => (
                            <option key={type} value={type}>
                                {categoryLabels[type]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-2">
                        Cena: {tempFilters.minPrize} zł – {tempFilters.maxPrize} zł
                    </label>

                    <div className="flex gap-2 items-center mb-2">
                        <input
                            id="min-price"
                            aria-label="Minimalna cena"
                            type="number"
                            min={0}
                            value={tempFilters.minPrize}
                            onChange={(e) => setMinPrize(Number(e.target.value || 0))}
                            className="w-1/2 px-2 py-1 border rounded"
                        />
                        <input
                            id="max-price"
                            aria-label="Maksymalna cena"
                            type="number"
                            min={0}
                            value={tempFilters.maxPrize}
                            onChange={(e) => setMaxPrize(Number(e.target.value || 0))}
                            className="w-1/2 px-2 py-1 border rounded"
                        />
                    </div>

                    <div className="space-y-2">
                        <input
                            type="range"
                            min={0}
                            max={10000}
                            value={tempFilters.minPrize}
                            onChange={(e) => setMinPrize(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            min={0}
                            max={10000}
                            value={tempFilters.maxPrize}
                            onChange={(e) => setMaxPrize(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="brand-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Producent
                    </label>
                    <select
                        id="brand-select"
                        value={tempFilters.brand}
                        onChange={(e) => setTempFilters((prev) => ({ ...prev, brand: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Wszyscy producenci</option>
                        {Array.isArray(brands) &&
                            brands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="condition-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Stan
                    </label>
                    <select
                        id="condition-select"
                        value={tempFilters.itemCondition ?? ""}
                        onChange={(e) =>
                            setTempFilters((prev) => ({
                                ...prev,
                                itemCondition: e.target.value ? (e.target.value as ItemConditionEnum) : undefined,
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Wszystkie stany</option>
                        {componentConditions.map((condition) => (
                            <option key={condition} value={condition}>
                                {conditionLabel[condition]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label htmlFor="shop-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Sklep
                    </label>
                    <select
                        id="shop-select"
                        value={tempFilters.shopName}
                        onChange={(e) => setTempFilters((prev) => ({ ...prev, shopName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Wszystkie sklepy</option>
                        {shopsNames.map((shop) => (
                            <option key={shop} value={shop}>
                                {shop}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <button
                        onClick={applyFilters}
                        className="w-full bg-ocean-dark-blue text-white py-2 rounded-lg hover:bg-ocean-blue transition mb-2"
                    >
                        Zastosuj filtry
                    </button>
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Wyczyść filtry
                    </button>
                </div>
            </div>
        </div>
    );
};