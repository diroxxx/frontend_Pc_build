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

    const selectClass = "w-full px-3 py-2 bg-dark-surface2 border border-dark-border rounded-lg text-dark-text text-sm focus:border-dark-accent transition-colors";
    const labelClass = "block text-xs font-medium text-dark-muted mb-2 uppercase tracking-wide";

    return (
        <div className="w-full flex-shrink-0">
            <div className="bg-dark-surface rounded-xl p-5 border border-dark-border">
                <h3 className="text-sm font-bold text-dark-muted uppercase tracking-widest mb-5">Filtry</h3>

                <div className="mb-5">
                    <label htmlFor="category-select" className={labelClass}>
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
                        className={selectClass}
                    >
                        <option value="">Wszystkie kategorie</option>
                        {componentTypes.map((type) => (
                            <option key={type} value={type}>
                                {categoryLabels[type]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-5">
                    <label htmlFor="min-price" className={labelClass}>
                        Cena: {tempFilters.minPrize} zł – {tempFilters.maxPrize} zł
                    </label>

                    <div className="flex gap-2 items-center mb-3">
                        <input
                            id="min-price"
                            aria-label="Minimalna cena"
                            type="number"
                            min={0}
                            value={tempFilters.minPrize}
                            onChange={(e) => setMinPrize(Number(e.target.value || 0))}
                            className="w-1/2 px-2 py-1.5 bg-dark-surface2 border border-dark-border rounded-lg text-dark-text text-sm text-center focus:border-dark-accent transition-colors"
                        />
                        <input
                            id="max-price"
                            aria-label="Maksymalna cena"
                            type="number"
                            min={0}
                            value={tempFilters.maxPrize}
                            onChange={(e) => setMaxPrize(Number(e.target.value || 0))}
                            className="w-1/2 px-2 py-1.5 bg-dark-surface2 border border-dark-border rounded-lg text-dark-text text-sm text-center focus:border-dark-accent transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <input
                            type="range"
                            min={0}
                            max={10000}
                            value={tempFilters.minPrize}
                            onChange={(e) => setMinPrize(Number(e.target.value))}
                            className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-dark-accent"
                        />
                        <input
                            type="range"
                            min={0}
                            max={10000}
                            value={tempFilters.maxPrize}
                            onChange={(e) => setMaxPrize(Number(e.target.value))}
                            className="w-full h-1.5 bg-dark-border rounded-lg appearance-none cursor-pointer accent-dark-accent"
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="brand-select" className={labelClass}>
                        Producent
                    </label>
                    <select
                        id="brand-select"
                        value={tempFilters.brand}
                        onChange={(e) => setTempFilters((prev) => ({ ...prev, brand: e.target.value }))}
                        className={selectClass}
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

                <div className="mb-5">
                    <label htmlFor="condition-select" className={labelClass}>
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
                        className={selectClass}
                    >
                        <option value="">Wszystkie stany</option>
                        {componentConditions.map((condition) => (
                            <option key={condition} value={condition}>
                                {conditionLabel[condition]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-5">
                    <label htmlFor="shop-select" className={labelClass}>
                        Sklep
                    </label>
                    <select
                        id="shop-select"
                        value={tempFilters.shopName}
                        onChange={(e) => setTempFilters((prev) => ({ ...prev, shopName: e.target.value }))}
                        className={selectClass}
                    >
                        <option value="">Wszystkie sklepy</option>
                        {shopsNames.map((shop) => (
                            <option key={shop} value={shop}>
                                {shop}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={applyFilters}
                        className="w-full bg-dark-accent hover:bg-dark-accent-hover text-white py-2.5 rounded-lg font-semibold text-sm transition-all"
                    >
                        Zastosuj filtry
                    </button>
                    <button
                        onClick={clearFilters}
                        className="w-full px-4 py-2 text-sm text-dark-muted border border-dark-border rounded-lg hover:border-dark-accent hover:text-dark-accent transition-colors"
                    >
                        Wyczyść filtry
                    </button>
                </div>
            </div>
        </div>
    );
};