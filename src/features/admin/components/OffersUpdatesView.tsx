import { useOfferUpdates } from "../hooks/useOffersUpdates.ts";
import type { OfferUpdateInfo} from "../../../types/OfferUpdateInfo.ts";
import type { OfferShopUpdate } from "../../../types/OfferShopUpdate.ts";
import {useShopOfferUpdates} from "../hooks/useShopUpdates.ts";

import { ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceStrict } from "date-fns";
import { pl } from "date-fns/locale";


function ShopUpdateSubscriber({ updateId, isActive }: { updateId: number; isActive: boolean }) {
    useShopOfferUpdates(updateId, isActive);
    return null;
}

const OffersUpdatesView = () => {
    const { data: updates = [], isLoading, error } = useOfferUpdates();

    if (isLoading) return <p>Ładowanie aktualizacji...</p>;
    if (error) return <p>Błąd podczas pobierania danych.</p>;
    if (!updates.length) return <p>Brak aktualizacji.</p>;

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

                const duration =
                    finished &&
                    formatDistanceStrict(started, finished, { locale: pl, addSuffix: false });

                return (
                    <div
                        key={update.id}
                        className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg">Aktualizacja #{update.id}</h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {finished
                                        ? `Czas trwania: ${duration}`
                                        : "Trwa aktualizacja..."}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    finished
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700 animate-pulse"
                                }`}
                            >
                {finished ? "Zakończona" : "W toku..."}
              </span>
                        </div>

                        <div className="text-sm text-gray-600 mt-3">
                            <strong>Start:</strong> {started.toLocaleString()}
                        </div>

                        {update.shops?.length ? (
                            <ul className="mt-5 space-y-4">
                                {update.shops.map((shop: OfferShopUpdate) => (
                                    <li
                                        key={shop.shopName}
                                        className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <div className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                                            <span>{shop.shopName}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {Object.entries(shop.totalOffers ?? {}).map(([type, total]) => {
                                                const added = shop.offersAdded?.[type];
                                                const deleted = shop.offersDeleted?.[type];

                                                return (
                                                    <div
                                                        key={type}
                                                        className="inline-flex items-center gap-2 bg-white border border-gray-200 px-2 py-1 rounded-lg text-sm shadow-sm"
                                                    >
                                                        <span className="font-medium text-gray-800">{type}</span>
                                                        <span className="text-gray-700">{total}</span>

                                                        {added && added > 0 && (
                                                            <span className="flex items-center text-green-600 font-medium">
                                <ArrowUp className="w-4 h-4 mr-0.5" />+{added}
                              </span>
                                                        )}
                                                        {deleted && deleted > 0 && (
                                                            <span className="flex items-center text-red-600 font-medium">
                                <ArrowDown className="w-4 h-4 mr-0.5" />−{deleted}
                              </span>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {(!shop.totalOffers ||
                                                Object.keys(shop.totalOffers).length === 0) && (
                                                <p className="text-sm text-gray-500">Brak danych o podzespołach.</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 mt-3">
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