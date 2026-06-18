import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const user = {
        name: "🌸 Douceur_Style",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
        created_at: "Janvier 2026"
    };

    const ads = ["1", "2", "3"];

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Avatar avec halo magique */}
                <div style={styles.avatarWrapper}>
                    <div style={styles.avatarGlow}>
                        <img src={user.avatar} alt="profil" style={styles.avatar} />
                    </div>
                    <span style={styles.badge}>✨ {ads.length}</span>
                </div>

                <h2 style={styles.username}>{user.name}</h2>

                <div style={styles.infoBox}>
                    <p style={styles.infoText}>📅 Membre depuis {user.created_at}</p>
                </div>

                {/* Boutons interactifs */}
                <button
                    style={styles.btnChat}
                    onClick={() => navigate("/chat/seller-123")}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 77, 109, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 6px 15px rgba(255, 77, 109, 0.25)";
                    }}
                >
                    💬 Discuter
                </button>

                <button
                    style={styles.btnShop}
                    onClick={() => navigate("/")}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                        e.currentTarget.style.background = "#fff0f3";
                        e.currentTarget.style.borderColor = "#ffccd5";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#ffe3e8";
                    }}
                >
                    🛍️ Voir boutique
                </button>

            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f5ff 0%, #fff0f5 100%)", // Dégradé ultra doux lavande/rose pastel
        fontFamily: "'Fredoka', 'Inter', system-ui, -apple-system, sans-serif" // Une typo arrondie change tout le rendu !
    },

    card: {
        width: 300,
        padding: "35px 25px 30px 25px",
        borderRadius: 32, // Des coins très ronds style "bulle"
        background: "#ffffff",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(165, 180, 252, 0.15)", // Ombre bleutée/rosée très aérienne
        border: "1px solid rgba(255, 255, 255, 0.7)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    avatarWrapper: {
        position: "relative",
        marginBottom: 16,
        display: "inline-block"
    },

    avatarGlow: {
        padding: 5,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ffccd5 0%, #c7d2fe 100%)", // Bordure de l'avatar pastel
    },

    avatar: {
        width: 105,
        height: 105,
        borderRadius: "50%",
        objectFit: "cover",
        border: "4px solid #fff", // Détache l'avatar du fond dégradé
        display: "block"
    },

    badge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        background: "linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)", // Remplacement du rouge brut par un dégradé framboise douce
        color: "#fff",
        borderRadius: 20,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: "bold",
        boxShadow: "0 4px 10px rgba(255, 77, 109, 0.3)",
        border: "2px solid #fff"
    },

    username: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#4a3e65", // Couleur prune douce plutôt que noir pur
        margin: "4px 0 0 0"
    },

    infoBox: {
        background: "#f8f9ff",
        padding: "6px 14px",
        borderRadius: "12px",
        marginTop: 6,
        marginBottom: 20,
        border: "1px solid #eef2ff"
    },

    infoText: {
        margin: 0,
        fontSize: "13px",
        color: "#756a93",
        fontWeight: "500"
    },

    btnChat: {
        width: "100%",
        padding: "12px 16px",
        marginTop: 10,
        border: "none",
        borderRadius: 16, // Boutons plus "ronds/moelleux"
        background: "linear-gradient(135deg, #ff758f 0%, #ff4d6d 100%)",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 6px 15px rgba(255, 77, 109, 0.25)",
        transition: "all 0.2s ease" // Transition fluide pour l'effet de survol
    },

    btnShop: {
        width: "100%",
        padding: "12px 16px",
        marginTop: 12,
        border: "2px solid #ffe3e8", // Bordure rose très discrète
        borderRadius: 16,
        background: "#fff",
        color: "#ff4d6d", // Texte assorti au thème rose
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease"
    }
};