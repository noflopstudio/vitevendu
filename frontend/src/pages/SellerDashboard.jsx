import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

// 🎨 DESIGN SYSTEM VITEVENDU
const SV = {
    colors: {
        primary: "#064e3b",       // Vert foncé (Identité principale)
        primaryLight: "#f0fdf4",  // Fond léger vert
        secondary: "#2563eb",     // Bleu (Lancement / Liens)
        accent: "#f97316",        // Orange (Mise en valeur Prix / Alertes)
        dark: "#0f172a",          // Texte principal
        muted: "#64748b",         // Texte secondaire / Bordures
        border: "#e2e8f0",        // Séparateurs légers
        bg: "#f8fafc"             // Fond de page chic
    }
};

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const channelRef = useRef(null);

    // Injection CSS pour l'animation du spinner de chargement chic
    useEffect(() => {
        const styleId = "seller-spinner-animation";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }
    }, []);

    // ================= LOAD ORDERS =================
    const loadOrders = async (sellerId) => {
        if (!sellerId) return;

        console.log("📦 LOAD ORDERS FOR =", sellerId);

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("seller_id", sellerId) // ✅ FILTRE DIRECT ACTIVÉ POUR LA SÉCURITÉ
            .order("created_at", { ascending: false });

        if (error) {
            console.log("❌ ORDERS ERROR =", error);
            setOrders([]);
        } else {
            console.log("✅ ORDERS =", data);
            setOrders(data || []);
        }

        setLoading(false);
    };

    // ================= INIT =================
    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getUser();
            const currentUser = data?.user;

            if (!currentUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            setUser(currentUser);
            await loadOrders(currentUser.id);

            // ================= CLEAN CHANNEL =================
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }

            // ================= REALTIME =================
            const channel = supabase
                .channel(`seller-orders-${currentUser.id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "orders",
                        filter: `seller_id=eq.${currentUser.id}`,
                    },
                    () => {
                        loadOrders(currentUser.id);
                    }
                )
                .subscribe();

            channelRef.current = channel;
        };

        init();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, []);

    // ================= UPDATE STATUS =================
    const updateStatus = async (id, status) => {
        // UI optimiste
        setOrders((prev) =>
            prev.map((o) =>
                o.id === id ? { ...o, status: status } : o
            )
        );

        const { error } = await supabase
            .from("orders")
            .update({ status: status })
            .eq("id", id);

        if (error) {
            console.log("❌ UPDATE ERROR =", error);
        }
    };

    // ================= STATUS UI =================
    const getStatusConfig = (status) => {
        switch (status) {
            case "nouvelle_commande":
                return { bg: "#dbeafe", text: "#1e40af", label: "Nouvelle" };
            case "préparation":
                return { bg: "#ffedd5", text: "#c2410c", label: "Préparation" };
            case "livraison":
                return { bg: "#ede9fe", text: "#6d28d9", label: "Livraison" };
            case "terminée":
                return { bg: SV.colors.primaryLight, text: SV.colors.primary, label: "Livrée" };
            default:
                return { bg: "#e2e8f0", text: "#334155", label: "En attente" };
        }
    };

    // ================= LOADING UI CHIC =================
    if (loading) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>

                {/* HEADER SECTION CHIC */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Vite Vendu</h2>
                        <p style={styles.subtitle}>Live Delivery System</p>
                    </div>
                    <div style={styles.liveIndicator}>
                        <span style={styles.pulseDot}></span>
                        <span>LIVE</span>
                    </div>
                </div>

                {/* STATS COMPTEUR */}
                <p style={styles.statsCounter}>
                    Commandes actives : <b>{orders.length}</b>
                </p>

                {/* EMPTY CONTENT */}
                {orders.length === 0 ? (
                    <div style={styles.empty}>
                        <p style={styles.emptyTitle}>Aucune commande pour le moment</p>
                    </div>
                ) : (
                    <div style={styles.cardsContainer}>
                        {orders.map((o) => {
                            const status = getStatusConfig(o.status);

                            return (
                                <div key={o.id} style={styles.card}>

                                    {/* CARD TOP ROW */}
                                    <div style={styles.row}>
                                        <b style={styles.orderId}>#{o.id.slice(0, 6).toUpperCase()}</b>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background: status.bg,
                                                color: status.text,
                                            }}
                                        >
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* PRICE CONTAINER */}
                                    <div style={styles.priceContainer}>
                                        <span style={styles.priceLabel}>Montant de la commande</span>
                                        <span style={styles.price}>
                                            {o.total?.toLocaleString() || 0} <span style={styles.currency}>FCFA</span>
                                        </span>
                                    </div>

                                    {/* INFO TECH ZONE */}
                                    <div style={styles.infoGrid}>
                                        <div style={styles.infoItemFull}>
                                            <span style={styles.infoLabel}>Identifiant Supabase</span>
                                            <span style={styles.infoValueTech}>{o.status || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div style={styles.divider}></div>

                                    {/* ACTION BUTTONS */}
                                    <div style={styles.actions}>
                                        <button
                                            onClick={() => updateStatus(o.id, "préparation")}
                                            style={{ ...styles.btn, ...styles.btnPrepare }}
                                        >
                                            Préparer
                                        </button>

                                        <button
                                            onClick={() => updateStatus(o.id, "livraison")}
                                            style={{ ...styles.btn, ...styles.btnDeliver }}
                                        >
                                            Envoyer
                                        </button>

                                        <button
                                            onClick={() => updateStatus(o.id, "terminée")}
                                            style={{ ...styles.btn, ...styles.btnComplete }}
                                        >
                                            Terminer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==========================================
// 🎨 STYLES REFAITS (THEME PREMIUM VITEVENDU)
// ==========================================
const styles = {
    page: {
        minHeight: "100vh",
        width: "100vw",
        background: SV.colors.bg,
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        paddingTop: "90px", // Évite parfaitement le chevauchement avec le menu burger mobile
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
    },

    wrapper: {
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 4px"
    },

    title: {
        fontSize: "22px", // Aligné uniformément avec Wallet et Orders
        fontWeight: "800",
        margin: 0,
        letterSpacing: "-0.5px",
        background: `linear-gradient(135deg, ${SV.colors.primary} 0%, ${SV.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        display: "inline-block"
    },

    subtitle: {
        fontSize: "12px",
        color: SV.colors.muted,
        fontWeight: "500",
        margin: "2px 0 0 0"
    },

    liveIndicator: {
        background: "#ffffff",
        border: `1px solid ${SV.colors.border}`,
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        color: SV.colors.dark,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.02)"
    },

    pulseDot: {
        width: "6px",
        height: "6px",
        background: "#10b981",
        borderRadius: "50%",
        display: "inline-block"
    },

    statsCounter: {
        fontSize: "12px",
        color: SV.colors.muted,
        fontWeight: "500",
        margin: "0 4px"
    },

    cardsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    card: {
        background: "#ffffff",
        padding: "24px",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
        border: `1px solid ${SV.colors.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    orderId: {
        fontSize: "13px",
        fontWeight: "700",
        color: SV.colors.muted,
        letterSpacing: "0.5px"
    },

    badge: {
        padding: "6px 12px",
        borderRadius: "10px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "-0.1px"
    },

    priceContainer: {
        display: "flex",
        flexDirection: "column",
        marginTop: 4
    },

    priceLabel: {
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: SV.colors.muted,
        fontWeight: "700",
        marginBottom: "2px"
    },

    price: {
        fontWeight: "900",
        fontSize: "28px",
        color: SV.colors.accent, // Orange Premium pour la somme
        letterSpacing: "-0.5px"
    },

    currency: {
        fontSize: "15px",
        fontWeight: "800",
        color: SV.colors.accent
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        background: SV.colors.bg,
        padding: "14px",
        borderRadius: "16px",
        border: `1px solid ${SV.colors.border}`
    },

    infoItemFull: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        gridColumn: "span 2"
    },

    infoLabel: {
        fontSize: "10px",
        color: SV.colors.muted,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.3px"
    },

    infoValueTech: {
        fontSize: "12px",
        fontFamily: "monospace",
        color: SV.colors.dark,
        fontWeight: "600"
    },

    divider: {
        height: "1px",
        background: SV.colors.border,
        margin: "4px 0"
    },

    actions: {
        display: "flex",
        gap: 8
    },

    btn: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "14px",
        fontSize: "12px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "opacity 0.2s",
        boxSizing: "border-box"
    },

    btnPrepare: {
        background: "#fff7ed",
        color: "#c2410c",
        border: "1px solid #ffedd5"
    },

    btnDeliver: {
        background: "#f1f5f9",
        color: SV.colors.dark,
        border: "1px solid #e2e8f0"
    },

    btnComplete: {
        background: SV.colors.primary, // Vert Premium ViteVendu pour l'action finale réussie
        color: "#ffffff",
        boxShadow: "0 4px 12px rgba(6, 78, 59, 0.15)"
    },

    empty: {
        textAlign: "center",
        padding: "50px 20px",
        background: "#ffffff",
        borderRadius: "24px",
        border: `1px solid ${SV.colors.border}`
    },

    emptyTitle: {
        margin: 0,
        fontWeight: "600",
        fontSize: "13px",
        color: SV.colors.muted
    },

    centerContainer: {
        height: "100vh",
        width: "100vw",
        background: SV.colors.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    spinner: {
        width: "24px",
        height: "24px",
        border: `2px solid ${SV.colors.border}`,
        borderTopColor: SV.colors.primary,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
    }
};