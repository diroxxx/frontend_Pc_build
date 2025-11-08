import React, {useEffect, useState} from "react";
import SidePanelBuilds from '../components/builds/SidePanelBuilds.tsx';

import {useFetchOffers} from "../../../hooks/useFetchOffers.ts";
import {ComponentTypeEnum} from "../../../types/BaseItemDto.ts";
import  {ItemConditionEnum} from "../../../types/ItemConditionEnum.ts";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.tsx";
import OfferUserList from "../components/componentsPage/OfferUserList.tsx";
import ReactPaginate from "react-paginate";
import {RightArrow} from "../../../assets/icons/rightArrow.tsx";
import {LeftArrow} from "../../../assets/icons/leftArrow.tsx";
import {useFetchBrands} from "../../admin/hooks/useFetchBrands.ts";
import {useShopsNames} from "../../../hooks/useShopsNames.ts";
import {SortByOffersEnum} from "../../../types/SortByOffersEnum.ts";
// import {SearchIcon} from "lucide-react";
import {SearchIcon} from "../../../assets/icons/searchIcon.tsx";
import { useSearchParams } from "react-router-dom";
import type {OfferFilters} from "../../../types/OfferFilters.ts";



function OffersUserPage() {

    const [showScrollTop, setShowScrollTop] = useState(false);
    const [searchParams] = useSearchParams();
    const componentCategoryParam = searchParams.get("category");

    const [sortBy, setSortBy] = useState('');

    const [page, setPage] = useState<number>(0);
    const [filters, setFilters] = useState<OfferFilters>({
        componentType: componentCategoryParam ? (componentCategoryParam as ComponentTypeEnum) : undefined,
        brand: "",
        minPrize: 0,
        maxPrize: 99999,
        itemCondition: undefined,
        shopName: "",
        query: "",
        sortBy: sortBy ? (sortBy as SortByOffersEnum) : undefined
    });
    const [tempFilters, setTempFilters] = useState(filters);

    useEffect(() => {
        if (componentCategoryParam) {
            setFilters((prev) => ({
                ...prev,
                componentType: componentCategoryParam as ComponentTypeEnum,
            }));
            setTempFilters((prev) => ({
                ...prev,
                componentType: componentCategoryParam as ComponentTypeEnum,
            }));
        }
    }, [componentCategoryParam]);

    const {data: offersData, isLoading: isLoadingOffers, error, isFetching} = useFetchOffers(page, filters);
    const offers = offersData?.offers ?? [];

    const {data : brandsData} = useFetchBrands();
    const brands = brandsData ?? []

    const componentConditions = Object.values(ItemConditionEnum);
    const componentTypes = Object.values(ComponentTypeEnum);
    const {data: shopsData} = useShopsNames();
    const shopsNames = shopsData ?? [];


    const applyFilters = () => {
        setFilters(tempFilters);
    };

    const clearFilters = () => {
        setFilters({ componentType: undefined, brand: "", minPrize: 0, maxPrize:99999, itemCondition: undefined, shopName: "", query: "", sortBy: undefined });
        setTempFilters({ componentType: undefined, brand: "", minPrize: 0, maxPrize:99999, itemCondition: undefined, shopName: "", query: "", sortBy: undefined });
    }

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, query: tempFilters.query}));
        setPage(0);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setTempFilters(prev => ({ ...prev, sortBy: e.target.value as SortByOffersEnum }));
        setFilters(prev => ({ ...prev, sortBy: e.target.value as SortByOffersEnum }));
        setPage(0);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setShowScrollTop(scrollTop > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // if (isLoadingOffers) {
    //     return <LoadingSpinner />;
    // }
    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;
    return (
        <div className="min-h-screen bg-gray-50">
            <SidePanelBuilds />
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Oferty komponentów</h1>
                    
                    {/* Search bar */}
                    <div className="flex gap-4 items-center">
                        <div className="relative w-full max-w-2xl">
                            <input
                                type="text"
                                placeholder="Wyszukaj ofertę (np. Nvidia, RTX 4080)..."
                                value={tempFilters.query}
                                onChange={(e) => setTempFilters(({ ...tempFilters, query: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600"
                            >
                                <SearchIcon/>
                            </button>
                        </div>

                        <select
                            value={tempFilters.sortBy}
                            onChange={handleSortChange}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Domyślne sortowanie</option>
                            <option value={SortByOffersEnum.CHEAPEST}>Najtańsze</option>
                            <option value={SortByOffersEnum.EXPENSIVE}>Najdroższe</option>
                            <option value={SortByOffersEnum.NEWEST}>Najnowsze</option>
                        </select>

                    </div>
                </div>
            </div>

            {/* Content with sidebar */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                {/* Sidebar with filters */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 sticky top-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtry</h3>
                        
                        {/* Category filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategoria
                            </label>
                            <select
                                value={tempFilters.componentType}
                                onChange={(e) => setTempFilters((prev) => ({...prev, componentType: e.target.value as ComponentTypeEnum}))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="">Wszystkie kategorie</option>
                                {componentTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                         {/*Price filter */}
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

                         {/*Manufacturer filter*/}
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

                         {/*Condition filter */}
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
                                        {condition}
                                    </option>
                                ))}
                            </select>
                        </div>

                         {/*Shop filter*/}
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

                        {/* Clear filters button */}
                        <button
                            onClick={applyFilters}
                            className="w-full bg-ocean-dark-blue text-white py-2 rounded-lg hover:bg-ocean-light-blue transition"
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

                {/* Main content */}
                <div className="flex-1" >

                    {/* Scroll to Top Button */}
                    {showScrollTop && (
                        <button
                            onClick={scrollToTop}
                            className="fixed bottom-6 right-6 z-40 bg-gradient-ocean hover:bg-gradient-ocean-hover text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                            title="Powrót na górę"
                        >
                            <svg 
                                width="24" 
                                height="24" 
                                fill="none" 
                                viewBox="0 0 24 24"
                                className="transform transition-transform duration-200"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19V5m-7 7l7-7 7 7"
                                />
                            </svg>
                        </button>
                    )}
                    <OfferUserList offers={offers} isFetching={isFetching} isLoading={isLoadingOffers}/>
                    {/* Pagination */}
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<RightArrow />}
                        previousLabel={<LeftArrow />}
                        onPageChange={(e) => setPage(e.selected)}
                        forcePage={page}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={1}
                        pageCount={offersData?.totalPages ?? 1}
                        containerClassName="flex justify-center gap-1 py-4"
                        pageLinkClassName="px-3 py-1 block rounded bg-gray-100 cursor-pointer"
                        activeLinkClassName="bg-ocean-dark-blue text-white font-semibold"
                        previousLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                        nextLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                        onClick={scrollToTop}
                    />

                </div>
            </div>
        </div>
    );
}

export default OffersUserPage;