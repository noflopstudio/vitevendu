import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

export default function Sales() {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        const fetchSales = async () => {

            const { data, error } = await supabase
                .from("orders")
                .select("total, created_at");

            if (error) {
                console.log(error);
                return;
            }

            // 🔥 GROUP DATA
            const grouped = {};

            (data || []).forEach(order => {

                const date = new Date(order.created_at)
                    .toLocaleDateString("fr-FR");

                if (!grouped[date]) {
                    grouped[date] = {
                        date,
                        revenue: 0,
                        orders: 0
                    };
                }

                grouped[date].revenue += Number(order.total || 0);
                grouped[date].orders += 1;
            });

            const result = Object.values(grouped);

            console.log("SALES GRAPH:", result);

            setChartData(result);
        };

        fetchSales();

    }, []);

    return (
        <div style={{
            padding: 20,
            background: "#f8fafc",
            minHeight: "100vh"
        }}>

            <h1 style={{
                marginBottom: 20
            }}>
                📊 Ventes par jour
            </h1>

            <div style={{
                background: "#fff",
                padding: 20,
                borderRadius: 12
            }}>

                <LineChart
                    width={900}
                    height={400}
                    data={chartData}
                >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={3}
                    />

                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        strokeWidth={3}
                    />

                </LineChart>

            </div>

        </div>
    );
}