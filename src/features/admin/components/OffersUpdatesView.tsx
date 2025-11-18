import { useOfferUpdates } from "../hooks/useOffersUpdates.ts";
import type { OfferUpdateInfo} from "../../../types/OfferUpdateInfo.ts";
import type { OfferShopUpdate } from "../../../types/OfferShopUpdate.ts";
import {useShopOfferUpdates} from "../hooks/useShopUpdates.ts";

import { ArrowUp, ArrowDown, CheckCircle2, Loader2 } from "lucide-react";
import { formatDistanceStrict } from "date-fns";
import { pl } from "date-fns/locale";
import { LoadingSpinner } from "../../../assets/components/ui/LoadingSpinner.tsx";


function ShopUpdateSubscriber({ updateId, isActive }: { updateId: number; isActive: boolean }) {
    useShopOfferUpdates(updateId, isActive);
    return null;
}

const OffersUpdatesView = () => {
    const { data: updates = [], isLoading, error } = useOfferUpdates();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-midnight-dark text-sm">Ładowanie aktualizacji...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-ocean-red/10 border border-ocean-red/30 rounded-lg">
                <p className="text-ocean-red font-medium">Błąd podczas pobierania danych.</p>
            </div>
        );
    }

    if (!updates.length) {
        return (
            <div className="text-center p-8 bg-ocean-white rounded-lg border border-ocean-light-blue">
                <p className="text-midnight-dark">Brak aktualizacji.</p>
            </div>
        );
    }

    const sortedUpdates = [...updates].sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return (
        <div className="space-y-6">
            {sortedUpdates.map((u) => (
                <ShopUpdateSubscriber key={u.id} updateId={u.id} isActive={!u.finishedAt} />
            ))}

            {sortedUpdates.map((update: OfferUpdateInfo) => {
                const started = new Date(update.startedAt);
                const finished = update.finishedAt ? new Date(update.finishedAt) : null;
                
                // Sprawdź czy jakikolwiek sklep jest w trakcie
                const isActive = update.shops?.some(shop => shop.status === 'RUNNING') ?? false;

                const duration =
                    finished &&
                    formatDistanceStrict(started, finished, { locale: pl, addSuffix: false });

                return (
                    <div
                        key={update.id}
                        className={`border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-all ${
                            isActive ? 'border-ocean-blue' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h2 className="font-semibold text-lg text-midnight-dark">
                                        Aktualizacja #{update.id}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {started.toLocaleString('pl-PL', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                        isActive
                                            ? "bg-ocean-blue/10 text-ocean-blue"
                                            : "bg-ocean-light-blue/30 text-ocean-dark-blue"
                                    }`}
                                >
                                    {isActive ? "W toku..." : "Zakończona"}
                                </span>
                                {!isActive && duration && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Czas: {duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Shops */}
                        {update.shops?.length ? (
                            <div className="space-y-3">
                                {update.shops.map((shop: OfferShopUpdate) => {
                                    const totalDeleted = Object.values(shop.offersDeleted ?? {})
                                        .reduce((sum, val) => sum + val, 0);

                                    const totalAdded = Object.values(shop.offersAdded ?? {})
                                        .reduce((sum, val) => sum + val, 0);

                                    // Połącz typy z dodanych i usuniętych ofert
                                    const allTypes = new Set([
                                        ...Object.keys(shop.offersAdded ?? {}),
                                        ...Object.keys(shop.offersDeleted ?? {})
                                    ]);
                                    
                                    return (
                                        <div
                                            key={shop.shopName}
                                            className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {shop.status === 'RUNNING' && (
                                                        <Loader2 className="w-5 h-5 text-ocean-blue animate-spin" />
                                                    )}
                                                    {shop.status === 'COMPLETED' && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    )}
                                                    {shop.status === 'FAILED' && (
                                                        <CheckCircle2 className="w-5 h-5 text-ocean-red" />
                                                    )}
                                                    <h3 className="font-semibold text-midnight-dark">
                                                        {shop.shopName}
                                                    </h3>
                                                </div>
                                                
                                                {/* Podsumowanie zmian */}
                                                <div className="flex items-center gap-3">
                                                    {totalAdded > 0 && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <ArrowUp className="w-4 h-4 text-green-600" />
                                                            <span className="font-semibold text-green-600">
                                                                {totalAdded}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {totalDeleted > 0 && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <ArrowDown className="w-4 h-4 text-ocean-red" />
                                                            <span className="font-semibold text-ocean-red">
                                                                {totalDeleted}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {allTypes.size > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.from(allTypes)
                                                        .sort()
                                                        .map((type) => {
                                                            const added = shop.offersAdded?.[type] ?? 0;
                                                            const deleted = shop.offersDeleted?.[type] ?? 0;
                                                            
                                                            if (added === 0 && deleted === 0) return null;

                                                            return (
                                                                <div
                                                                    key={type}
                                                                    className="inline-flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm"
                                                                >
                                                                    <span className="text-gray-700 font-medium">{type}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        {added > 0 && (
                                                                            <div className="flex items-center gap-0.5">
                                                                                <ArrowUp className="w-3.5 h-3.5 text-green-600" />
                                                                                <span className="font-semibold text-green-600">
                                                                                    {added}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {deleted > 0 && (
                                                                            <div className="flex items-center gap-0.5">
                                                                                <ArrowDown className="w-3.5 h-3.5 text-ocean-red" />
                                                                                <span className="font-semibold text-ocean-red">
                                                                                    {deleted}
                                                                                </span>
                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">
                                                    Brak zmian w tym sklepie
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic mt-3">
                                Brak danych o sklepach.
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
export default OffersUpdatesView;