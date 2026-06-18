import { useState } from "react";

// 🎨 DESIGN SYSTEM VITEVENDU
const SV = {
    colors: {
        primary: "#064e3b",       // Vert foncé (Identité principale)
        primaryLight: "#f0fdf4",  // Fond léger vert
        secondary: "#2563eb",     // Bleu (Actions / Liens)
        accent: "#f97316",        // Orange (Mise en valeur Prix/Solde)
        dark: "#0f172a",          // Texte principal
        muted: "#64748b",         // Texte secondaire
        border: "#e2e8f0",        // Séparateurs
        bg: "#f8fafc"             // Fond de page
    }
};

export default function Wallet() {
    const [balance] = useState(0);

    return (
        <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.headerSection}>
                <h2 style={styles.mainTitle}>💰 Wallet / Revenus</h2>
                <p style={styles.subTitle}>Suivez et gérez votre portefeuille en temps réel</p>
            </div>

            {/* CONTENT */}
            <div style={styles.orderCard}>
                <div style={styles.cardTop}>
                    <div>
                        <span style={styles.reference}>VOTRE PORTefeuille</span>
                        <div style={styles.priceContainer}>
                            <span style={styles.price}>
                                {Number(balance).toLocaleString()}
                            </span>
                            <span style={styles.currency}>FCFA</span>
                        </div>
                    </div>
                    <span style={styles.badge}>
                        ✨ Compte Actif
                    </span>
                </div>

                <div style={styles.productRow}>
                    <p style={styles.infoText}>
                        💳 Les retraits via <b>Wave</b> et <b>Orange Money</b> seront bientôt disponibles sur votre plateforme.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ================= STYLES REFAITS (THEME VITEVENDU) =================
const styles = {
    container: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        padding: "24px 16px",
        paddingTop: "90px", // Aligné parfaitement sur l'écran Orders, aucun risque sous le burger mobile
        maxWidth: "680px",
        margin: "0 auto",
        boxSizing: "border-box",
        backgroundColor: SV.colors.bg,
        minHeight: "100vh"
    },

    headerSection: {
        marginBottom: "24px",
        textAlign: "left"
    },

    mainTitle: {
        fontSize: "22px", // Taille réduite pour correspondre exactement à Orders
        fontWeight: "800",
        margin: "0 0 2px 0",
        letterSpacing: "-0.5px",
        background: `linear-gradient(135deg, ${SV.colors.primary} 0%, ${SV.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        display: "inline-block"
    },

    subTitle: {
        margin: 0,
        fontSize: "12px",
        color: SV.colors.muted,
        fontWeight: "500",
        letterSpacing: "-0.1px"
    },

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

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: `1px dashed ${SV.colors.border}`,
        paddingBottom: "16px"
    },

    reference: {
        fontSize: "11px",
        fontWeight: "700",
        color: SV.colors.muted,
        letterSpacing: "0.8px",
        textTransform: "uppercase"
    },

    priceContainer: {
        display: "flex",
        alignItems: "baseline",
        gap: "5px",
        marginTop: "4px"
    },

    price: {
        fontSize: "32px", // Plus grand pour mettre en avant le solde disponible
        fontWeight: "900",
        color: SV.colors.accent,
        letterSpacing: "-1px"
    },

    currency: {
        fontSize: "15px",
        fontWeight: "800",
        color: SV.colors.accent
    },

    badge: {
        padding: "8px 14px",
        borderRadius: "14px",
        fontSize: "12px",
        fontWeight: "700",
        color: SV.colors.primary,
        backgroundColor: `${SV.colors.primary}12`,
        letterSpacing: "-0.1px"
    },

    productRow: {
        padding: "16px",
        borderRadius: "16px",
        background: `linear-gradient(135deg, #ffffff, ${SV.colors.primaryLight})`,
        border: `1px solid #f1f5f9`
    },

    infoText: {
        margin: 0,
        fontSize: "13.5px",
        color: SV.colors.dark,
        fontWeight: "500",
        lineHeight: "1.6",
        letterSpacing: "-0.1px"
    }
};