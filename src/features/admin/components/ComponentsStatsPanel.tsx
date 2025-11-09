import {ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";
import {useGetComponentsStats} from "../hooks/useGetComponentsStats.ts";
import type {ComponentsStats} from "../../../types/ComponentsStats.ts";

export default function ComponentsStatsPanel() {
    const { data, isLoading, isError } = useGetComponentsStats();
    const [expanded, setExpanded] = useState<string | null>(null);

    if (isLoading) return <p className="text-gray-500 text-sm">Ładowanie statystyk...</p>;
    if (isError) return <p className="text-red-600 text-sm">Błąd podczas pobierania danych.</p>;

    return (
        <div className="bg-white border border-ocean-light-blue rounded-xl shadow-sm p-4 mb-6">
            <h2 className="text-lg font-semibold text-midnight-dark mb-3">
                Aktualny stan ofert w bazie
            </h2>

            <div className="divide-y divide-gray-200">
                {data?.map((stat: ComponentsStats) => (
                    <div key={stat.componentType} className="py-2">
                        <div
                            className="flex items-center justify-between cursor-pointer hover:bg-ocean-light-blue/10 px-2 py-1 rounded-md transition-colors"
                            onClick={() =>
                                setExpanded(expanded === stat.componentType ? null : stat.componentType)
                            }
                        >
                            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-midnight-dark">
                  {stat.componentType.replaceAll("_", " ")}
                </span>
                                <span className="text-xs bg-ocean-light-blue text-ocean-dark-blue font-semibold px-2 py-0.5 rounded-full">
                  {stat.total}
                </span>
                            </div>

                            {expanded === stat.componentType ? (
                                <ChevronUp className="w-4 h-4 text-ocean-dark-blue" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-ocean-dark-blue" />
                            )}
                        </div>

                        {expanded === stat.componentType && (
                            <div className="mt-2 pl-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.entries(stat.shopBreakdown).map(([shop, count]) => (
                                    <div
                                        key={shop}
                                        className="flex items-center justify-between bg-gray-50 border border-ocean-light-blue rounded-md px-2 py-1 text-sm text-midnight-dark"
                                    >
                                        <span className="font-medium capitalize">{shop}</span>
                                        <span className="font-semibold text-ocean-blue">{count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}