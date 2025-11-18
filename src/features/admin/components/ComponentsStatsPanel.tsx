import {ChevronDown, ChevronUp, Loader2} from "lucide-react";
import {useState} from "react";
import {useGetComponentsStats} from "../hooks/useGetComponentsStats.ts";
import type {ComponentsStats} from "../../../types/ComponentsStats.ts";

export default function ComponentsStatsPanel() {
    const { data, isLoading, isError, isFetching } = useGetComponentsStats();
    const [expanded, setExpanded] = useState<string | null>(null);

    if (isLoading) return <p className="text-gray-500 text-sm">Ładowanie statystyk...</p>;
    if (isError) return <p className="text-red-600 text-sm">Błąd podczas pobierania danych.</p>;

    const sumAllOffers = ():number => {
        let sum = 0;
        data?.forEach((stat: ComponentsStats) => {
            sum += stat.total;
        });
        return sum;
    }

 return (
        <div className="bg-white border border-ocean-light-blue rounded-xl shadow-sm p-3 sm:p-4 mb-6 relative">
            {isFetching && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-ocean-blue text-xs sm:text-sm">
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                    <span className="hidden sm:inline">Odświeżanie...</span>
                </div>
            )}

            <h2 className="text-base sm:text-lg font-semibold text-midnight-dark mb-3 pr-20 sm:pr-0">
                Aktualny stan ofert w bazie - { sumAllOffers()}
            </h2>

            <div className={`divide-y divide-gray-200 transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                {data?.map((stat: ComponentsStats) => (
                    <div key={stat.componentType} className="py-2">
                        <div
                            className="flex items-center justify-between cursor-pointer hover:bg-ocean-light-blue/10 px-2 py-1 rounded-md transition-colors"
                            onClick={() =>
                                setExpanded(expanded === stat.componentType ? null : stat.componentType)
                            }
                        >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <span className="text-xs sm:text-sm font-medium text-midnight-dark truncate">
                                  {stat.componentType.replaceAll("_", " ")}
                                </span>
                                <span className="text-xs bg-ocean-light-blue text-ocean-dark-blue font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                                  {stat.total}
                                </span>
                            </div>

                            {expanded === stat.componentType ? (
                                <ChevronUp className="w-4 h-4 text-ocean-dark-blue flex-shrink-0" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-ocean-dark-blue flex-shrink-0" />
                            )}
                        </div>

                        {expanded === stat.componentType && (
    <div className="mt-2 pl-2 sm:pl-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {Object.entries(stat.shopBreakdown).map(([shop, count]) => (
            <div
                key={shop}
                className="flex items-center justify-between bg-gray-50 border border-ocean-light-blue rounded-md px-2 py-1.5 sm:py-1 text-xs sm:text-sm text-midnight-dark"
            >
                <span className="font-medium capitalize truncate mr-2">{shop}</span>
                <span className="font-semibold text-ocean-blue flex-shrink-0">{count}</span>
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