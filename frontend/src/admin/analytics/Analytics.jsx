// src/admin/analytics/Analytics.jsx

import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Analytics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);

        // ORDERS
        const { data: orders } = await supabase.from("orders").select("*");

        // USERS
        const { data: users } = await supabase.from("profiles").select("*");

        // SALES (si tu as champ price + status paid)
        const { data: paidOrders } = await supabase
            .from("orders")
            .select("total_price")
            .eq("status", "paid");

        const totalRevenue =
            paidOrders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;

        setStats({
            totalOrders: orders?.length || 0,
            totalUsers: users?.length || 0,
            totalSales: paidOrders?.length || 0,
            totalRevenue,
        });

        setLoading(false);
    };

    if (loading) {
        return <h2 style={{ padding: 20 }}>Chargement analytics...</h2>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>📊 Analytics Dashboard</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginTop: 20 }}>

                <div style={card}>
                    <h3>🧾 Total commandes</h3>
                    <p>{stats.totalOrders}</p>
                </div>

                <div style={card}>
                    <h3>👥 Utilisateurs</h3>
                    <p>{stats.totalUsers}</p>
                </div>

                <div style={card}>
                    <h3>💰 Ventes payées</h3>
                    <p>{stats.totalSales}</p>
                </div>

                <div style={card}>
                    <h3>📈 Revenus</h3>
                    <p>{stats.totalRevenue} FCFA</p>
                </div>
            </div>
        </div>
    );
}

const card = {
    padding: 20,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};