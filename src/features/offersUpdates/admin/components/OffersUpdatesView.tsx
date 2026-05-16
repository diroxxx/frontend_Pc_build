import { useOfferUpdates } from "../hooks/useOffersUpdates.ts";
import type { OfferUpdateInfo } from "../dto/OfferUpdateInfo.ts";
import type { OfferShopUpdate } from "../dto/OfferShopUpdate.ts";
import { useShopOfferUpdates } from "../hooks/useShopUpdates.ts";
import { ArrowUp, ArrowDown, CheckCircle2, Loader2, XCircle, History, HelpCircle } from "lucide-react";
import { formatDistanceStrict } from "date-fns";
import { pl } from "date-fns/locale";
import { LoadingSpinner } from "../../../../assets/components/ui/LoadingSpinner.tsx";

function ShopUpdateSubscriber({ updateId, isActive }: { updateId: number; isActive: boolean }) {
    useShopOfferUpdates(updateId, isActive);
    return null;
}

const STATUS_ICON = {
    RUNNING:   <Loader2 className="w-3.5 h-3.5 text-ocean-blue animate-spin" />,
    COMPLETED: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
    FAILED:    <XCircle className="w-3.5 h-3.5 text-red-400" />,
};

function ShopCell({ shop }: { shop: OfferShopUpdate }) {
    const totalAdded   = Object.values(shop.offersAdded   ?? {}).reduce((s, v) => s + v, 0);
    const totalDeleted = Object.values(shop.offersDeleted ?? {}).reduce((s, v) => s + v, 0);

    const allTypes = Array.from(new Set([
        ...Object.keys(shop.offersAdded   ?? {}),
        ...Object.keys(shop.offersDeleted ?? {}),
    ])).sort().filter(t => (shop.offersAdded?.[t] ?? 0) + (shop.offersDeleted?.[t] ?? 0) > 0);

    return (
        <div className="px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs min-w-[130px]">
            {/* Shop header */}
            <div className="flex items-center gap-1.5 mb-1">
                {STATUS_ICON[shop.status as keyof typeof STATUS_ICON]}
                <span className="font-semibold text-gray-700">{shop.shopName}</span>
                <div className="flex items-center gap-1 ml-auto">
                    {totalAdded > 0 && (
                        <span className="flex items-center gap-0.5 font-bold text-green-600">
                            <ArrowUp className="w-2.5 h-2.5" />{totalAdded}
                        </span>
                    )}
                    {totalDeleted > 0 && (
                        <span className="flex items-center gap-0.5 font-bold text-red-400">
                            <ArrowDown className="w-2.5 h-2.5" />{totalDeleted}
                        </span>
                    )}
                    {totalAdded === 0 && totalDeleted === 0 && shop.status === 'COMPLETED' && (
                        <span className="text-gray-300">—</span>
                    )}
                </div>
            </div>

            {/* Per-type details */}
            {allTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 pl-5">
                    {allTypes.map((type) => {
                        const added   = shop.offersAdded?.[type]   ?? 0;
                        const deleted = shop.offersDeleted?.[type] ?? 0;
                        const isUnknown = type === "UNKNOWN";
                        return (
                            <span
                                key={type}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${
                                    isUnknown
                                        ? "bg-amber-50 border-amber-300 text-amber-700"
                                        : "bg-white border-gray-200 text-gray-500"
                                }`}
                                title={isUnknown ? "Nieprzypisane — brak dopasowania do komponentu" : undefined}
                            >
                                {isUnknown && <HelpCircle className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />}
                                <span>{type}</span>
                                {added > 0 && (
                                    <span className={`flex items-center gap-0.5 font-semibold ${isUnknown ? "text-amber-600" : "text-green-600"}`}>
                                        <ArrowUp className="w-2 h-2" />{added}
                                    </span>
                                )}
                                {deleted > 0 && (
                                    <span className="flex items-center gap-0.5 text-red-400 font-semibold">
                                        <ArrowDown className="w-2 h-2" />{deleted}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function UpdateRow({ update, isEven }: { update: OfferUpdateInfo; isEven: boolean }) {
    const started  = new Date(update.startedAt);
    const finished = update.finishedAt ? new Date(update.finishedAt) : null;
    const isActive = update.shops?.some(s => s.status === 'RUNNING') ?? false;

    const duration = finished
        ? formatDistanceStrict(started, finished, { locale: pl })
        : null;

    const totalAdded   = update.shops?.reduce((sum, s) =>
        sum + Object.values(s.offersAdded   ?? {}).reduce((a, v) => a + v, 0), 0) ?? 0;
    const totalDeleted = update.shops?.reduce((sum, s) =>
        sum + Object.values(s.offersDeleted ?? {}).reduce((a, v) => a + v, 0), 0) ?? 0;

    return (
        <tr className={`border-b border-gray-100 last:border-0 ${isEven ? 'bg-white' : 'bg-gray-50/50'} ${isActive ? 'ring-1 ring-inset ring-ocean-blue/30' : ''}`}>
            {/* ID */}
            <td className="px-4 py-3 text-xs font-bold text-gray-400 whitespace-nowrap">
                #{update.id}
            </td>

            {/* Date */}
            <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">
                {started.toLocaleString('pl-PL', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                })}
            </td>

            {/* Duration */}
            <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">
                {isActive ? (
                    <span className="flex items-center gap-1 text-ocean-blue font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" /> W toku
                    </span>
                ) : duration ?? '—'}
            </td>

            {/* Total changes */}
            <td className="px-3 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    {totalAdded > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-bold text-green-600">
                            <ArrowUp className="w-3 h-3" />{totalAdded}
                        </span>
                    )}
                    {totalDeleted > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-bold text-red-400">
                            <ArrowDown className="w-3 h-3" />{totalDeleted}
                        </span>
                    )}
                    {totalAdded === 0 && totalDeleted === 0 && !isActive && (
                        <span className="text-xs text-gray-300">brak</span>
                    )}
                </div>
            </td>

            {/* Shops inline */}
            <td className="px-3 py-3">
                <div className="flex flex-wrap gap-1.5">
                    {update.shops?.map(shop => (
                        <ShopCell key={shop.shopName} shop={shop} />
                    )) ?? <span className="text-xs text-gray-300">—</span>}
                </div>
            </td>
        </tr>
    );
}

const OffersUpdatesView = () => {
    const { data: updates = [], isLoading, error } = useOfferUpdates();

    if (isLoading)
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-3 text-gray-500 text-sm">Ładowanie aktualizacji...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">Błąd podczas pobierania danych.</p>
            </div>
        );

    if (!updates.length)
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <History className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Brak historii aktualizacji.</p>
            </div>
        );

    const sortedUpdates = [...updates].sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );

    return (
        <div>
            {sortedUpdates.map(u => (
                <ShopUpdateSubscriber key={u.id} updateId={u.id} isActive={!u.finishedAt} />
            ))}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Historia aktualizacji ({sortedUpdates.length})
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Data</th>
                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Czas</th>
                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Zmiany</th>
                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Sklepy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUpdates.map((update, i) => (
                                <UpdateRow key={update.id} update={update} isEven={i % 2 === 0} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OffersUpdatesView;
