import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Revenue() {
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, avgPerDay: 0 });

    const fetchRevenue = async () => {
        const { data: orders, error } = await supabase.from("orders").select("created_at,total");
        if (error) return;

        const grouped = {};
        let totalRevenue = 0;
        (orders || []).forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString("fr-FR");
            if (!grouped[date]) grouped[date] = { date, revenue: 0, orders: 0 };
            grouped[date].revenue += Number(order.total || 0);
            grouped[date].orders += 1;
            totalRevenue += Number(order.total || 0);
        });

        setData(Object.values(grouped));
        setStats({
            totalRevenue,
            totalOrders: orders.length,
            avgPerDay: totalRevenue / (Object.keys(grouped).length || 1)
        });
    };

    useEffect(() => { fetchRevenue(); }, []);

    return (
        <div style={styles.page}>
            <h1 style={styles.header}>💰 Revenue Dashboard</h1>

            <div style={styles.container}>
                <div style={styles.card("#16a34a")}>
                    <h3 style={styles.cardTitle}>Total Ventes</h3>
                    <p style={styles.cardValue}>{stats.totalRevenue.toLocaleString()} FCFA</p>
                </div>
                <div style={styles.card("#2563eb")}>
                    <h3 style={styles.cardTitle}>Total Commandes</h3>
                    <p style={styles.cardValue}>{stats.totalOrders}</p>
                </div>
                <div style={styles.card("#ea580c")}>
                    <h3 style={styles.cardTitle}>Moyenne / Jour</h3>
                    <p style={styles.cardValue}>{Math.round(stats.avgPerDay).toLocaleString()} FCFA</p>
                </div>
            </div>

            <div style={styles.graphWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: "#2563eb" }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const styles = {
    page: { padding: "40px 20px", maxWidth: "1100px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },
    header: { fontSize: "32px", fontWeight: "800", color: "#1e293b", marginBottom: "30px" },
    container: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" },
    card: (color) => ({
        backgroundColor: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        borderTop: `6px solid ${color}`, // Application de ton thème couleur
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        borderLeft: "1px solid #e2e8f0",
        borderRight: "1px solid #e2e8f0",
        borderBottom: "1px solid #e2e8f0"
    }),
    cardTitle: { margin: "0 0 10px 0", color: "#64748b", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" },
    cardValue: { margin: 0, fontSize: "24px", fontWeight: "800", color: "#1e293b" },
    graphWrapper: {
        width: "100%", height: "400px", backgroundColor: "#ffffff",
        padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
    }
};