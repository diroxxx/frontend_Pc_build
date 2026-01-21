
import {use, useState} from "react";
import Components from "./components/ComponentsList.tsx";
import {useFetchComponents} from "./hooks/useFetchComponents.ts";
import ReactPaginate from "react-paginate";
import {type ComponentItem, ComponentTypeEnum} from "../../../shared/dtos/BaseItemDto.ts";
import { useFetchBrands } from "../../../shared/hooks/useFetchBrands.ts";
import {LeftArrow} from "../../../assets/icons/leftArrow.tsx";
import {RightArrow} from "../../../assets/icons/rightArrow.tsx";
import {PlusIcon} from "lucide-react";
import AddComponentForm from "./components/AddComponentForm.tsx";
import ImportCsvButton from "./components/ImportCsvButton.tsx";
import {saveComponentApi} from "./api/saveComponentApi.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";
import DownloadCsvTemplateButton from "./components/DownloadCsvTemplateButton.tsx";
import {updateComponentApi} from "./api/updateComponentApi.ts";
import { useAtom } from "jotai";
import { componentIdToDeleteAtom, editingComponentAtom, showUpdateComponentModalAtom } from "./atoms/editComponentAtom.ts";
import { deleteComponentApi } from "./api/deleteComponentApi.ts";
const ComponentsPage = () => {
    const { data: brandsData, isLoading: isLoadingBrands } = useFetchBrands();
    const brands = brandsData || [];
    const [page, setPage] = useState<number>(0);
    const [filters, setFilters] = useState<{ itemType: ComponentTypeEnum | undefined; brand: string; searchTerm: string }>({ itemType: undefined, brand: "", searchTerm: "" });
    const [tmpFilters, setTmpFilters] = useState<{ itemType: ComponentTypeEnum | undefined; brand: string; searchTerm: string }>({ itemType: undefined, brand: "", searchTerm: "" });


    const componentsTypeList = Object.values(ComponentTypeEnum);
    const {data: components,isLoading:loadingComponents, isFetching:fetchingComponents,error:errorComponents,isPlaceholderData:placeHolderComponents, refetch: refetchComps} = useFetchComponents(page, filters);
        
    const [showFormToAdd, setShowFormToAdd] = useState(false);
    const [showFormToUpdate, setShowFormToUpdate] = useAtom(showUpdateComponentModalAtom);
    const [componentToEdit, setComponentToEdit] = useAtom(editingComponentAtom);
    const [componentIdToDelete, setComponentIdToDelete] = useAtom(componentIdToDeleteAtom);
    const [selectedType, setSelectedType] = useState<ComponentTypeEnum | "">("");
    const [importMessage, setImportMessage] = useState<string | null>(null);

    const handleAddComponent = async (data: ComponentItem) => {
        await saveComponentApi(data)
            .then(() => {
                showToast.success("Dodano komponent");
            });
        setShowFormToAdd(false);
        refetchComps();
    };

    const  handleUpdateComponent = async (data: ComponentItem) => {
        // console.log("Updating component:", data);
        await   updateComponentApi(data)
            .then(() => {
                showToast.success("Zaktualizowano komponent");
            });
        setShowFormToUpdate(false);
        setComponentToEdit(null);
        refetchComps();
    }

 
    const removeFilter = () => {
        setFilters({ itemType: undefined, brand: "", searchTerm: "" });
        setTmpFilters({ itemType: undefined, brand: "", searchTerm: "" });
    }

    const refetchComponents = () => {
        setFilters(tmpFilters);
        refetchComps();
    }

 return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-midnight-dark">Podzespoły PC</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFormToAdd(true)}
                        className="px-3 py-1.5 bg-ocean-dark-blue text-white rounded hover:bg-ocean-blue text-sm font-medium flex items-center gap-1 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Dodaj ręcznie
                    </button>
                </div>
            </div>

            {showFormToAdd && (
                <AddComponentForm
                    isOpen={showFormToAdd}
                    onClose={() => setShowFormToAdd(false)}
                    onSubmit={handleAddComponent}
                />
            )}
            {showFormToUpdate && (
                <AddComponentForm
                    isOpen={showFormToUpdate}
                    onClose={() => setShowFormToUpdate(false)}
                    onSubmit={handleUpdateComponent}
                    initialData={componentToEdit || undefined}
                />
            )}

            <div className="flex gap-4">
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Szukaj..."
                                value={tmpFilters.searchTerm }
                                onChange={(e) => setTmpFilters(prev => ({...prev, searchTerm: e.target.value}))}

                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                            />
                        </div>

                        <select
                            value={filters.itemType}
                            onChange={(e) =>
                                setTmpFilters((prev) => ({
                                    ...prev,
                                    itemType: e.target.value as ComponentTypeEnum | undefined,
                                }))
                            }
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[150px]"
                        >
                            <option value="">Wszystkie typy</option>
                            {componentsTypeList.map((type) => (
                                <option key={type} value={type}>
                                    {type.replaceAll("_", " ")}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.brand}
                            onChange={(e) => setTmpFilters((prev) => ({ ...prev, brand: e.target.value }))}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[150px]"
                            disabled={isLoadingBrands}
                        >
                            <option value="">
                                {isLoadingBrands ? "Ładowanie marek..." : "Wszystkie marki"}
                            </option>
                            {brands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            onClick={refetchComponents}
                            className="px-4 mr-1.5 py-1.5 bg-text-ocean-blue text-white rounded hover:bg-ocean-blue/80 text-sm font-medium transition-colors cursor-pointer "
                        >
                            Szukaj komponentów
                        </button>

                        <button
                            onClick={removeFilter}
                            className="px-4 py-1.5 bg-text-ocean-red text-white rounded hover:bg-text-ocean-red/80 text-sm font-medium transition-colors cursor-pointer"
                        >
                            Wyczyść filtry
                        </button>
                    </div>
                </div>

                <div className="w-80 bg-white rounded-lg shadow-sm border border-ocean-light-blue p-4">
                    <h3 className="text-sm font-semibold text-midnight-dark mb-3">Import CSV</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Typ komponentu
                            </label>
                            <select 
                                value={selectedType} 
                                onChange={(e) => setSelectedType(e.target.value as ComponentTypeEnum | "")}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                            >
                                <option value="">-- Wybierz --</option>
                                {Object.values(ComponentTypeEnum).map(type => (
                                    <option key={type} value={type}>
                                        {type.replaceAll("_", " ")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <ImportCsvButton 
                                componentType={selectedType as ComponentTypeEnum}
                                onImportSuccess={(count) => {
                                    setImportMessage(`+ Zaimportowano ${count} komponentów`);
                                    setTimeout(() => setImportMessage(null), 5000);
                                }}
                                onImportError={(err) => {
                                    setImportMessage(`X ${err}`);
                                    setTimeout(() => setImportMessage(null), 5000);
                                }}
                                className={`w-full ${selectedType ? "" : "opacity-50 pointer-events-none"}`}
                            />
                            <DownloadCsvTemplateButton className="w-full" />
                        </div>

                        {importMessage && (
                            <div className={`p-2 rounded-lg text-xs ${
                                importMessage.startsWith('+') 
                                    ? 'bg-green-50 border border-green-200 text-green-700' 
                                    : 'bg-ocean-red/10 border border-ocean-red/30 text-ocean-red'
                            }`}>
                                {importMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Components
                page={page}
                filters={filters}
                data={components}
                isLoading={loadingComponents}
                error={errorComponents}
                isFetching={fetchingComponents}
                isPlaceholderData={placeHolderComponents}
            />
            <ReactPaginate
                breakLabel="..."
                nextLabel={<RightArrow/>}
                previousLabel={<LeftArrow/>}
                onPageChange={(e) => setPage(e.selected + 0)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={components?.totalPages ?? 1}
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