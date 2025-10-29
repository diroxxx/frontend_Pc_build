
import {useState} from "react";
import {
    componentSpecsAtom
} from "../../../atomContext/componentAtom.tsx";
import {useAtomValue} from "jotai";
import Components from "../components/ComponentsList.tsx";
import {useFetchComponents} from "../hooks/useFetchComponents.ts";
import ReactPaginate from "react-paginate";
import  { ItemType } from "../../../types/BaseItemDto.ts";
import { useFetchBrands } from "../hooks/useFetchBrands.ts";
import {LeftArrow} from "../../../assets/icons/leftArrow.tsx";
import {RightArrow} from "../../../assets/icons/rightArrow.tsx";
const ComponentsPage = () => {
    const componentList = useAtomValue(componentSpecsAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    const { data: brandsData, isLoading: isLoadingBrands } = useFetchBrands();
    console.log('getBrandsApi:', brandsData?.length);
    const [page, setPage] = useState<number>(0);
    const [filters, setFilters] = useState<{ itemType: ItemType | undefined; brand: string }>({ itemType: undefined, brand: "" });

    const { data, isLoading, error, isFetching, isPlaceholderData } = useFetchComponents(page, filters);

    const filteredComponents = componentList.filter(component => {
        const matchesSearch =
            component.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'all' || component.componentType === filterType;

        return matchesSearch && matchesType;
    });

    const componentTypeNames: Record<string, string> = {
        processor: 'Procesor',
        cooler: 'Chłodzenie',
        graphicsCard: 'Karta graficzna',
        memory: 'Pamięć RAM',
        motherboard: 'Płyta główna',
        powerSupply: 'Zasilacz',
        storage: 'Dysk',
        casePc: 'Obudowa'
    };

    const uniqueTypes = [...new Set(componentList.map(c => c.componentType))];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-midnight-dark">Komponenty PC</h2>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-ocean-dark-blue text-white rounded hover:bg-ocean-blue text-sm font-medium transition-colors flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Dodaj
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 mb-3">
                    <div className="flex-1 relative">
                        <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Szukaj..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                        />
                    </div>

                    <select
                         value={filters.itemType}
                         onChange={(e) => setFilters((prev) => ({ ...prev, itemType: e.target.value as ItemType | undefined }))}
                         className="border border-gray-300 rounded p-2 text-sm"
                     >
                         <option value="">-- wybierz typ --</option>
                         {Object.values(ItemType).map((type) => (
                             <option key={type} value={type}>
                                 {type.replaceAll("_", " ")}
                             </option>
                         ))}
                     </select>

                      <select
    value={filters.brand}
    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
    className="border border-gray-300 rounded p-2 text-sm"
    disabled={isLoadingBrands}
>
    <option value="">
        {isLoadingBrands ? "Ładowanie marek..." : "Wszystkie marki"}
    </option>
    {brandsData?.map((brand) => ( 
        <option key={brand} value={brand}>{brand}</option>
    ))}
</select>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                    
                </div>
            </div>

            <Components page={page} filters={filters} />
                <ReactPaginate
                breakLabel="..."
                nextLabel={<RightArrow/>}
                previousLabel={<LeftArrow/>}
                onPageChange={(e) => setPage(e.selected + 1)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={data?.totalPages ?? 1}
                containerClassName="flex justify-center gap-1 py-4"
                pageClassName=""
                pageLinkClassName="px-3 py-1 block rounded bg-gray-100 cursor-pointer"
                activeLinkClassName="bg-ocean-dark-blue text-white font-semibold"
                previousLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
                nextLinkClassName="px-3 py-1 block rounded hover:bg-gray-200 cursor-pointer"
            />

        </div>
    );
}

export default ComponentsPage;