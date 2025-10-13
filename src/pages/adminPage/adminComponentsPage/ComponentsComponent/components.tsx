
import {useEffect, useState} from "react";
import {
    componentSpecsAtom,
    fetchComponentSpecsAtom,
    type ComponentSpec,
    isProcessorSpec,
    isCoolerSpec,
    isGraphicsCardSpec,
    isMemorySpec,
    isMotherboardSpec,
    isPowerSupplySpec,
    isStorageSpec,
    isCaseSpec, componentsLoadingAtom, refreshComponentsAtom
} from "../../../../atomContext/componentAtom.tsx";
import {useAtomValue, useSetAtom} from "jotai";

const Components = () => {
    const componentList = useAtomValue(componentSpecsAtom);
    const isLoading = useAtomValue(componentsLoadingAtom);
    const fetchComponents = useSetAtom(fetchComponentSpecsAtom);
    const refreshComponents = useSetAtom(refreshComponentsAtom);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        const loadComponents = async () => {
            try {
                setError(null);
                await fetchComponents();
            } catch (err) {
                setError('Nie udało się załadować komponentów');
                console.error('Error loading components:', err);
            }
        };

        loadComponents();
    }, [fetchComponents]);

    const handleRefresh = async () => {
        try {
            setError(null);
            await refreshComponents();
        } catch (err) {
            setError('Nie udało się odświeżyć komponentów');
            console.error('Error refreshing components:', err);
        }
    };

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

    const renderSpecs = (component: ComponentSpec) => {
        if (isProcessorSpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Rdzenie:</span> {component.cores} / {component.threads}</p>
                    <p><span className="font-medium">Socket:</span> {component.socketType}</p>
                    <p><span className="font-medium">Taktowanie:</span> {component.baseClock}</p>
                </div>
            );
        }

        if (isGraphicsCardSpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">VRAM:</span> {component.memorySize}GB {component.gddr}</p>
                    <p><span className="font-medium">TDP:</span> {component.powerDraw}W</p>
                </div>
            );
        }

        if (isMemorySpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Typ:</span> {component.type}</p>
                    <p><span className="font-medium">Pojemność:</span> {component.capacity}GB</p>
                    <p><span className="font-medium">Prędkość:</span> {component.speed}</p>
                    <p><span className="font-medium">Opóźnienie:</span> {component.latency}</p>
                </div>
            );
        }

        if (isMotherboardSpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Chipset:</span> {component.chipset}</p>
                    <p><span className="font-medium">Socket:</span> {component.socketType}</p>
                    <p><span className="font-medium">Format:</span> {component.format}</p>
                    <p><span className="font-medium">RAM:</span> {component.ramslots} sloty, max {component.ramCapacity}GB</p>
                </div>
            );
        }

        if (isPowerSupplySpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Moc:</span> {component.maxPowerWatt}W</p>
                </div>
            );
        }

        if (isStorageSpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Pojemność:</span> {component.capacity}GB</p>
                </div>
            );
        }

        if (isCoolerSpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Kompatybilne sockety:</span> {component.coolerSocketsType.join(', ')}</p>
                </div>
            );
        }

        if (isCaseSpec(component)) {
            return (
                <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Format:</span> {component.format}</p>
                </div>
            );
        }

        return null;
    };

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-midnight-dark">Komponenty PC</h2>

                    </div>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-3 bg-white border-2 border-ocean-blue text-ocean-blue rounded-lg hover:bg-ocean-light-blue font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Odśwież
                    </button>
                    <button className="px-6 py-3 bg-gradient-blue-horizontal text-white rounded-lg hover:bg-gradient-blue-horizontal-hover font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Dodaj komponent
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Szukaj po producencie lub modelu..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors"
                            />
                        </div>
                    </div>

                    <div className="sm:w-64">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue transition-colors"
                        >
                            <option value="all">Wszystkie typy</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>
                                    {componentTypeNames[type] || type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                        Wyświetlono: <span className="font-semibold text-midnight-dark">{filteredComponents.length}</span>
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">
                        Łącznie: <span className="font-semibold text-midnight-dark">{componentList.length}</span>
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-ocean-dark-blue to-ocean-blue text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Typ</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Producent</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Model</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Specyfikacja</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold">Akcje</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {filteredComponents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-gray-600 font-medium">Nie znaleziono komponentów</p>
                                        <p className="text-sm text-gray-500">Spróbuj zmienić kryteria wyszukiwania</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredComponents.map((component, index) => (
                                <tr key={`${component.componentType}-${component.brand}-${component.model}-${index}`} className="hover:bg-ocean-white transition-colors">
                                    <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ocean-light-blue text-ocean-dark-blue">
                                                {componentTypeNames[component.componentType] || component.componentType}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-midnight-dark">{component.brand}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-900">{component.model}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderSpecs(component)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-ocean-blue hover:bg-ocean-light-blue rounded-lg transition-colors" title="Edytuj">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button className="p-2 text-ocean-red hover:bg-red-50 rounded-lg transition-colors" title="Usuń">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>
    );
}

export default Components;