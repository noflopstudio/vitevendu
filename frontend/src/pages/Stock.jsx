import { useState } from "react";

// 🎨 SYSTÈME DE THÈME OFFICIEL VITEVENDU
const theme = {
    colors: {
        primary: "#064e3b",       // Vert foncé (Identité et Confiance)
        primaryLight: "#f0fdf4",  // Fond vert très clair
        secondary: "#2563eb",     // Bleu (Interaction et Sélection)
        accent: "#f97316",        // Orange (Touches d'accentuation / Prix)
        dark: "#0f172a",          // Texte principal
        muted: "#64748b",         // Texte secondaire / Catégories
        border: "#e2e8f0",        // Lignes et séparations
        background: "#f8fafc"     // Fond de page gris/bleu très clair haut de gamme
    }
};

export default function Stock() {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleNotifyClick = () => {
        setIsSubscribed(true);
        setTimeout(() => setIsSubscribed(false), 4000);
    };

    // Données fictives pour l'effet de flou en arrière-plan
    const mockProducts = [
        { id: 1, name: "iPhone 15 Pro Max 256Go", category: "Électronique", price: "750 000", qte: 4, status: "Stock faible" },
        { id: 2, name: "Chaise Ergonomique Bureau", category: "Mobilier", price: "85 000", qte: 12, status: "En stock" },
        { id: 3, name: "Sneakers Nike Air Max", category: "Mode", price: "65 000", qte: 0, status: "Rupture" }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>

                {/* HEADER */}
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>Gestion Stock</h2>
                    <p style={styles.subtitle}>Suivez vos quantités, gérez vos alertes et optimisez vos ventes</p>
                </div>

                {/* NOTIFICATION SUCCÈS */}
                {isSubscribed && (
                    <div style={styles.notification}>
                        🔔 C'est noté ! Vous recevrez une alerte prioritaire dès le déploiement du module.
                    </div>
                )}

                {/* CONTAINER INTERACTIF + BLUR EFFECT */}
                <div style={styles.showcaseCard}>

                    {/* Arrière-plan flouté simulant le futur tableau de gestion */}
                    <div style={styles.blurredTable}>
                        <div style={styles.tableHeaderRow}>
                            <span style={{ flex: 2, fontWeight: "700" }}>Produit</span>
                            <span style={{ flex: 1, fontWeight: "700" }}>Prix</span>
                            <span style={{ flex: 1, fontWeight: "700" }}>Quantité</span>
                        </div>
                        {mockProducts.map(p => (
                            <div key={p.id} style={styles.tableRow}>
                                <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: "13px", fontWeight: "600", color: theme.colors.dark }}>{p.name}</span>
                                    <span style={{ fontSize: "11px", color: theme.colors.muted }}>{p.category}</span>
                                </div>
                                <span style={{ flex: 1, fontSize: "13px", fontWeight: "700", color: theme.colors.accent }}>{p.price} F</span>
                                <span style={{ flex: 1, fontSize: "13px", fontWeight: "600" }}>{p.qte} pcs</span>
                            </div>
                        ))}
                    </div>

                    {/* Contenu d'accroche au premier plan */}
                    <div style={styles.overlayContent}>
                        <div style={styles.iconContainer}>📦</div>
                        <h3 style={styles.cardTitle}>Suivi des stocks intelligent</h3>
                        <p style={styles.text}>
                            Nous finalisons un outil d'inventaire automatisé pour vous alerter en cas de rupture de stock et mettre à jour vos annonces en un clic.
                        </p>
                        <button
                            onClick={handleNotifyClick}
                            style={styles.notifyBtn(isSubscribed)}
                            disabled={isSubscribed}
                        >
                            {isSubscribed ? "Inscription validée" : "M'avertir dès la sortie"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}

// ================= DESIGN SYSTEM EXCLUSIF VITEVENDU =================
const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: theme.colors.background,
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        paddingTop: "90px", // ✅ Aligné pour passer sous le burger menu mobile sans collision
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
    },

    wrapper: {
        width: "100%",
        maxWidth: "680px",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },

    header: {
        padding: "0 4px"
    },

    headerTitle: {
        margin: 0,
        fontSize: "26px",
        fontWeight: "800",
        letterSpacing: "-0.6px",
        background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        display: "inline-block"
    },

    subtitle: {
        fontSize: "13px",
        color: theme.colors.muted,
        fontWeight: "500",
        margin: "6px 0 0 0",
        lineHeight: "1.4"
    },

    notification: {
        padding: "14px 16px",
        borderRadius: "14px",
        fontSize: "13px",
        fontWeight: "600",
        background: theme.colors.primaryLight,
        color: theme.colors.primary,
        border: `1px solid #bbf7d0`,
        boxShadow: "0 4px 15px rgba(6, 78, 59, 0.03)",
        animation: "fadeIn 0.3s ease"
    },

    showcaseCard: {
        background: "#ffffff",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "24px",
        position: "relative",
        overflow: "hidden",
        padding: "48px 24px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "320px"
    },

    blurredTable: {
        position: "absolute",
        top: "20px",
        left: "20px",
        right: "20px",
        bottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        opacity: 0.15, // Effet d'arrière-plan discret
        filter: "blur(4px)", // ✅ Glassmorphism haut de gamme
        userSelect: "none",
        pointerEvents: "none"
    },

    tableHeaderRow: {
        display: "flex",
        paddingBottom: "8px",
        borderBottom: `1px solid ${theme.colors.border}`,
        fontSize: "11px",
        textTransform: "uppercase",
        color: theme.colors.muted,
        letterSpacing: "0.5px"
    },

    tableRow: {
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: `1px solid #f1f5f9`
    },

    overlayContent: {
        position: "relative",
        zIndex: 2,
        maxWidth: "420px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px"
    },

    iconContainer: {
        fontSize: "40px",
        background: theme.colors.primaryLight,
        width: "80px",
        height: "80px",
        borderRadius: "24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "8px",
        boxShadow: "0 8px 20px rgba(6, 78, 59, 0.04)"
    },

    cardTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "800",
        color: theme.colors.dark,
        letterSpacing: "-0.3px"
    },

    text: {
        margin: 0,
        fontSize: "14px",
        color: theme.colors.muted,
        fontWeight: "500",
        lineHeight: "1.6"
    },

    notifyBtn: (active) => ({
        padding: "12px 24px",
        background: active ? "#16a34a" : theme.colors.primary,
        color: "#ffffff",
        border: "none",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: active ? "default" : "pointer",
        transition: "all 0.2s ease",
        marginTop: "12px",
        boxShadow: active ? "none" : "0 4px 14px rgba(6, 78, 59, 0.15)"
    })
};