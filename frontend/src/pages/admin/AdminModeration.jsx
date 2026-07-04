import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

// 🎨 DESIGN SYSTEM
const theme = {
    primary: "#064e3b",
    secondary: "#2563eb",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    background: "#f8fafc",
    surface: "#ffffff",
    border: "#e2e8f0",
    text: "#0f172a",
    muted: "#64748b"
};

export default function AdminModeration() {

    const navigate = useNavigate();

    // 🔐 PROTECTION ADMIN
    const isAdmin = localStorage.getItem("admin");

    if (!isAdmin) {
        return <Navigate to="/admin-login" />;
    }

    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedAd, setSelectedAd] = useState(null);
    const [newPrice, setNewPrice] = useState("");

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        fetchAds();
    }, []);

    // 🚪 LOGOUT
    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("admin");
        navigate("/admin-login");
    };

    async function fetchAds() {
        setLoading(true);

        const { data, error } = await supabase
            .from("ads")
            .select(`
        *,
        profiles (
            email,
            is_verified
        )
    `)
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error(error);
        } else {
            setAds(data || []);
        }

        setLoading(false);
    }

    async function deleteAd(id) {
        if (!window.confirm("Supprimer cette annonce ?")) return;

        const { error } = await supabase
            .from("ads")
            .delete()
            .eq("id", id);

        if (error) {
            alert(error.message);
            return;
        }

        fetchAds();
    }

    async function banUser(userId) {
        if (!window.confirm("Bannir ce vendeur ?")) return;

        const { error } = await supabase
            .from("profiles")
            .update({
                status: "banned"
            })
            .eq("id", userId);

        if (error) {
            alert(error.message);
            return;
        }

        alert("✅ Vendeur banni.");
    }
    async function updateAd() {
        const { error } = await supabase
            .from("ads")
            .update({
                price: newPrice,
                title: editTitle,
                description: editDescription
            })
            .eq("id", selectedAd.id);

        if (error) {
            alert(error.message);
            return;
        }

        setSelectedAd(null);
        fetchAds();
    }

    async function verifyUser(userId) {
        const { error } = await supabase
            .from("profiles")
            .update({
                is_verified: true
            })
            .eq("id", userId);

        if (error) {
            alert(error.message);
            return;
        }

        alert("✅ Vendeur vérifié !");
        fetchAds();
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>

                {/* 🔥 HEADER + LOGOUT */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            🧹 Modération ViteVendu
                        </h1>

                        <p style={styles.subtitle}>
                            {ads.length} annonce(s)
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            background: theme.danger,
                            color: "white",
                            padding: "10px 15px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        🚪 Déconnexion
                    </button>
                </div>

                <div style={styles.grid}>
                    {ads.map((ad) => (
                        <div key={ad.id} style={styles.card}>

                            <img
                                src={ad.image || "https://placehold.co/700x500?text=ViteVendu"}
                                alt={ad.title}
                                style={styles.image}
                            />

                            <div style={styles.body}>

                                <h3 style={styles.adTitle}>{ad.title}</h3>

                                <div style={styles.price}>
                                    {Number(ad.price).toLocaleString()} FCFA
                                </div>

                                <p style={styles.description}>
                                    {ad.description}
                                </p>

                                <div style={styles.email}>
                                    👤 {ad.profiles?.email || "Inconnu"}

                                    {ad.profiles?.is_verified && (
                                        <span style={{
                                            background: "#e0f2fe",
                                            color: "#0369a1",
                                            padding: "3px 8px",
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                            marginLeft: "8px",
                                            fontWeight: "600"
                                        }}>
                                            ✔ Vérifié
                                        </span>
                                    )}
                                </div>

                                <div style={styles.buttons}>

                                    <button
                                        style={styles.editBtn}
                                        onClick={() => {
                                            setSelectedAd(ad);
                                            setNewPrice(ad.price);
                                            setEditTitle(ad.title);
                                            setEditDescription(ad.description);
                                        }}
                                    >
                                        ✏ Modifier
                                    </button>

                                    <button
                                        style={styles.banBtn}
                                        onClick={() => banUser(ad.user_id)}
                                    >
                                        🚫 Bannir
                                    </button>

                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => deleteAd(ad.id)}
                                    >
                                        🗑 Supprimer
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))}
                </div>

                {selectedAd && (
                    <div style={styles.modal}>
                        <div style={styles.modalCard}>

                            <h2 style={styles.modalTitle}>
                                Modifier le prix
                            </h2>

                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Titre"
                            />

                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description"
                            />

                            <input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="Prix"
                            />

                            <div style={styles.modalButtons}>
                                <button onClick={updateAd}>
                                    💾 Sauvegarder
                                </button>

                                <button onClick={() => setSelectedAd(null)} style={styles.cancelBtn}>
                                    Annuler
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
const styles = {
    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px"
    },

    wrapper: {
        maxWidth: "1100px",
        margin: "0 auto"
    },

    header: {
        marginBottom: "20px"
    },

    title: {
        fontSize: "26px",
        fontWeight: "800",
        color: "#064e3b"
    },

    subtitle: {
        color: "#64748b"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "16px"
    },

    card: {
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e2e8f0"
    },

    image: {
        width: "100%",
        height: "180px",
        objectFit: "cover"
    },

    body: {
        padding: "12px"
    },

    adTitle: {
        fontSize: "16px",
        fontWeight: "700"
    },

    price: {
        fontWeight: "800",
        color: "#2563eb",
        marginTop: "6px"
    },

    description: {
        fontSize: "13px",
        color: "#64748b",
        marginTop: "6px"
    },

    email: {
        fontSize: "12px",
        marginTop: "8px",
        color: "#0f172a"
    },

    buttons: {
        display: "flex",
        gap: "8px",
        marginTop: "12px",
        flexWrap: "wrap"
    },

    editBtn: {
        padding: "6px 10px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    banBtn: {
        padding: "6px 10px",
        background: "#f59e0b",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    deleteBtn: {
        padding: "6px 10px",
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },

    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    modalCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        width: "300px"
    },

    modalButtons: {
        display: "flex",
        gap: "10px",
        marginTop: "10px"
    },

    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px"
    },

    saveBtn: {
        flex: 1,
        background: "#10b981",
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    cancelBtn: {
        flex: 1,
        background: "#e2e8f0",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer"
    }
};