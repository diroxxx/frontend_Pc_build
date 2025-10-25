import {useFetchComponents} from "../hooks/useFetchComponents.ts";
import {Component} from "./component.tsx";
import type {ComponentItem} from "../../../types/BaseItemDto.ts";

const Components = () => {
    const { data: components = [], isLoading, error } = useFetchComponents();

    if (isLoading) return <p className="p-4 text-midnight-dark">Ładowanie komponentów...</p>;
    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-midnight-dark">Lista komponentów</h2>
                    <button className="px-3 py-1.5 bg-ocean-dark-blue text-ocean-white rounded hover:bg-ocean-blue text-sm font-medium transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Dodaj komponent
                    </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-midnight-dark">
                    <span>Wyświetlono: <strong>{components.length}</strong></span>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-ocean-dark-blue text-ocean-white">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Typ</th>
                        <th className="px-3 py-2 text-left font-medium">Marka</th>
                        <th className="px-3 py-2 text-left font-medium">Model</th>
                        <th className="px-3 py-2 text-left font-medium">Szczegóły</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {components.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-3 py-8 text-center text-midnight-dark">
                                Brak komponentów w bazie
                            </td>
                        </tr>
                    ) : (
                        components.map((component) => (
                            <Component key={`${component.componentType}-${component.id}`} component={component} />
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Components;