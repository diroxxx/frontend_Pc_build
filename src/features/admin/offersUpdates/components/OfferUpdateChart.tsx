import {useGetOfferUpdateStats} from "../../hooks/useGetOfferUpdateStats.ts";
import {Loader2} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

export default function OfferUpdateChart() {
    const { data, isLoading, error } = useGetOfferUpdateStats();

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64 text-ocean-white bg-gradient-admin-info rounded-xl shadow-lg">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );

    if (error)
        return (
            <div className="text-center text-red-200 bg-gradient-admin-info p-6 rounded-xl shadow-lg">
                Nie udało się załadować danych wykresu
            </div>
        );

 const groupedData = data?.reduce((acc, item) => {
        const dateKey = `${item.dateOfUpdate[0]}-${item.dateOfUpdate[1]}-${item.dateOfUpdate[2]}`;
        
        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: new Date(Number(item.dateOfUpdate[0]), Number(item.dateOfUpdate[1]) - 1, Number(item.dateOfUpdate[2])),
                totalOffers: 0
            };
        }
        
        acc[dateKey].totalOffers += item.offerCount;
        
        return acc;
    }, {} as Record<string, { date: Date; totalOffers: number }>);

    // Konwersja do tablicy i sortowanie po dacie
    const chartData = Object.values(groupedData ?? {})
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((item) => ({
            date: item.date.toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "short",
            }),
            offers: item.totalOffers,
            name: "Liczba ofert"
        }));

return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#b3ecff" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#e0f7ff", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                        tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                    />
                    <YAxis
                        tick={{ fill: "#e0f7ff", fontSize: 12 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                        tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                    />

                    <Tooltip
                        cursor={{ stroke: "#38bdf8", strokeWidth: 2, strokeDasharray: "5 5" }}
                        wrapperStyle={{ zIndex: 9999 }}
                        contentStyle={{
                            backgroundColor: "rgba(255,255,255,0.95)",
                            border: "1px solid #bae6fd",
                            borderRadius: "8px",
                            color: "#0f172a",
                            fontSize: "0.85rem",
                        }}
                        labelStyle={{ color: "#0369a1", fontWeight: "bold" }}
                        itemStyle={{ color: "#0f172a" }}
                        formatter={(value) => [`${value} ofert`, "Liczba ofert"]}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: "10px", color: "#e0f7ff" }}
                        iconType="line"
                        formatter={() => "Liczba ofert"}
                    />
                    <Line
                        type="monotone"
                        dataKey="offers"
                        name="Liczba ofert"
                        stroke="#e0f7ff"
                        strokeWidth={3}
                        dot={{ r: 4, stroke: "#ffffff", strokeWidth: 2, fill: "#0284c7" }}
                        activeDot={{ r: 6, stroke: "#38bdf8", strokeWidth: 2 }}
                        fillOpacity={1}
                        fill="url(#colorOffers)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}