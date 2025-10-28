
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
import Components from "../components/Components.tsx";
import {useFetchComponents} from "../hooks/useFetchComponents.ts";

const ComponentsPage = () => {
    const componentList = useAtomValue(componentSpecsAtom);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    const {refetch} = useFetchComponents();


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
                            onClick={ () => refetch()}
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

            <Components/>
        </div>
    );
}

export default ComponentsPage;