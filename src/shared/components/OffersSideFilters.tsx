import {ComponentTypeEnum} from "../../types/BaseItemDto.ts";
import  {ItemConditionEnum} from "../../types/ItemConditionEnum.ts";
import {offerLeftPanelFiltersAtom} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import {useAtom} from "jotai";
import {useEffect, useState} from "react";
import type {OfferFiltersType} from "../atoms/OfferLeftPanelFiltersAtom.ts";
import {useFetchBrands} from "../../features/admin/hooks/useFetchBrands.ts";
import {useShopsNames} from "../../hooks/useShopsNames.ts";
import {offerPageAtom} from "../atoms/OfferPageAtom.ts";

type OffersFiltersProps = {
    chooseComponentTypeParam?: ComponentTypeEnum;
};

const categoryLabels: Record<string, string> = {
    PROCESSOR: "CPU",
    GRAPHICS_CARD: "GPU",
    MOTHERBOARD: "Płyta główna",
    CPU_COOLER: "Chłodzenie cpu",
    CASE_PC: "Obudowa",
    MEMORY: "RAM",
    POWER_SUPPLY: "Zasilacz",
    STORAGE: "Pamięć",
};

const conditionLabel: Record<string, string> = {
    NEW: "Nowe",
    USED: "Używane",
}

export const OffersSideFilters = ({ chooseComponentTypeParam }: OffersFiltersProps) => {

    const [offerLeftPanelFilters, setOfferLeftPanelFilters] = useAtom(offerLeftPanelFiltersAtom);
    const [tempFilters, setTempFilters] = useState<OfferFiltersType>({
        componentType: offerLeftPanelFilters.componentType,
        brand: offerLeftPanelFilters.brand,
        minPrize: offerLeftPanelFilters.minPrize,
        maxPrize: offerLeftPanelFilters.maxPrize,
        itemCondition: offerLeftPanelFilters.itemCondition,
        shopName: offerLeftPanelFilters.shopName,
        query: offerLeftPanelFilters.query,
        sortBy: offerLeftPanelFilters.sortBy,
    });
    const [,setPage] = useAtom(offerPageAtom);

    const {data : brandsData} = useFetchBrands();
    const brands = brandsData ?? []

    const componentConditions = Object.values(ItemConditionEnum);
    const componentTypes = Object.values(ComponentTypeEnum);
    const {data: shopsData} = useShopsNames();
    const shopsNames = shopsData ?? [];

    useEffect(() => {
        if (chooseComponentTypeParam) {
            setTempFilters((prev) =>({
                ...prev, componentType: chooseComponentTypeParam as ComponentTypeEnum,
            }));
            setOfferLeftPanelFilters((prev) => ({
                ...prev,
                componentType: chooseComponentTypeParam as ComponentTypeEnum,
            }));
        }

    }, [chooseComponentTypeParam]);

    const applyFilters = () => {
        setPage(0);
        setOfferLeftPanelFilters(tempFilters);
    };

    const clearFilters = () => {
        setPage(0);
        setOfferLeftPanelFilters({ componentType: undefined, brand: "", minPrize: 0, maxPrize:99999, itemCondition: undefined, shopName: "", query: "", sortBy: undefined });
        setTempFilters({ componentType: undefined, brand: "", minPrize: 0, maxPrize:99999, itemCondition: undefined, shopName: "", query: "", sortBy: undefined });
    }

    return(
        <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategoria
                    </label>
                    <select
                        value={tempFilters.componentType}
                        onChange={(e) => setTempFilters((prev) => ({...prev, componentType: e.target.value as ComponentTypeEnum}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Wszystkie kategorie</option>
                        {componentTypes.map(type => (
                            <option key={type} value={type}>
                                {categoryLabels[type]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cena: {tempFilters.minPrize} zł – {tempFilters.maxPrize} zł
                    </label>
                    <div className="space-y-2">
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            value={tempFilters.minPrize}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, minPrize: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            value={tempFilters.maxPrize}
                            onChange={(e) => setTempFilters(prev => ({ ...prev, maxPrize: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Producent
                    </label>
                    <select
                        value={tempFilters.brand}
                        onChange={(e) => setTempFilters((prev) => ({...prev, brand: e.target.value}) )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Wszyscy producenci</option>
                        {Array.isArray(brands) && brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}

                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stan
                    </label>
                    <select
                        value={tempFilters.itemCondition}
                        onChange={(e) => setTempFilters((prev) =>({...prev, itemCondition: e.target.value as ItemConditionEnum}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Wszystkie stany</option>
                        {componentConditions.map(condition => (
                            <option key={condition} value={condition}>
                                {conditionLabel[condition]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sklep
                    </label>
                    <select
                        value={tempFilters.shopName}
                        onChange={(e) => setTempFilters((prev) => ({...prev, shopName: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Wszystkie sklepy</option>
                        {shopsNames.map(shop => (
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

    )
}
