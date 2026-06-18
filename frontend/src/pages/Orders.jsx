import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// 🎨 DESIGN SYSTEM VITEVENDU
const SV = {
    colors: {
        primary: "#064e3b",       // Vert foncé (Identité principale)
        primaryLight: "#f0fdf4",  // Fond léger vert
        secondary: "#2563eb",     // Bleu (Actions / Liens)
        accent: "#f97316",        // Orange (Mise en valeur Prix)
        dark: "#0f172a",          // Texte principal
        muted: "#64748b",         // Texte secondaire
        border: "#e2e8f0",        // Séparateurs
        bg: "#f8fafc"             // Fond de page
    }
};

export default function Orders({ user }) {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("client");
    const [editingOrder, setEditingOrder] = useState(null);

    // ================= LOAD ORDERS =================
    const fetchOrders = async (currentRole = role) => {
        if (!user?.id) return;

        setLoading(true);
        let query = supabase.from("orders").select("*");

        // Si l'utilisateur est admin, il voit tout. Sinon, juste ses commandes.
        if (currentRole !== "admin") {
            query = query.eq("user_id", user.id);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            console.error("ORDERS ERROR:", error);
            setOrders([]);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    // ================= ROLE & INITIAL LOAD =================
    useEffect(() => {
        const init = async () => {
            if (!user?.id) return;

            // 1. Fetch le rôle en premier
            const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            const userRole = !error && data?.role ? data.role.toLowerCase().trim() : "client";
            setRole(userRole);

            // 2. Charger les commandes immédiatement avec le bon rôle
            await fetchOrders(userRole);
        };

        init();
    }, [user?.id]);

    // ================= REALTIME MULTI-RÔLE =================
    useEffect(() => {
        if (!user?.id) return;

        // Configuration du filtre selon le rôle
        const channelConfig = {
            event: "*",
            schema: "public",
            table: "orders"
        };

        // Si ce n'est pas un admin, on restreint au niveau du client
        if (role !== "admin") {
            channelConfig.filter = `user_id=eq.${user.id}`;
        }

        const channel = supabase
            .channel("orders-live")
            .on("postgres_changes", channelConfig, () => {
                // On repasse le rôle actuel pour garder la bonne requête globale ou filtrée
                fetchOrders(role);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, role]);

    // ================= STATUS =================
    const getStatus = (status) => {
        const map = {
            pending: { label: "⏳ En attente", color: "#0d9488" },
            paid: { label: "💳 Payée", color: "#2563eb" },
            shipping: { label: "🚚 En livraison", color: "#4f46e5" },
            delivered: { label: "📦 Livrée", color: "#16a34a" },
            cancelled: { label: "❌ Annulée", color: "#ea580c" }
        };

        return map[status] || { label: "Inconnu", color: "#64748b" };
    };

    // ================= ACTIONS =================
    const cancelOrder = async (id) => {
        if (!window.confirm("Annuler cette commande ?")) return;

        const { error } = await supabase
            .from("orders")
            .update({ status: "cancelled" })
            .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erreur annulation");
            return;
        }
        fetchOrders(role);
    };

    const markAsPaid = async (id) => {
        if (!window.confirm("Confirmer paiement ?")) return;

        const { error } = await supabase
            .from("orders")
            .update({ status: "paid" })
            .eq("id", id);

        if (error) {
            console.error(error);
            alert("Erreur paiement");
            return;
        }
        fetchOrders(role);
    };

    // 🔥 Correction majeure : Recalcul automatique du montant total
    const updateOrderItems = async () => {
        if (!editingOrder) return;

        // Calcul du nouveau total basé sur les modifications de quantités
        const newTotal = editingOrder.items.reduce((acc, item) => {
            return acc + (Number(item.price || 0) * Number(item.quantity || 1));
        }, 0);

        const { error } = await supabase
            .from("orders")
            .update({
                items: editingOrder.items,
                total: newTotal // On pousse la correction du total
            })
            .eq("id", editingOrder.id);

        if (error) {
            console.error(error);
            alert("Erreur modification");
            return;
        }

        setEditingOrder(null);
        fetchOrders(role);
    };

    // ================= LOADING =================
    if (loading && orders.length === 0) {
        return (
            <div style={styles.center}>
                <span style={styles.loadingText}>📦 Chargement de vos commandes...</span>
            </div>
        );
    }

    // ================= UI =================
    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.headerSection}>
                <h2 style={styles.mainTitle}>
                    {role === "admin" ? "💼 Gestion des Commandes (Admin)" : "📦 Mes Commandes"}
                </h2>
                <p style={styles.subTitle}>
                    {role === "admin" ? "Supervisez et gérez l'ensemble des ventes de la plateforme" : "Suivez et gérez vos achats en temps réel"}
                </p>
            </div>

            {orders.length === 0 ? (
                <div style={styles.emptyCard}>
                    <div style={styles.emptyIcon}>🛍️</div>
                    <p style={styles.emptyText}>Aucune commande trouvée.</p>
                </div>
            ) : (
                <div style={styles.cardGrid}>
                    {orders.map((order) => {
                        const status = getStatus(order.status);

                        return (
                            <div key={order.id} style={styles.orderCard}>

                                {/* HEADER CARD */}
                                <div style={styles.cardTop}>
                                    <div>
                                        <span style={styles.reference}>
                                            RÉF : #{order.id.slice(0, 8).toUpperCase()}
                                        </span>
                                        <div style={styles.priceContainer}>
                                            <span style={styles.price}>
                                                {Number(order.total || 0).toLocaleString()}
                                            </span>
                                            <span style={styles.currency}>FCFA</span>
                                        </div>
                                    </div>
                                    <span style={{ ...styles.badge, color: status.color, backgroundColor: `${status.color}12` }}>
                                        {status.label}
                                    </span>
                                </div>

                                {/* ITEMS LIST */}
                                <div style={styles.productsList}>
                                    {order.items?.map((item, i) => (
                                        <div key={i} style={styles.productRow}>
                                            <div style={styles.imgContainer}>
                                                <img src={item.image} style={styles.productImg} alt="" />
                                            </div>
                                            <div style={styles.productInfos}>
                                                <p style={styles.productTitle}>{item.title}</p>
                                                <p style={styles.productQty}>
                                                    Quantité : <span style={styles.qtyBadge}>{item.quantity}</span> × <span style={styles.productTargetPrice}>{Number(item.price || 0).toLocaleString()} FCFA</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ACTIONS CARD */}
                                <div style={styles.cardActions}>
                                    <button
                                        style={styles.btnTrack}
                                        onClick={() => navigate(`/tracking/${order.id}`)}
                                    >
                                        📍 Suivre la livraison
                                    </button>

                                    <div style={styles.actionGroup}>
                                        {/* Modifiable seulement si en attente (et pour l'acheteur) */}
                                        {order.status === "pending" && (
                                            <>
                                                <button style={styles.btnEdit} onClick={() => setEditingOrder(JSON.parse(JSON.stringify(order)))}>
                                                    ✏️ Modifier
                                                </button>

                                                <button style={styles.btnCancel} onClick={() => cancelOrder(order.id)}>
                                                    ❌ Annuler
                                                </button>
                                            </>
                                        )}

                                        {/* Actions réservées à l'Admin */}
                                        {role === "admin" && order.status === "pending" && (
                                            <button style={styles.btnAdminPay} onClick={() => markAsPaid(order.id)}>
                                                💳 Valider paiement
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL EDITING */}
            {editingOrder && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Modifier les quantités</h3>
                        </div>

                        <div style={styles.modalBody}>
                            {editingOrder.items.map((item, i) => (
                                <div key={i} style={styles.modalItemRow}>
                                    <span style={styles.modalItemName}>{item.title}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        style={styles.modalInput}
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const items = [...editingOrder.items];
                                            items[i].quantity = Math.max(1, Number(e.target.value));
                                            setEditingOrder({ ...editingOrder, items });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.modalBtnSave} onClick={updateOrderItems}>
                                💾 Enregistrer les modifications
                            </button>
                            <button style={styles.modalBtnClose} onClick={() => setEditingOrder(null)}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ================= STYLES REFAITS (THEME VITEVENDU) =================
const styles = {
    container: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        padding: "24px 16px",
        paddingTop: "90px",
        maxWidth: "680px",
        margin: "0 auto",
        boxSizing: "border-box",
        backgroundColor: SV.colors.bg,
        minHeight: "100vh"
    },
    headerSection: { marginBottom: "24px", textAlign: "left" },
    mainTitle: {
        fontSize: "22px",
        fontWeight: "800",
        margin: "0 0 2px 0",
        letterSpacing: "-0.5px",
        background: `linear-gradient(135deg, ${SV.colors.primary} 0%, ${SV.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block"
    },
    subTitle: {
        margin: 0,
        fontSize: "12px",
        color: SV.colors.muted,
        fontWeight: "500",
        letterSpacing: "-0.1px"
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        backgroundColor: SV.colors.bg
    },
    loadingText: { color: SV.colors.primary, fontWeight: "600", fontSize: "16px", letterSpacing: "-0.2px" },
    cardGrid: { display: "flex", flexDirection: "column", gap: "20px" },
    orderCard: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
        border: `1px solid ${SV.colors.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px dashed ${SV.colors.border}`, paddingBottom: "16px" },
    reference: { fontSize: "11px", fontWeight: "700", color: SV.colors.muted, letterSpacing: "0.8px" },
    priceContainer: { display: "flex", alignItems: "baseline", gap: "4px", marginTop: "4px" },
    price: { fontSize: "26px", fontWeight: "900", color: SV.colors.accent, letterSpacing: "-0.5px" },
    currency: { fontSize: "13px", fontWeight: "800", color: SV.colors.accent },
    badge: { padding: "8px 16px", borderRadius: "14px", fontSize: "12px", fontWeight: "700", letterSpacing: "-0.1px" },
    productsList: { display: "flex", flexDirection: "column", gap: "10px" },
    productRow: { display: "flex", alignItems: "center", gap: "14px", padding: "12px", borderRadius: "16px", background: `linear-gradient(135deg, #ffffff, ${SV.colors.primaryLight})`, border: `1px solid #f1f5f9` },
    imgContainer: { width: "56px", height: "56px", borderRadius: "12px", overflow: "hidden", backgroundColor: "#ffffff", border: `1px solid ${SV.colors.border}`, flexShrink: 0 },
    productImg: { width: "100%", height: "100%", objectFit: "cover" },
    productInfos: { flex: 1 },
    productTitle: { margin: 0, fontSize: "14px", fontWeight: "700", color: SV.colors.dark },
    productQty: { margin: "4px 0 0 0", fontSize: "13px", color: SV.colors.muted },
    qtyBadge: { fontWeight: "700", color: SV.colors.primary, background: "#e0f2fe", padding: "1px 6px", borderRadius: "6px", fontSize: "12px" },
    productTargetPrice: { fontWeight: "700", color: SV.colors.dark },
    cardActions: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${SV.colors.border}`, paddingTop: "16px", gap: "12px", flexWrap: "wrap" },
    actionGroup: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
    btnTrack: { fontFamily: "inherit", padding: "11px 20px", background: SV.colors.secondary, color: "#ffffff", border: "none", borderRadius: "14px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)" },
    btnEdit: { fontFamily: "inherit", padding: "11px 16px", background: "#f1f5f9", color: SV.colors.dark, border: "none", borderRadius: "14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    btnCancel: { fontFamily: "inherit", padding: "11px 14px", background: "transparent", color: "#dc2626", border: "none", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
    btnAdminPay: { fontFamily: "inherit", padding: "11px 18px", background: SV.colors.primary, color: "#ffffff", border: "none", borderRadius: "14px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 12px rgba(6, 78, 59, 0.2)" },
    emptyCard: { textAlign: "center", padding: "60px 24px", background: "#ffffff", borderRadius: "24px", border: `2px dashed ${SV.colors.border}` },
    emptyIcon: { fontSize: "44px", marginBottom: "14px" },
    emptyText: { color: SV.colors.muted, margin: 0, fontSize: "15px", fontWeight: "600" },
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000, padding: "16px" },
    modalContent: { background: "#ffffff", borderRadius: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)", overflow: "hidden" },
    modalHeader: { padding: "24px 24px 20px 24px", background: `linear-gradient(135deg, ${SV.colors.primaryLight}, #eff6ff)`, borderBottom: `1px solid ${SV.colors.border}` },
    modalTitle: { margin: 0, fontSize: "18px", fontWeight: "800", color: SV.colors.dark },
    modalBody: { padding: "24px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "280px", overflowY: "auto" },
    modalItemRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" },
    modalItemName: { fontSize: "14px", fontWeight: "700", color: SV.colors.dark },
    modalInput: { fontFamily: "inherit", width: "65px", padding: "10px", border: `2px solid ${SV.colors.border}`, borderRadius: "12px", textAlign: "center", fontSize: "15px", fontWeight: "800", color: SV.colors.dark, outline: "none" },
    modalFooter: { padding: "16px 24px 24px 24px", display: "flex", flexDirection: "column", gap: "10px" },
    modalBtnSave: { fontFamily: "inherit", width: "100%", padding: "14px", background: SV.colors.primary, color: "#ffffff", border: "none", borderRadius: "14px", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 14px rgba(6, 78, 59, 0.2)" },
    modalBtnClose: { fontFamily: "inherit", width: "100%", padding: "10px", background: "transparent", color: SV.colors.muted, border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer" }
};