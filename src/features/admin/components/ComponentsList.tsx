import {useFetchComponents} from "../hooks/useFetchComponents.ts";
import {Component} from "./component.tsx";
// import type {ComponentItem} from "../../../types/BaseItemDto.ts";
import {useState} from "react";
import { ItemType } from "../../../types/BaseItemDto.ts";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.tsx";

interface ComponentsProps {
    page: number;
    filters: { itemType: ItemType | undefined; brand: string };
}

const Components = ({ page, filters }: ComponentsProps) => {
    const { data, isLoading, error, isFetching, isPlaceholderData } = useFetchComponents(page, filters);

    if (isLoading) return <LoadingSpinner />;
    if (isFetching && isPlaceholderData) return <LoadingSpinner />;
    if (error) return <p className="p-4 text-ocean-red">Błąd podczas pobierania danych.</p>;

    const components = data?.items ?? [];

    return (
        <div className="space-y-4">
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
                                Brak komponentów w bazie lub brak komponentów spełniających kryteria wyszukiwania.
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