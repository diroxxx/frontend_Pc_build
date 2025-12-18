import {useGetOffersShopsAmountStats} from "../hooks/useGetOffersShopsAmountStats.ts";
import {Loader2} from "lucide-react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import React from "react";

const COLORS = [
    "#0077B6",
    "#00B4D8",
    "#90E0EF",
    "#48CAE4",
    "#023E8A",
    "#0096C7",
];
const ShopOffersShareChart: React.FC = () => {
    const { data, isLoading, error } = useGetOffersShopsAmountStats();

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64 bg-gradient-admin-info/90 backdrop-blur-sm rounded-xl shadow-lg border border-ocean-white/10">
                <Loader2 className="w-6 h-6 text-ocean-blue animate-spin" />
            </div>
        );

    if (error || !data)
        return (
            <div className="flex justify-center items-center h-64 bg-gradient-admin-info/90 backdrop-blur-sm rounded-xl shadow-lg border border-ocean-white/10 text-red-300 font-medium">
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
        <div className="bg-gradient-admin-info/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-ocean-white/10">
            <div className="flex justify-center items-center h-[300px] bg-ocean-white/5 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value: number, name: string, props: any) => [
                                `${value} ofert (${props.payload.percent}%)`,
                                props.payload.name,
                            ]}
                            contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.95)",
                                border: "1px solid #bae6fd",
                                borderRadius: "8px",
                                color: "#0f172a",
                                fontSize: "0.85rem",
                            }}
                            labelStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                        />

                        <Legend
                            layout="horizontal"
                            align="center"
                            verticalAlign="bottom"
                            wrapperStyle={{
                                fontSize: "13px",
                                color: "#e0f7ff",
                                marginTop: "10px",
                            }}
                            formatter={(value) => (
                                <span style={{ color: "#e0f7ff", fontWeight: 500 }}>
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ShopOffersShareChart;