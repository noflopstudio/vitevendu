import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Settings() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ================= CHARGER USERS =================
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from("profiles")
            .select("*");

        if (error) {
            console.error(error);
            setError("Erreur lors du chargement des utilisateurs");
        } else {
            setUsers(data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ================= CHANGER ROLE =================
    const changeRole = async (id, newRole) => {
        const { error } = await supabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", id);

        if (!error) fetchUsers();
    };

    // ================= TOGGLE STATUS =================
    const toggleActive = async (id, current) => {
        const newStatus = current === "active" ? "blocked" : "active";

        const { error } = await supabase
            .from("profiles")
            .update({ kyc_status: newStatus })
            .eq("id", id);

        if (!error) fetchUsers();
    };

    // ================= STATS =================
    const totalUsers = users.length;
    const owners = users.filter(u => u.role === "owner").length;
    const clients = users.filter(u => u.role === "client").length;

    // Helper pour les styles de rôles
    const getRoleBadgeStyle = (role) => {
        return role === "owner"
            ? { bg: "#eff6ff", color: "#1d4ed8" }
            : { bg: "#f1f5f9", color: "#475569" };
    };

    return (
        <div style={styles.container}>
            {/* EN-TÊTE PRINCIPAL */}
            <header style={styles.header}>
                <h1 style={styles.title}>👑 Admin Panel</h1>
                <p style={styles.subtitle}>Gestion centrale des utilisateurs, attributions des rôles et modération.</p>
            </header>

            {error && (
                <div style={styles.errorAlert}>
                    ⚠️ {error}
                </div>
            )}

            {/* CARDS DE STATISTIQUES GLOBALES */}
            <section style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <span style={styles.statLabel}>Total Utilisateurs</span>
                    <h2 style={{ ...styles.statValue, color: "#0f172a" }}>{totalUsers}</h2>
                </div>
                <div style={styles.statCard}>
                    <span style={styles.statLabel}>Fondateurs (Owners)</span>
                    <h2 style={{ ...styles.statValue, color: "#2563eb" }}>{owners}</h2>
                </div>
                <div style={styles.statCard}>
                    <span style={styles.statLabel}>Membres / Clients</span>
                    <h2 style={{ ...styles.statValue, color: "#10b981" }}>{clients}</h2>
                </div>
            </section>

            {/* LISTE DES UTILISATEURS */}
            <main style={styles.mainContent}>
                <h2 style={styles.sectionTitle}>👥 Liste des utilisateurs</h2>

                {loading ? (
                    <div style={styles.loadingBox}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Récupération de la liste...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div style={styles.emptyBox}>Aucun utilisateur enregistré pour le moment.</div>
                ) : (
                    <div style={styles.usersList}>
                        {users.map((user) => {
                            const roleStyle = getRoleBadgeStyle(user.role);
                            const isBlocked = user.kyc_status === "blocked";

                            return (
                                <div key={user.id} style={styles.userRow}>
                                    {/* Infos Profil */}
                                    <div style={styles.userInfo}>
                                        <div style={styles.userNameContainer}>
                                            <span style={styles.username}>{user.username || "Sans nom"}</span>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: roleStyle.bg,
                                                color: roleStyle.color
                                            }}>
                                                {user.role || "client"}
                                            </span>
                                            <span style={{
                                                ...styles.badge,
                                                backgroundColor: isBlocked ? "#fee2e2" : "#dcfce7",
                                                color: isBlocked ? "#ef4444" : "#15803d"
                                            }}>
                                                {user.kyc_status === "blocked" ? "🔴 Bloqué" : "🟢 Actif"}
                                            </span>
                                        </div>
                                        <span style={styles.userEmail}>{user.email || "Pas d'adresse email"}</span>
                                        <span style={styles.userId}>ID: {user.id}</span>
                                    </div>

                                    {/* Actions Administrateur */}
                                    <div style={styles.actionsGroup}>
                                        <button
                                            onClick={() => changeRole(user.id, "owner")}
                                            style={styles.btnAction}
                                            disabled={user.role === "owner"}
                                        >
                                            Promouvoir Owner
                                        </button>
                                        <button
                                            onClick={() => changeRole(user.id, "client")}
                                            style={styles.btnAction}
                                            disabled={user.role === "client"}
                                        >
                                            Rôle Client
                                        </button>
                                        <button
                                            onClick={() => toggleActive(user.id, user.kyc_status)}
                                            style={{
                                                ...styles.btnToggleStatus,
                                                borderColor: isBlocked ? "#10b981" : "#ef4444",
                                                color: isBlocked ? "#10b981" : "#ef4444",
                                                backgroundColor: isBlocked ? "#f0fdf4" : "#fdf2f2"
                                            }}
                                        >
                                            {isBlocked ? "🔓 Réactiver" : "🚫 Bloquer le compte"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

// ================= DESIGN SYSTEM ADMIN PREMIUM =================
const styles = {
    container: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        padding: "40px 24px",
        color: "#1e293b"
    },

    header: {
        maxWidth: "1000px",
        margin: "0 auto 32px auto"
    },

    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: "-0.5px"
    },

    subtitle: {
        margin: "6px 0 0 0",
        fontSize: "14px",
        color: "#64748b"
    },

    errorAlert: {
        maxWidth: "1000px",
        margin: "0 auto 20px auto",
        backgroundColor: "#fdf2f2",
        border: "1px solid #fca5a5",
        color: "#b91c1c",
        padding: "12px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500"
    },

    statsGrid: {
        maxWidth: "1000px",
        margin: "0 auto 40px auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px"
    },

    statCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "24px 20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
    },

    statLabel: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#64748b"
    },

    statValue: {
        margin: "8px 0 0 0",
        fontSize: "28px",
        fontWeight: "800",
        letterSpacing: "-0.5px"
    },

    mainContent: {
        maxWidth: "1000px",
        margin: "0 auto"
    },

    sectionTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a",
        marginBottom: "20px"
    },

    usersList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    userRow: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
        transition: "transform 0.15s ease"
    },

    userInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },

    userNameContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap"
    },

    username: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#0f172a"
    },

    userEmail: {
        fontSize: "13px",
        color: "#64748b"
    },

    userId: {
        fontSize: "11px",
        color: "#94a3b8",
        fontFamily: "monospace"
    },

    badge: {
        fontSize: "11px",
        fontWeight: "700",
        padding: "2px 8px",
        borderRadius: "12px",
        textTransform: "capitalize"
    },

    actionsGroup: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
    },

    btnAction: {
        background: "#ffffff",
        color: "#334155",
        border: "1px solid #cbd5e1",
        padding: "8px 14px",
        fontSize: "12px",
        fontWeight: "600",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        ":disabled": {
            opacity: 0.4,
            cursor: "not-allowed"
        }
    },

    btnToggleStatus: {
        border: "1px solid",
        padding: "8px 14px",
        fontSize: "12px",
        fontWeight: "700",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.15s ease"
    },

    loadingBox: {
        textAlign: "center",
        padding: "60px 20px"
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
        color: "#94a3b8"
    },

    spinner: {
        margin: "0 auto",
        width: "28px",
        height: "28px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#2563eb",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    }
};