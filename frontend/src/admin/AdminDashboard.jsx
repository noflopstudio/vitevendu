import { useNavigate } from "react-router-dom";
import useLiveNotifications from "../hooks/useLiveNotifications";
import TestNotif from "../components/TestNotif";

export default function AdminDashboard({ user }) {
    const navigate = useNavigate();
    const notifications = useLiveNotifications();

    const Box = ({ label, path, icon }) => (
        <div onClick={() => navigate(path)} style={styles.box}>
            <span style={styles.boxIcon}>{icon}</span>
            <span style={styles.boxLabel}>{label}</span>
        </div>
    );

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <div>
                    <h1 style={styles.title}>👑 Admin Dashboard</h1>
                    <p style={styles.subtitle}>Bienvenue sur le cockpit de Vite Vendu</p>
                </div>
                <div style={styles.testWrapper}>
                    <TestNotif user={user} />
                </div>
            </header>

            {/* NOTIFICATIONS LIVE */}
            {notifications.length > 0 && (
                <div style={styles.notifSection}>
                    <h3 style={styles.sectionTitle}>🔔 Activité Récente</h3>
                    {notifications.slice(0, 3).map((n) => (
                        <div key={n.id} style={styles.notifItem}>
                            <span>🚀 {n.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* GRILLE D'ADMINISTRATION */}
            <div style={styles.grid}>
                <Box icon="🎭" label="Gestion des rôles" path="/admin/roles" />
                <Box icon="🚫" label="Comptes bloqués" path="/admin/users" />
                <Box icon="📦" label="Toutes les commandes" path="/admin/orders" />
                <Box icon="⏳" label="En attente" path="/admin/orders?status=pending" />
                <Box icon="💳" label="Commandes payées" path="/admin/orders?status=paid" />
                <Box icon="🚚" label="En livraison" path="/admin/orders?status=shipping" />
                <Box icon="💰" label="Ventes globales" path="/admin/sales" />
                <Box icon="📊" label="Revenus plateforme" path="/admin/revenue" />
                <Box icon="📈" label="Statistiques" path="/admin/stats" />
                <Box icon="🛒" label="Produits" path="/admin/products" />
                <Box icon="🗂️" label="Catégories" path="/admin/categories" />
                <Box icon="🔐" label="Sécurité" path="/admin/security" />
                <Box icon="📜" label="Logs système" path="/admin/logs" />
            </div>
        </div>
    );
}

const styles = {
    page: { padding: "40px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
    title: { fontSize: "32px", fontWeight: "800", color: "#1e293b", margin: 0 },
    subtitle: { color: "#64748b", marginTop: "8px" },
    notifSection: { marginBottom: "30px", padding: "20px", backgroundColor: "#0f172a", borderRadius: "16px", color: "#fff" },
    sectionTitle: { margin: "0 0 15px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" },
    notifItem: { padding: "10px", borderBottom: "1px solid #1e293b", fontSize: "14px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
    box: {
        padding: "24px", borderRadius: "16px", backgroundColor: "#fff",
        border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s ease",
        display: "flex", alignItems: "center", gap: "15px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
    },
    boxIcon: { fontSize: "24px" },
    boxLabel: { fontWeight: "600", color: "#1e293b" }
};