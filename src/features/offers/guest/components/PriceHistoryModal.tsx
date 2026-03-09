import { useState } from "react";
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

interface Props {
    offer: ComponentOffer;
    onClose: () => void;
}

const mockOverall = [
    { date: "Sty 25", price: 1520 },
    { date: "Lut 25", price: 1480 },
    { date: "Mar 25", price: 1510 },
    { date: "Kwi 25", price: 1390 },
    { date: "Maj 25", price: 1350 },
    { date: "Cze 25", price: 1300 },
    { date: "Lip 25", price: 1280 },
    { date: "Sie 25", price: 1260 },
    { date: "Wrz 25", price: 1310 },
    { date: "Paź 25", price: 1290 },
    { date: "Lis 25", price: 1240 },
    { date: "Gru 25", price: 1200 },
];

const mockByShop = [
    { date: "Sty 25", Allegro: 1550, OLX: 1480, "X-Kom": 1620 },
    { date: "Lut 25", Allegro: 1510, OLX: 1440, "X-Kom": 1590 },
    { date: "Mar 25", Allegro: 1540, OLX: 1460, "X-Kom": 1560 },
    { date: "Kwi 25", Allegro: 1420, OLX: 1350, "X-Kom": 1500 },
    { date: "Maj 25", Allegro: 1390, OLX: 1300, "X-Kom": 1480 },
    { date: "Cze 25", Allegro: 1340, OLX: 1260, "X-Kom": 1420 },
    { date: "Lip 25", Allegro: 1310, OLX: 1240, "X-Kom": 1400 },
    { date: "Sie 25", Allegro: 1290, OLX: 1220, "X-Kom": 1380 },
    { date: "Wrz 25", Allegro: 1340, OLX: 1270, "X-Kom": 1410 },
    { date: "Paź 25", Allegro: 1320, OLX: 1250, "X-Kom": 1390 },
    { date: "Lis 25", Allegro: 1270, OLX: 1200, "X-Kom": 1350 },
    { date: "Gru 25", Allegro: 1230, OLX: 1160, "X-Kom": 1320 },
];

const shopColors: Record<string, string> = {
    Allegro: "#f59e0b",
    OLX: "#22c55e",
    "X-Kom": "#a78bfa",
};

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

    const firstPrice = mockOverall[0].price;
    const lastPrice = mockOverall[mockOverall.length - 1].price;
    const diff = lastPrice - firstPrice;
    const diffPct = ((diff / firstPrice) * 100).toFixed(1);
    const minPrice = Math.min(...mockOverall.map(d => d.price));
    const maxPrice = Math.max(...mockOverall.map(d => d.price));

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
                            <span className="text-green-400">{minPrice.toLocaleString("pl-PL")}</span>
                            <span className="text-dark-muted mx-1">/</span>
                            <span className="text-red-400">{maxPrice.toLocaleString("pl-PL")}</span>
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
                            <LineChart data={mockOverall} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                            <LineChart data={mockByShop} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#252a3a" />
                                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} width={60}
                                    tickFormatter={(v) => `${v} zł`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 12, color: "#6b7280", paddingTop: 8 }} />
                                {Object.entries(shopColors).map(([shop, color]) => (
                                    <Line
                                        key={shop}
                                        type="monotone"
                                        dataKey={shop}
                                        stroke={color}
                                        strokeWidth={2}
                                        dot={{ fill: color, r: 3, strokeWidth: 0 }}
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
