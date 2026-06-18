import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // ================= FETCH USERS =================
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log("FETCH ERROR:", error);
            setError("Impossible de charger les utilisateurs");
            setUsers([]);
        } else {
            setUsers(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ================= BLOCK / UNBLOCK =================
    const toggleBlock = async (id, status) => {
        const newStatus = status === "blocked" ? "active" : "blocked";

        const { error } = await supabase
            .from("profiles")
            .update({ subscription_status: newStatus })
            .eq("id", id);

        if (error) {
            console.log("BLOCK ERROR:", error);
            return;
        }

        setUsers((prev) =>
            prev.map((u) =>
                u.id === id
                    ? { ...u, subscription_status: newStatus }
                    : u
            )
        );
    };

    // ================= CHANGE ROLE =================
    const changeRole = async (id, role) => {
        setSaving(true);

        const { error } = await supabase
            .from("profiles")
            .update({ role })
            .eq("id", id);

        if (error) {
            console.log("ROLE ERROR:", error);
            alert("Erreur modification rôle");
        } else {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id ? { ...u, role } : u
                )
            );
        }

        setSaving(false);
    };

    // ================= ROLE STYLE =================
    const getRoleStyle = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return { label: "👑 Admin", color: "#1d4ed8", bg: "#dbeafe" };
            case "vendeur":
                return { label: "🏪 Vendeur", color: "#d97706", bg: "#fef3c7" };
            case "livreur":
                return { label: "🚚 Livreur", color: "#6d28d9", bg: "#ede9fe" };
            default:
                return { label: "👤 Client", color: "#475569", bg: "#f1f5f9" };
        }
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div style={styles.loadingBox}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>📦 Chargement utilisateurs...</p>
            </div>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <div style={styles.loadingBox}>
                <p style={{ color: "#ef4444", fontWeight: "600", margin: 0 }}>{error}</p>
            </div>
        );
    }

    // ================= UI =================
    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
                <h2 style={styles.mainTitle}>👥 ADMIN PANEL - USERS</h2>
                <p style={styles.subTitle}>Gestion globale des comptes, rôles et restrictions d'accès.</p>
            </div>

            {/* GRID USERS */}
            {users.length === 0 ? (
                <div style={styles.emptyBox}>
                    <p style={{ margin: 0 }}>Aucun utilisateur</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {users.map((u) => {
                        const roleStyle = getRoleStyle(u.role);
                        const isBlocked = u.subscription_status === "blocked";

                        return (
                            <div key={u.id} style={styles.userCard}>

                                {/* TOP CARD */}
                                <div style={styles.cardHeader}>
                                    <div style={styles.avatar}>
                                        {u.email ? u.email.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div style={styles.badgeGroup}>
                                        <span style={{ ...styles.roleBadge, color: roleStyle.color, backgroundColor: roleStyle.bg }}>
                                            {roleStyle.label}
                                        </span>
                                        <span style={{
                                            ...styles.statusBadge,
                                            color: isBlocked ? "#ef4444" : "#10b981",
                                            backgroundColor: isBlocked ? "#fee2e2" : "#dcfce7"
                                        }}>
                                            {isBlocked ? "🚫 Bloqué" : "✓ Actif"}
                                        </span>
                                    </div>
                                </div>

                                {/* CARD INFOS */}
                                <div style={styles.cardBody}>
                                    <h4 style={styles.username}>{u.email?.split('@')[0]}</h4>
                                    <p style={styles.email}>{u.email}</p>
                                </div>

                                {/* CARD FOOTER ID */}
                                <div style={styles.cardFooter}>
                                    <span style={styles.idLabel}>USER ID</span>
                                    <span style={styles.uid}>{u.id}</span>
                                </div>

                                {/* ACTIONS AREA */}
                                <div style={styles.actionsArea}>
                                    {/* ROLE TOGGLES */}
                                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                                        <button
                                            disabled={saving}
                                            style={{ ...styles.roleBtnInline, backgroundColor: u.role === "client" ? "#f1f5f9" : "transparent", border: u.role === "client" ? "1px solid #cbd5e1" : "1px solid #e2e8f0" }}
                                            onClick={() => changeRole(u.id, "client")}
                                        >
                                            👤 Client
                                        </button>
                                        <button
                                            disabled={saving}
                                            style={{ ...styles.roleBtnInline, backgroundColor: u.role === "vendeur" ? "#fef3c7" : "transparent", border: u.role === "vendeur" ? "1px solid #fde68a" : "1px solid #e2e8f0" }}
                                            onClick={() => changeRole(u.id, "vendeur")}
                                        >
                                            🏪 Vendeur
                                        </button>
                                        <button
                                            disabled={saving}
                                            style={{ ...styles.roleBtnInline, backgroundColor: u.role === "livreur" ? "#ede9fe" : "transparent", border: u.role === "livreur" ? "1px solid #ddd6fe" : "1px solid #e2e8f0" }}
                                            onClick={() => changeRole(u.id, "livreur")}
                                        >
                                            🚚 Livreur
                                        </button>
                                        <button
                                            disabled={saving}
                                            style={{ ...styles.roleBtnInline, backgroundColor: u.role === "admin" ? "#dbeafe" : "transparent", border: u.role === "admin" ? "1px solid #bfdbfe" : "1px solid #e2e8f0" }}
                                            onClick={() => changeRole(u.id, "admin")}
                                        >
                                            👑 Admin
                                        </button>
                                    </div>

                                    {/* BLOCK BUTTON */}
                                    <button
                                        style={{
                                            ...styles.blockBtn,
                                            borderColor: isBlocked ? "#10b981" : "#ef4444",
                                            color: isBlocked ? "#10b981" : "#ef4444",
                                            backgroundColor: isBlocked ? "#f0fdf4" : "#fdf2f2"
                                        }}
                                        onClick={() => toggleBlock(u.id, u.subscription_status)}
                                    >
                                        {isBlocked ? "🔓 Débloquer le compte" : "🚫 Bloquer l'utilisateur"}
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ================= DESIGN SYSTEM CLEAN & SaaS PREMIUM =================
const styles = {
    container: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        padding: "40px 24px",
        color: "#1e293b",
        boxSizing: "border-box"
    },

    header: {
        maxWidth: "1140px",
        margin: "0 auto 32px auto",
        marginTop: "40px"
    },

    mainTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: "-0.5px"
    },

    subTitle: {
        margin: "6px 0 0 0",
        fontSize: "14px",
        color: "#64748b"
    },

    grid: {
        maxWidth: "1140px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px"
    },

    userCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    avatar: {
        width: "38px",
        height: "38px",
        backgroundColor: "#f1f5f9",
        color: "#0f172a",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "700",
        border: "1px solid #e2e8f0"
    },

    badgeGroup: {
        display: "flex",
        gap: "6px",
        alignItems: "center"
    },

    roleBadge: {
        fontSize: "11px",
        fontWeight: "700",
        padding: "4px 10px",
        borderRadius: "12px",
        letterSpacing: "0.2px"
    },

    statusBadge: {
        fontSize: "11px",
        fontWeight: "700",
        padding: "4px 10px",
        borderRadius: "12px",
        letterSpacing: "0.2px"
    },

    cardBody: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    username: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "700",
        color: "#0f172a"
    },

    email: {
        margin: 0,
        fontSize: "13px",
        color: "#64748b",
        wordBreak: "break-all"
    },

    cardFooter: {
        borderTop: "1px solid #f1f5f9",
        paddingTop: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    idLabel: {
        fontSize: "9px",
        fontWeight: "700",
        color: "#94a3b8",
        letterSpacing: "0.5px"
    },

    uid: {
        fontSize: "11px",
        color: "#64748b",
        fontFamily: "monospace",
        backgroundColor: "#f8fafc",
        padding: "4px 8px",
        borderRadius: "6px",
        display: "inline-block",
        alignSelf: "flex-start",
        border: "1px solid #f1f5f9"
    },

    actionsArea: {
        marginTop: "4px"
    },

    roleBtnInline: {
        fontFamily: "inherit",
        padding: "6px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#334155",
        cursor: "pointer",
        transition: "all 0.1s ease"
    },

    blockBtn: {
        width: "100%",
        padding: "10px 14px",
        border: "1px solid",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.15s ease",
        outline: "none"
    },

    loadingBox: {
        textAlign: "center",
        padding: "80px 20px"
    },

    loadingText: {
        color: "#64748b",
        fontSize: "14px",
        marginTop: "12px"
    },

    emptyBox: {
        textAlign: "center",
        padding: "40px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px dashed #cbd5e1",
        color: "#94a3b8",
        maxWidth: "1140px",
        margin: "0 auto"
    },

    spinner: {
        margin: "0 auto",
        width: "28px",
        height: "28px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#0f172a",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    }
};