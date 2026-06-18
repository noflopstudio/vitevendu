import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function NotificationBell({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    const userId = user?.id;

    // 📥 LOAD NOTIFICATIONS
    const fetchNotifications = async () => {
        if (!userId) return;

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("FETCH NOTIF ERROR:", error);
            return;
        }

        setNotifications(data || []);
    };

    useEffect(() => {
        if (!userId) return;

        fetchNotifications();

        // 🔔 REALTIME SAFE
        const channel = supabase
            .channel("notifications-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setNotifications((prev) => [payload.new, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // ✔ MARK AS READ SAFE
    const markAsRead = async (id) => {
        if (!userId) return;

        const { error } = await supabase
            .from("notifications")
            .update({ read: true })
            .eq("id", id)
            .eq("user_id", userId);

        if (!error) {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === id ? { ...n, read: true } : n
                )
            );
        } else {
            console.error("MARK READ ERROR:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div style={{ position: "relative", display: "inline-block" }}>

            {/* 🔔 BOUTON CLOCHE PREMIUM */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    ...styles.bellBtn,
                    background: open ? "#f1f5f9" : "transparent"
                }}
            >
                {/* Icône SVG minimaliste */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={open ? "#0f172a" : "#475569"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>

                {/* Badge Rouge Discret */}
                {unreadCount > 0 && (
                    <span style={styles.badge}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* 📦 PARE-AVANT/DROPDOWN BLANC ET ÉPURÉ */}
            {open && (
                <div style={styles.dropdown}>
                    {/* En-tête */}
                    <div style={styles.dropdownHeader}>
                        <span style={styles.headerTitle}>Notifications</span>
                        {unreadCount > 0 && (
                            <span style={styles.headerUnreadLabel}>{unreadCount} nouvelle(s)</span>
                        )}
                    </div>

                    {/* Liste des notifications */}
                    <div style={styles.listContainer}>
                        {notifications.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p style={styles.emptyText}>Aucune notification pour le moment</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    style={{
                                        ...styles.notifItem,
                                        backgroundColor: n.read ? "#ffffff" : "#f8fafc"
                                    }}
                                >
                                    {/* Indicateur de non-lu (Petit point bleu) */}
                                    {!n.read && <div style={styles.unreadIndicator} />}

                                    <div style={{
                                        ...styles.notifMessage,
                                        color: n.read ? "#64748b" : "#0f172a",
                                        fontWeight: n.read ? "400" : "600"
                                    }}>
                                        {n.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ================= DESIGN SYSTEM DESIGN MINIMALISTE =================
const styles = {
    bellBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease"
    },

    badge: {
        position: "absolute",
        top: "2px",
        right: "2px",
        background: "#ef4444", // Rouge vif moderne
        color: "white",
        borderRadius: "50%",
        fontSize: "10px",
        fontWeight: "700",
        minWidth: "16px",
        height: "16px",
        padding: "0 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #ffffff", // Évite que le rouge colle à l'icône
        boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)"
    },

    dropdown: {
        position: "absolute",
        right: 0,
        top: "44px",
        width: "310px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        zIndex: 10000,
        overflow: "hidden"
    },

    dropdownHeader: {
        padding: "14px 16px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },

    headerTitle: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#0f172a"
    },

    headerUnreadLabel: {
        fontSize: "11px",
        fontWeight: "600",
        color: "#3b82f6",
        background: "#eff6ff",
        padding: "2px 8px",
        borderRadius: "12px"
    },

    listContainer: {
        maxHeight: "280px",
        overflowY: "auto"
    },

    emptyState: {
        padding: "32px 16px",
        textAlign: "center"
    },

    emptyText: {
        margin: 0,
        fontSize: "13px",
        color: "#94a3b8",
        fontWeight: "500"
    },

    notifItem: {
        position: "relative",
        padding: "12px 16px",
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        transition: "background-color 0.15s ease"
    },

    unreadIndicator: {
        width: "6px",
        height: "6px",
        background: "#3b82f6",
        borderRadius: "50%",
        marginTop: "6px",
        flexShrink: 0
    },

    notifMessage: {
        margin: 0,
        fontSize: "13px",
        lineHeight: "1.4",
        textAlign: "left"
    }
};