import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, profile, ads, fetchAds }) {
    const navigate = useNavigate();

    // États pour le formulaire de création d'annonce
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        if (user) fetchAds();
    }, [user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    // Soumission du formulaire vers Supabase
    const handleCreateAd = async (e) => {
        e.preventDefault();
        if (!title.trim() || !price.trim() || !description.trim()) return;

        setPublishing(true);

        const { error } = await supabase.from("ads").insert([
            {
                title: title,
                price: parseFloat(price),
                description: description,
                user_id: user?.id, // On lie l'annonce à l'ID du vendeur connecté
            },
        ]);

        setPublishing(false);

        if (error) {
            alert("Erreur lors de la publication : " + error.message);
        } else {
            // On vide les champs du formulaire après succès
            setTitle("");
            setPrice("");
            setDescription("");
            // On rafraîchit la liste globale des annonces
            fetchAds();
        }
    };

    const myAds = ads?.filter((a) => a.user_id === user?.id) || [];

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>

                {/* BARRE DE NAVIGATION DU DASHBOARD */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>📊 Espace Marchand</h1>
                        <p style={styles.subtitle}>
                            Bienvenue, <span style={styles.username}>{profile?.username || user?.email?.split('@')[0]}</span>
                        </p>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Déconnexion
                    </button>
                </div>

                <div style={styles.mainGrid}>

                    {/* COLONNE GAUCHE : FORMULAIRE DE PUBLICATION */}
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>🚀 Lancer un nouveau projet</h2>
                        <form onSubmit={handleCreateAd} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Titre du projet / produit</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Sneakers Nike Air"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Prix (FCFA)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Ex: 25000"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Description détaillée</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Décrivez votre produit ou les conditions du projet..."
                                    style={{ ...styles.input, height: "100px", resize: "none" }}
                                    required
                                />
                            </div>

                            <button type="submit" style={styles.submitBtn} disabled={publishing}>
                                {publishing ? "Mise en ligne..." : "Publier le projet"}
                            </button>
                        </form>
                    </div>

                    {/* COLONNE DROITE : LISTE DES ANNONCES DU VENDEUR */}
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>📦 Mes projets en ligne ({myAds.length})</h2>
                        <div style={styles.adsList}>
                            {myAds.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <span style={{ fontSize: "32px" }}>📭</span>
                                    <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>Vous n'avez pas encore publié d'annonce.</p>
                                </div>
                            ) : (
                                myAds.map((ad) => (
                                    <div key={ad.id} style={styles.adItem}>
                                        <div style={styles.adMainInfo}>
                                            <h3 style={styles.adTitle}>{ad.title}</h3>
                                            <span style={styles.adPrice}>{ad.price.toLocaleString()} FCFA</span>
                                        </div>
                                        <p style={styles.adDesc}>{ad.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

/* =========================================================================
   STYLING OBJECTS (Design Épuré et Professionnel)
   ========================================================================= */
const styles = {
    pageWrapper: {
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "30px 20px",
        fontFamily: "'Inter', system-ui, sans-serif",
    },
    container: {
        maxWidth: "1000px",
        margin: "0 auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
    },
    title: {
        margin: 0,
        fontSize: "22px",
        fontWeight: "700",
        color: "#0f172a",
    },
    subtitle: {
        margin: "4px 0 0 0",
        fontSize: "14px",
        color: "#64748b",
    },
    username: {
        fontWeight: "600",
        color: "#4f46e5",
    },
    logoutBtn: {
        padding: "8px 16px",
        borderRadius: "10px",
        border: "1px solid #fee2e2",
        background: "#fef2f2",
        color: "#ef4444",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s",
    },
    mainGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "24px",
    },
    card: {
        background: "#ffffff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
    },
    sectionTitle: {
        margin: "0 0 20px 0",
        fontSize: "16px",
        fontWeight: "600",
        color: "#0f172a",
        borderBottom: "2px solid #f1f5f9",
        paddingBottom: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#475569",
    },
    input: {
        padding: "10px 14px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        color: "#1e293b",
        outline: "none",
        background: "#f8fafc",
        transition: "border-color 0.2s",
    },
    submitBtn: {
        background: "#4f46e5",
        color: "#ffffff",
        border: "none",
        padding: "12px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "10px",
        transition: "background 0.2s",
    },
    adsList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        maxHeight: "440px",
        overflowY: "auto",
        paddingRight: "4px",
    },
    adItem: {
        padding: "14px",
        borderRadius: "12px",
        background: "#f8fafc",
        border: "1px solid #f1f5f9",
    },
    adMainInfo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px",
        marginBottom: "6px",
    },
    adTitle: {
        margin: 0,
        fontSize: "14px",
        fontWeight: "600",
        color: "#0f172a",
    },
    adPrice: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#10b981",
        whiteSpace: "nowrap",
    },
    adDesc: {
        margin: 0,
        fontSize: "13px",
        color: "#64748b",
        lineHeight: "1.4",
    },
    emptyState: {
        textAlign: "center",
        padding: "40px 20px",
        color: "#94a3b8",
    }
};