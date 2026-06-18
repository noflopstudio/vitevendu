import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function OrdersAll() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    // ================= FETCH & UPDATE =================
    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error) setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id, status) => {
        const { error } = await supabase.from("orders").update({ status }).eq("id", id);
        if (error) { alert("Erreur mise à jour"); return; }
        setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
    };

    // ================= DESIGN CONSTANTS =================
    const getStatusStyle = (status) => {
        switch (status) {
            case "paid": return { color: "#166534", bg: "#dcfce7" }; // Vert
            case "shipping": return { color: "#1e40af", bg: "#dbeafe" }; // Bleu
            case "delivered": return { color: "#6d28d9", bg: "#ede9fe" };
            case "cancelled": return { color: "#991b1b", bg: "#fee2e2" };
            default: return { color: "#9a3412", bg: "#ffedd5" }; // Orange (Pending)
        }
    };

    if (loading) return <div style={styles.loader}>📦 Chargement...</div>;

    return (
        <div style={styles.page}>
            <h2 style={styles.header}>📦 Gestion des Commandes</h2>

            <div style={styles.filterContainer}>
                {["all", "pending", "paid", "shipping", "delivered", "cancelled"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={styles.filterBtn(filter === f)}>
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            {orders.filter(o => filter === "all" || o.status === filter).map((order) => {
                const s = getStatusStyle(order.status);
                return (
                    <div key={order.id} style={styles.card}>
                        <div style={styles.topRow}>
                            <strong style={styles.idText}>#{order.id.slice(0, 8)}</strong>
                            <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.color }}>{order.status}</span>
                        </div>
                        <div style={styles.info}>
                            <p>👤 {order.user_id}</p>
                            <p>📦 {order.title}</p>
                            <p>💰 <strong>{order.total} FCFA</strong></p>
                        </div>
                        <div style={styles.actions}>
                            <button style={{ ...styles.btn, backgroundColor: "#16a34a" }} onClick={() => updateStatus(order.id, "paid")}>Paid</button>
                            <button style={{ ...styles.btn, backgroundColor: "#2563eb" }} onClick={() => updateStatus(order.id, "shipping")}>Shipping</button>
                            <button style={{ ...styles.btn, backgroundColor: "#7c3aed" }} onClick={() => updateStatus(order.id, "delivered")}>Delivered</button>
                            <button style={{ ...styles.btn, backgroundColor: "#ea580c" }} onClick={() => updateStatus(order.id, "cancelled")}>Cancel</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    page: { padding: "30px", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" },
    header: { color: "#1e293b", marginBottom: "25px" },
    filterContainer: { display: "flex", gap: "8px", marginBottom: "25px", flexWrap: "wrap" },
    filterBtn: (active) => ({
        padding: "8px 15px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer",
        backgroundColor: active ? "#1e293b" : "#e2e8f0", color: active ? "#fff" : "#475569"
    }),
    card: { padding: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    topRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
    idText: { color: "#64748b" },
    badge: { padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" },
    info: { fontSize: "14px", color: "#334155", marginBottom: "15px" },
    actions: { display: "flex", gap: "8px" },
    btn: { padding: "6px 12px", border: "none", borderRadius: "6px", color: "#fff", fontSize: "11px", fontWeight: "600", cursor: "pointer" },
    loader: { padding: "40px", textAlign: "center" }
};