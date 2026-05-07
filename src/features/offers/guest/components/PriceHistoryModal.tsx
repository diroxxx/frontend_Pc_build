import { useState, useMemo } from "react";
import { X, TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { ComponentOffer } from "../../../../shared/dtos/OfferBase.ts";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { useGetComponentMinMax } from "../hooks/useGetComponentMinMax.ts";
import { useGetMonthlyAvgPrices } from "../hooks/useGetMonthlyAvgPrices.ts";

const MONTH_NAMES = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];

interface Props {
    offer: ComponentOffer;
    onClose: () => void;
}


const SHOP_PALETTE = [
    "#4f8ef7", // blue
    "#f59e0b", // amber
    "#22c55e", // green
    "#a78bfa", // violet
    "#f43f5e", // rose
    "#06b6d4", // cyan
    "#fb923c", // orange
    "#e879f9", // fuchsia
];

const shopColors: Record<string, string> = {
    Allegro: "#f59e0b",
    OLX: "#22c55e",
    AllegroLokalnie: "#a78bfa",
};

const getShopColor = (shop: string, index: number) =>
    shopColors[shop] ?? SHOP_PALETTE[index % SHOP_PALETTE.length];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-dark-surface border border-dark-border rounded-xl px-4 py-3 shadow-2xl text-xs">
            <p className="text-dark-muted mb-2 font-medium">{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.name} className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                    <span className="text-dark-text">{entry.name}:</span>
                    <span className="font-bold text-white">{entry.value.toLocaleString("pl-PL")} zł</span>
                </div>
            ))}
        </div>
    );
};

type ViewMode = "overall" | "by-shop";

export const PriceHistoryModal = ({ offer, onClose }: Props) => {
    const [viewMode, setViewMode] = useState<ViewMode>("overall");

    const { data: minMaxData } = useGetComponentMinMax(offer.id!);
    const { data: monthlyAvgPrices } = useGetMonthlyAvgPrices(offer.id!);

    const chartOverall = useMemo(() => {
        if (!monthlyAvgPrices?.length) return [];
        const byMonth: Record<number, number[]> = {};
        for (const shop of monthlyAvgPrices) {
            for (const { month, avgPrice } of shop.monthlyPrices) {
                (byMonth[month] ??= []).push(avgPrice);
            }
        }
        return Object.entries(byMonth)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([month, prices]) => ({
                date: MONTH_NAMES[Number(month) - 1],
                price: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
            }));
    }, [monthlyAvgPrices]);

    const chartByShop = useMemo(() => {
        if (!monthlyAvgPrices?.length) return [];
        const byMonth: Record<number, Record<string, number>> = {};
        for (const { shop, monthlyPrices } of monthlyAvgPrices) {
            for (const { month, avgPrice } of monthlyPrices) {
                (byMonth[month] ??= {})[shop] = Math.round(avgPrice);
            }
        }
        return Object.entries(byMonth)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([month, shops]) => ({ date: MONTH_NAMES[Number(month) - 1], ...shops }));
    }, [monthlyAvgPrices]);

    const availableShops = useMemo(
        () => monthlyAvgPrices?.map((s) => s.shop) ?? [],
        [monthlyAvgPrices]
    );

    const lastMonthPrice = chartOverall.at(-1)?.price ?? 0;
    const prevMonthPrice = chartOverall.at(-2)?.price ?? 0;
    const diff = lastMonthPrice - prevMonthPrice;
    const diffPct = prevMonthPrice ? Math.round((diff / prevMonthPrice) * 100) : 0;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-dark-surface border border-dark-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-dark-border">
                    <div>
                        <h2 className="text-base font-bold text-dark-text leading-tight">
                            {offer.brand} {offer.model}
                        </h2>
                        <p className="text-xs text-dark-muted mt-0.5">Historia cen · ostatnie 12 miesięcy</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-dark-muted hover:text-dark-text hover:bg-dark-surface2 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-dark-border border-b border-dark-border">
                    <div className="px-5 py-4">
                        <p className="text-[11px] text-dark-muted uppercase tracking-wide mb-1">Aktualna cena</p>
                        <p className="text-xl font-extrabold text-white">{offer.price.toLocaleString("pl-PL")} zł</p>
                    </div>
                    <div className="px-5 py-4">
                        <p className="text-[11px] text-dark-muted uppercase tracking-wide mb-1">Min / Max (rok)</p>
                        <p className="text-sm font-semibold text-dark-text">
                            <span className="text-green-400">{minMaxData?.min.toLocaleString("pl-PL")}</span>
                            <span className="text-dark-muted mx-1">/</span>
                            <span className="text-red-400">{minMaxData?.max.toLocaleString("pl-PL")}</span>
                            <span className="text-dark-muted text-xs ml-1">zł</span>
                        </p>
                    </div>
                    <div className="px-5 py-4">
                        <p className="text-[11px] text-dark-muted uppercase tracking-wide mb-1">Zmiana (rok)</p>
                        <div className="flex items-center gap-1.5">
                            {diff < 0
                                ? <TrendingDown size={16} className="text-green-400" />
                                : diff > 0
                                    ? <TrendingUp size={16} className="text-red-400" />
                                    : <Minus size={16} className="text-dark-muted" />
                            }
                            <span className={`text-sm font-bold ${diff < 0 ? "text-green-400" : diff > 0 ? "text-red-400" : "text-dark-muted"}`}>
                                {diff > 0 ? "+" : ""}{diff.toLocaleString("pl-PL")} zł ({diffPct}%)
                            </span>
                        </div>
                    </div>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-2 px-6 pt-4">
                    <button
                        onClick={() => setViewMode("overall")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === "overall"
                                ? "bg-dark-accent text-white"
                                : "bg-dark-surface2 text-dark-muted hover:text-dark-text"
                        }`}
                    >
                        Ogólna
                    </button>
                    <button
                        onClick={() => setViewMode("by-shop")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === "by-shop"
                                ? "bg-dark-accent text-white"
                                : "bg-dark-surface2 text-dark-muted hover:text-dark-text"
                        }`}
                    >
                        Według sklepów
                    </button>
                </div>

                {/* Chart */}
                <div className="px-4 pb-5 pt-3">
                    <ResponsiveContainer width="100%" height={240}>
                        {viewMode === "overall" ? (
                            <LineChart data={chartOverall} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#252a3a" />
                                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                                    tickFormatter={(v) => `${v} zł`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    name="Cena"
                                    stroke="#4f8ef7"
                                    strokeWidth={2.5}
                                    dot={{ fill: "#4f8ef7", r: 3, strokeWidth: 0 }}
                                    activeDot={{ r: 5, fill: "#4f8ef7" }}
                                />
                            </LineChart>
                        ) : (
                            <LineChart data={chartByShop} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#252a3a" />
                                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                                    tickFormatter={(v) => `${v} zł`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 12, color: "#6b7280", paddingTop: 8 }} />
                                {availableShops.map((shop, i) => (
                                    <Line
                                        key={shop}
                                        type="monotone"
                                        dataKey={shop}
                                        stroke={getShopColor(shop, i)}
                                        strokeWidth={2}
                                        dot={{ fill: getShopColor(shop, i), r: 3, strokeWidth: 0 }}
                                        activeDot={{ r: 5 }}
                                    />
                                ))}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
