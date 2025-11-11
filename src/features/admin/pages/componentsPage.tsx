
import {useState} from "react";
import Components from "../components/ComponentsList.tsx";
import {useFetchComponents} from "../hooks/useFetchComponents.ts";
import ReactPaginate from "react-paginate";
import {type ComponentItem, ComponentTypeEnum} from "../../../types/BaseItemDto.ts";
import { useFetchBrands } from "../hooks/useFetchBrands.ts";
import {LeftArrow} from "../../../assets/icons/leftArrow.tsx";
import {RightArrow} from "../../../assets/icons/rightArrow.tsx";
import {PlusIcon, Search} from "lucide-react";
import AddComponentForm from "../components/AddComponentForm.tsx";

import ImportCsvButton from "../components/ImportCsvButton";
import {useBulkImportComponents} from "../hooks/useBulkImportComponents.ts";
import {saveComponentApi} from "../api/saveComponentApi.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";

const ComponentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: brandsData, isLoading: isLoadingBrands } = useFetchBrands();
    console.log('getBrandsApi:', brandsData?.length);
    const [page, setPage] = useState<number>(0);
    const [filters, setFilters] = useState<{ itemType: ComponentTypeEnum | undefined; brand: string; searchTerm: string }>({ itemType: undefined, brand: "", searchTerm: "" });
    const componentsTypeList = Object.values(ComponentTypeEnum);
    const { data, isLoading, error, isFetching, isPlaceholderData } = useFetchComponents(page, filters);
    const [showForm, setShowForm] = useState(false);

    const bulkImport = useBulkImportComponents();

    const  handleAddComponent = async (data: ComponentItem)  => {
        await saveComponentApi(data)
            .then(res => {
                showToast.success("Dodano komponent");
            });

        setShowForm(false);
    };

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

    const removeFilter = () => {
        setFilters({ itemType: undefined, brand: "", searchTerm: "" });
        setSearchTerm('');
    }

    const handleSearchFiltrAdd = () => {
        setFilters((prev) => ({ ...prev, searchTerm: searchTerm }));
    }

    const [isClicked, setIsClicked] = useState(false);

    const handleSearchClick = () => {
        handleSearchFiltrAdd();
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-midnight-dark">Komponenty PC</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-3 py-1.5 bg-ocean-dark-blue text-white rounded hover:bg-ocean-blue text-sm font-medium flex items-center gap-1"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Dodaj ręcznie
                    </button>

                    <ImportCsvButton
                        onParsed={(rows) => bulkImport.mutate(rows)}
                    />
                </div>
            </div>
            {showForm && (
                <AddComponentForm
                    isOpen={showForm}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleAddComponent}
                />
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Szukaj..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearchFiltrAdd();
                            }}
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                        />

                        <Search
                            onClick={handleSearchClick}
                            className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer transition-all duration-200 ${
                                isClicked ? "text-ocean-blue scale-90" : "text-gray-400 hover:text-ocean-dark-blue hover:scale-110"
                            }`}
                        />

                    </div>
                    <select
                        value={filters.itemType}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                itemType: e.target.value as ComponentTypeEnum | undefined,
                            }))
                        }
                        className="border border-gray-300 rounded p-2 text-sm min-w-[150px]"
                    >
                        <option value="">Wybierz typ</option>
                        { componentsTypeList.map((type) => (
                            <option key={type} value={type}>
                                {type.replaceAll("_", " ")}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.brand}
                        onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                        className="border border-gray-300 rounded p-2 text-sm min-w-[150px]"
                        disabled={isLoadingBrands}
                    >
                        <option value="">
                            {isLoadingBrands ? "Ładowanie marek..." : "Wszystkie marki"}
                        </option>
                        {brandsData?.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={removeFilter}
                        className="px-4 py-1.5 bg-ocean-dark-blue text-white rounded hover:bg-ocean-blue text-sm font-medium flex items-center gap-1"
                    >
                        Wyczyść filtry
                    </button>
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