import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { ComponentOffer } from "../../../shared/dtos/OfferBase.ts";

const CATEGORY_LABELS: Record<string, string> = {
    PROCESSOR: "CPU",
    GRAPHICS_CARD: "GPU",
    MOTHERBOARD: "Płyta główna",
    CPU_COOLER: "Chłodzenie",
    CASE_PC: "Obudowa",
    MEMORY: "RAM",
    POWER_SUPPLY: "Zasilacz",
    STORAGE: "Pamięć",
};

const CATEGORY_COLORS: Record<string, string> = {
    PROCESSOR: "#4f8ef7",
    GRAPHICS_CARD: "#a78bfa",
    MEMORY: "#22c55e",
    MOTHERBOARD: "#f59e0b",
    POWER_SUPPLY: "#f43f5e",
    STORAGE: "#06b6d4",
    CASE_PC: "#fb923c",
    CPU_COOLER: "#e879f9",
};

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { name, value, pct } = payload[0].payload;
    return (
        <div className="bg-dark-surface border border-dark-border rounded-xl px-3 py-2 shadow-2xl text-xs">
            <p className="text-dark-text font-semibold">{name}</p>
            <p className="text-dark-text font-bold mt-0.5">{value.toLocaleString("pl-PL")} zł</p>
            <p className="text-dark-muted">{pct}%</p>
        </div>
    );
};

interface Props {
    offers: ComponentOffer[];
    totalPrice: number;
}

export default function BudgetBreakdown({ offers, totalPrice }: Props) {
    const data = useMemo(() =>
        offers.map((o) => ({
            name: CATEGORY_LABELS[o.componentType] ?? o.componentType,
            value: o.price,
            pct: totalPrice > 0 ? Math.round((o.price / totalPrice) * 100) : 0,
            color: CATEGORY_COLORS[o.componentType] ?? "#6b7280",
            componentType: o.componentType,
        })),
        [offers, totalPrice]
    );

    return (
        <div className="px-4 py-4 space-y-4">
            {/* Donut chart z ceną w środku */}
            <div className="relative">
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={52}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry) => (
                                <Cell key={entry.componentType} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Łączna cena w środku donuta */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-dark-muted uppercase tracking-wide">Łącznie</span>
                    <span className="text-base font-extrabold text-dark-text leading-tight">
                        {totalPrice.toLocaleString("pl-PL")} zł
                    </span>
                </div>
            </div>

            {/* Legenda — pełna szerokość, każdy wiersz z nazwą i wartością */}
            <div className="space-y-2">
                {data.map((entry) => (
                    <div key={entry.componentType} className="flex items-center gap-2">
                        <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: entry.color }}
                        />
                        <span className="text-xs text-dark-muted flex-1 truncate">{entry.name}</span>
                        <span className="text-xs font-bold text-dark-text flex-shrink-0 w-8 text-right">
                            {entry.pct}%
                        </span>
                        <span className="text-xs text-dark-muted flex-shrink-0 w-20 text-right">
                            {entry.value.toLocaleString("pl-PL")} zł
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
