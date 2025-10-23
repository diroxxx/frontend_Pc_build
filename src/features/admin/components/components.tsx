
import {useState} from "react";
import {
    componentSpecsAtom,
    isProcessorSpec,
    isCoolerSpec,
    isGraphicsCardSpec,
    isMemorySpec,
    isMotherboardSpec,
    isPowerSupplySpec,
    isStorageSpec,
    isCaseSpec
} from "../../../atomContext/componentAtom.tsx";
import {useAtomValue} from "jotai";

const Components = () => {
    const componentList = useAtomValue(componentSpecsAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');



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
                        <button
                            // onClick={handleRefresh}
                            className="px-3 py-1.5 bg-white border border-ocean-blue text-ocean-blue rounded hover:bg-ocean-light-blue text-sm font-medium transition-colors flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Odśwież
                        </button>
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
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-ocean-blue"
                    >
                        <option value="all">Wszystkie</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>
                                {componentTypeNames[type] || type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>Wyświetlono: <strong>{filteredComponents.length}</strong></span>
                    <span>•</span>
                    <span>Łącznie: <strong>{componentList.length}</strong></span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-ocean-dark-blue text-white">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Typ</th>
                        <th className="px-3 py-2 text-left font-medium">Producent</th>
                        <th className="px-3 py-2 text-left font-medium">Model</th>
                        <th className="px-3 py-2 text-left font-medium">Specyfikacja</th>
                        <th className="px-3 py-2 text-right font-medium">Akcje</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredComponents.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-3 py-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-gray-600 text-sm">Nie znaleziono komponentów</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredComponents.map((component, index) => (
                            <tr key={`${component.componentType}-${component.brand}-${component.model}-${index}`} className="hover:bg-gray-50">
                                <td className="px-3 py-2">
                                    <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">
                                        {componentTypeNames[component.componentType] || component.componentType}
                                    </span>
                                </td>
                                <td className="px-3 py-2 font-medium">{component.brand}</td>
                                <td className="px-3 py-2">{component.model}</td>
                                <td className="px-3 py-2">
                                    <div className="text-xs text-gray-600 space-y-0.5">
                                        {isProcessorSpec(component) && (
                                            <>
                                                <p>{component.cores}/{component.threads} | {component.socketType}</p>
                                                <p>{component.baseClock}</p>
                                            </>
                                        )}
                                        {isGraphicsCardSpec(component) && (
                                            <p>{component.memorySize}GB {component.gddr} | {component.powerDraw}W</p>
                                        )}
                                        {isMemorySpec(component) && (
                                            <p>{component.type} | {component.capacity}GB | {component.speed}</p>
                                        )}
                                        {isMotherboardSpec(component) && (
                                            <p>{component.chipset} | {component.socketType} | {component.format}</p>
                                        )}
                                        {isPowerSupplySpec(component) && (
                                            <p>{component.maxPowerWatt}W</p>
                                        )}
                                        {isStorageSpec(component) && (
                                            <p>{component.capacity}GB</p>
                                        )}
                                        {isCoolerSpec(component) && (
                                            <p>{component.coolerSocketsType.join(', ')}</p>
                                        )}
                                        {isCaseSpec(component) && (
                                            <p>{component.format}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <button className="p-1.5 text-ocean-blue hover:bg-ocean-light-blue rounded transition-colors" title="Edytuj">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="p-1.5 text-ocean-red hover:bg-red-50 rounded transition-colors" title="Usuń">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Components;