import { useGetOfferUpdateStats } from "../hooks/useGetOfferUpdateStats.ts";
import { Loader2 } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

export default function OfferUpdateChart() {
    const { data, isLoading, error } = useGetOfferUpdateStats();

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-white/60" />
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-64 text-red-300 text-sm">
                Nie udało się załadować danych wykresu
            </div>
        );

    const groupedData = data?.reduce((acc, item) => {
        const dateKey = `${item.dateOfUpdate[0]}-${item.dateOfUpdate[1]}-${item.dateOfUpdate[2]}`;
        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: new Date(Number(item.dateOfUpdate[0]), Number(item.dateOfUpdate[1]) - 1, Number(item.dateOfUpdate[2])),
                totalOffers: 0,
            };
        }
        acc[dateKey].totalOffers += item.offerCount;
        return acc;
    }, {} as Record<string, { date: Date; totalOffers: number }>);

    const chartData = Object.values(groupedData ?? {})
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((item) => ({
            date: item.date.toLocaleDateString("pl-PL", { day: "2-digit", month: "short" }),
            offers: item.totalOffers,
        }));

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ stroke: "rgba(255,255,255,0.3)", strokeWidth: 1, strokeDasharray: "4 4" }}
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "8px",
                            color: "#f1f5f9",
                            fontSize: "0.8rem",
                        }}
                        labelStyle={{ color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}
                        formatter={(value) => [`${value} ofert`, "Liczba ofert"]}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: 12, color: "rgba(255,255,255,0.6)", fontSize: 12 }}
                        iconType="line"
                        formatter={() => "Liczba ofert"}
                    />
                    <Line
                        type="monotone"
                        dataKey="offers"
                        stroke="#7dd3fc"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: "#7dd3fc", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#ffffff", strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
