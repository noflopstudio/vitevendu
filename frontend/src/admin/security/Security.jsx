import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Security() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= FETCH USERS =================
    const fetchUsers = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log("ERROR =>", error);
        } else {
            setUsers(data || []);
        }

        setLoading(false);
    };

    // ================= BLOCK USER =================
    const blockUser = async (id) => {

        const { error } = await supabase
            .from("profiles")
            .update({ status: "blocked" })
            .eq("id", id);

        if (error) {
            console.log(error);
            return;
        }

        setUsers(prev =>
            prev.map(u =>
                u.id === id ? { ...u, status: "blocked" } : u
            )
        );
    };

    // ================= UNBLOCK USER =================
    const unblockUser = async (id) => {

        const { error } = await supabase
            .from("profiles")
            .update({ status: "active" })
            .eq("id", id);

        if (error) {
            console.log(error);
            return;
        }

        setUsers(prev =>
            prev.map(u =>
                u.id === id ? { ...u, status: "active" } : u
            )
        );
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ================= LOADING =================
    if (loading) {
        return (
            <div style={{ padding: 20, fontWeight: 600 }}>
                🔄 Chargement utilisateurs...
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>

                <div style={styles.header}>
                    <h2 style={styles.title}>🔐 Gestion des utilisateurs</h2>
                    <p style={styles.subtitle}>
                        {users.length} utilisateur(s)
                    </p>
                </div>

                {users.length === 0 ? (
                    <div style={styles.empty}>
                        Aucun utilisateur trouvé
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {users.map(user => (
                            <div key={user.id} style={styles.card}>

                                <div style={styles.top}>
                                    <div>
                                        <p style={styles.email}>📧 {user.email}</p>

                                        <span
                                            style={{
                                                ...styles.badge,
                                                background: user.role === "admin" ? "#fee2e2" : "#e0f2fe",
                                                color: user.role === "admin" ? "#b91c1c" : "#0369a1"
                                            }}
                                        >
                                            {user.role}
                                        </span>

                                        <span
                                            style={{
                                                ...styles.badge,
                                                marginLeft: 8,
                                                background: user.status === "blocked" ? "#fee2e2" : "#dcfce7",
                                                color: user.status === "blocked" ? "#b91c1c" : "#166534"
                                            }}
                                        >
                                            {user.status || "active"}
                                        </span>
                                    </div>
                                </div>

                                <p style={styles.sub}>
                                    ⭐ Subscription : {user.subscription_status}
                                </p>

                                {/* ACTIONS */}
                                <div style={styles.actions}>

                                    {user.role === "admin" ? (
                                        <span style={styles.protected}>
                                            🔒 Admin protégé
                                        </span>
                                    ) : (
                                        <>
                                            {user.status === "blocked" ? (
                                                <button
                                                    onClick={() => unblockUser(user.id)}
                                                    style={{ ...styles.btn, background: "#10b981" }}
                                                >
                                                    ✅ Débloquer
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => blockUser(user.id)}
                                                    style={{ ...styles.btn, background: "#ef4444" }}
                                                >
                                                    🚫 Bloquer
                                                </button>
                                            )}
                                        </>
                                    )}

                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}



const styles = {
    page: {
        padding: 20,
        background: "#f8fafc",
        minHeight: "100vh"
    },

    wrapper: {
        maxWidth: 1100,
        margin: "0 auto"
    },

    header: {
        marginBottom: 20
    },

    title: {
        fontSize: 22,
        fontWeight: 800,
        color: "#0f172a"
    },

    subtitle: {
        color: "#64748b",
        marginTop: 5
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 15
    },

    card: {
        background: "#fff",
        borderRadius: 12,
        padding: 15,
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    },

    email: {
        fontWeight: 600,
        marginBottom: 8
    },

    badge: {
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600
    },

    sub: {
        fontSize: 13,
        color: "#64748b",
        marginTop: 10
    },

    actions: {
        marginTop: 12,
        display: "flex",
        gap: 10,
        alignItems: "center"
    },

    btn: {
        padding: "6px 10px",
        border: "none",
        color: "#fff",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13
    },

    protected: {
        fontSize: 13,
        color: "#b91c1c",
        fontWeight: 700
    },

    empty: {
        textAlign: "center",
        padding: 40,
        color: "#64748b"
    },

    top: {
        marginBottom: 5
    }
};