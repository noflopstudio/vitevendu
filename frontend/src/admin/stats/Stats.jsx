import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

// 🎨 DESIGN SYSTEM EXCLUSIF VITEVENDU
const SV = {
    colors: {
        primary: "#064e3b",       // Vert foncé (Identité principale)
        primaryLight: "#f0fdf4",  // Fond vert très léger
        secondary: "#2563eb",     // Bleu Business (Revenus)
        accent: "#f97316",        // Orange (Profit)
        commission: "#8b5cf6",    // Violet (Commission)
        dark: "#0f172a",          // Texte principal / Cartes foncées
        muted: "#64748b",         // Texte secondaire
        border: "#e2e8f0",        // Séparateurs légers
        bg: "#f8fafc"             // Fond de page chic
    }
};

export default function AdminDashboard() {
    const [filter, setFilter] = useState("week");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({


        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        avgPerDay: 0
    });

    // ================= FETCH DATA =================
    const fetchData = async () => {
        setLoading(true);

        try {
            const { data: orders, error } = await supabase
                .from("orders")
                .select("*");

            console.log("ORDERS:", orders);


            if (error) throw error;

            const grouped = {};

            (orders || []).forEach(o => {
                const date = new Date(o.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit"
                });

                if (!grouped[date]) {
                    grouped[date] = {
                        date,
                        revenue: 0,
                        profit: 0,
                        commission: 0,
                        orders: 0
                    };
                }

                grouped[date].revenue += Number(o.total || 0);
                grouped[date].profit += Number(o.profit || 0);
                grouped[date].commission += Number(o.commission || 0);
                grouped[date].orders += 1;
            });

            const result = Object.values(grouped);
            setChartData(result);

            const totalRevenue = result.reduce((s, i) => s + i.revenue, 0);
            const totalOrders = result.reduce((s, i) => s + i.orders, 0);
            const avgPerDay = result.length ? totalRevenue / result.length : 0;

            setStats({
                totalUsers: 0,
                totalOrders,
                totalRevenue,
                avgPerDay
            });

        } catch (err) {
            console.log("❌ ERROR:", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>

                {/* HEADER SECTION */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.headerTitle}>Admin Dashboard</h2>
                        <p style={styles.subtitle}>Rapports globaux et monitoring des flux financiers</p>
                    </div>

                    {/* CONTROLLERS / FILTERS */}
                    <div style={styles.filtersContainer}>
                        <button
                            onClick={() => setFilter("week")}
                            style={styles.btnFilter(filter === "week")}
                        >
                            Semaine
                        </button>
                        <button
                            onClick={() => setFilter("month")}
                            style={styles.btnFilter(filter === "month")}
                        >
                            Mois
                        </button>
                    </div>
                </div>

                {/* SKELETON LOADING STATE */}
                {loading ? (
                    <div style={styles.skeletonGrid}>
                        {[1, 2, 3, 4].map((i) => <div key={i} style={styles.skeletonCard} />)}
                    </div>
                ) : (
                    <>
                        {/* STATS KPIN CARDS */}
                        <div style={styles.grid}>
                            <div style={styles.card}>
                                <span style={styles.cardLabel}>👥 Utilisateurs</span>
                                <span style={styles.cardValue}>{stats.totalUsers.toLocaleString()}</span>
                            </div>
                            <div style={styles.card}>
                                <span style={styles.cardLabel}>📦 Commandes</span>
                                <span style={styles.cardValue}>{stats.totalOrders.toLocaleString()}</span>
                            </div>
                            <div style={styles.card}>
                                <span style={styles.cardLabel}>💰 Revenus bruts</span>
                                <span style={{ ...styles.cardValue, color: SV.colors.accent }}>
                                    {stats.totalRevenue.toLocaleString()} <span style={styles.currency}>FCFA</span>
                                </span>
                            </div>
                            <div style={styles.card}>
                                <span style={styles.cardLabel}>📊 Moyenne / jour</span>
                                <span style={{ ...styles.cardValue, color: SV.colors.secondary }}>
                                    {stats.avgPerDay.toLocaleString()} <span style={styles.currency}>FCFA</span>
                                </span>
                            </div>
                        </div>

                        {/* GRAPHIC RESPONSIVE CONTAINER */}
                        <div style={styles.chartWrapper}>
                            <h3 style={styles.chartTitle}>Analyse combinée des flux</h3>
                            <div style={{ width: "100%", height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={chartData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: SV.colors.muted, fontWeight: 600 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: SV.colors.muted, fontWeight: 600 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={styles.tooltipStyle}
                                            itemStyle={{ fontSize: "12px", fontFamily: "sans-serif" }}
                                        />

                                        {/* Volume des commandes en barres discrètes */}
                                        <Bar dataKey="orders" name="Commandes" fill={`${SV.colors.primary}25`} radius={[4, 4, 0, 0]} barSize={24} />

                                        {/* Courbes financières fluides */}
                                        <Line type="monotone" dataKey="revenue" name="Revenus" stroke={SV.colors.secondary} strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="profit" name="Profit" stroke={SV.colors.accent} strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="commission" name="Commission" stroke={SV.colors.commission} strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// ================= THEME DESIGN SYSTEM STYLES =================
const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: SV.colors.bg,
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        paddingTop: "90px", // Évite les chevauchements avec le menu burger admin global
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
    },

    wrapper: {
        width: "100%",
        maxWidth: "1100px",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
        padding: "0 4px"
    },

    headerTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "800",
        letterSpacing: "-0.6px",
        background: `linear-gradient(135deg, ${SV.colors.primary} 0%, ${SV.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        display: "inline-block"
    },

    subtitle: {
        fontSize: "13px",
        color: SV.colors.muted,
        fontWeight: "500",
        margin: "4px 0 0 0"
    },

    filtersContainer: {
        display: "flex",
        gap: "8px",
        background: "#ffffff",
        padding: "4px",
        borderRadius: "12px",
        border: `1px solid ${SV.colors.border}`,
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.01)"
    },

    btnFilter: (active) => ({
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        fontSize: "12px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.2s ease",
        background: active ? SV.colors.primary : "transparent",
        color: active ? "#ffffff" : SV.colors.muted,
    }),

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // Responsive fluide automatique
        gap: "16px"
    },

    card: {
        background: "#ffffff",
        border: `1px solid ${SV.colors.border}`,
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.02)"
    },

    cardLabel: {
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        color: SV.colors.muted,
        fontWeight: "700"
    },

    cardValue: {
        fontWeight: "900",
        fontSize: "26px",
        color: SV.colors.dark,
        letterSpacing: "-0.5px"
    },

    currency: {
        fontSize: "13px",
        fontWeight: "700",
        color: SV.colors.muted,
        marginLeft: "2px"
    },

    chartWrapper: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        border: `1px solid ${SV.colors.border}`,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },

    chartTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: "700",
        color: SV.colors.dark,
        letterSpacing: "-0.2px"
    },

    tooltipStyle: {
        background: "#ffffff",
        border: `1px solid ${SV.colors.border}`,
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
        padding: "10px 14px"
    },

    skeletonGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px"
    },

    skeletonCard: {
        height: "112px",
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        borderRadius: "20px",
        opacity: 0.6,
        animation: "pulse 1.5s infinite"
    }
};