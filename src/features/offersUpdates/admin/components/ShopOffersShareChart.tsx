import { useGetOffersShopsAmountStats } from "../hooks/useGetOffersShopsAmountStats.ts";
import { Loader2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#7dd3fc", "#38bdf8", "#0ea5e9", "#bae6fd", "#0284c7", "#e0f2fe"];

export default function ShopOffersShareChart() {
    const { data, isLoading, error } = useGetOffersShopsAmountStats();

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
            </div>
        );

    if (error || !data)
        return (
            <div className="flex justify-center items-center h-64 text-red-300 text-sm">
                Błąd podczas ładowania danych
            </div>
        );

    const total = data.reduce((sum, s) => sum + s.offerCount, 0);
    const chartData = data.map((s) => ({
        name: s.shopName,
        value: s.offerCount,
        percent: ((s.offerCount / total) * 100).toFixed(1),
    }));

    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value: number, _name: string, props: any) => [
                            `${value.toLocaleString()} ofert (${props.payload.percent}%)`,
                            props.payload.name,
                        ]}
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "8px",
                            color: "#f1f5f9",
                            fontSize: "0.8rem",
                        }}
                        labelStyle={{ display: "none" }}
                    />

                    <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.7)", paddingTop: 8 }}
                        formatter={(value) => (
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
