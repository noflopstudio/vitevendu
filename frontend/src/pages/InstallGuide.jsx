import React from "react";

export default function InstallGuide() {
    return (
        <div style={styles.container}>

            <div style={styles.card}>

                <h1>📱 Installer ViteVendu</h1>

                <p>
                    ViteVendu est une <b>application PWA</b>, pas besoin de téléchargement APK.
                </p>

                <hr />

                <h2>🤖 Android (Chrome)</h2>
                <ul>
                    <li>Ouvre le site dans Chrome</li>
                    <li>Appuie sur ⋮ (menu)</li>
                    <li>Cliquer “Installer l’application”</li>
                </ul>

                <h2>🍎 iPhone (Safari)</h2>
                <ul>
                    <li>Ouvre Safari</li>
                    <li>Appuie sur “Partager”</li>
                    <li>“Ajouter à l’écran d’accueil”</li>
                </ul>

                <div style={styles.note}>
                    🚀 Play Store arrive bientôt
                </div>

            </div>

        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f1f5f9", // Fond gris clair/bleuté pour faire claquer le blanc
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },

    card: {
        background: "#ffffff",
        maxWidth: "750px", // Plus large pour bien occuper l'espace de manière centrée
        width: "100%",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(10, 25, 47, 0.06)",
        border: "1px solid #e2e8f0"
    },

    title: {
        fontSize: "32px",
        fontWeight: "800",
        textAlign: "center",
        marginBottom: "12px",
        // Splendide dégradé aux couleurs de ViteVendu (Vert foncé à Bleu profond)
        background: "linear-gradient(135deg, #0f5132 0%, #0a3a40 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },

    subtitle: {
        textAlign: "center",
        color: "#475569",
        fontSize: "15px",
        lineHeight: "1.6",
        maxWidth: "550px",
        margin: "0 auto 24px auto"
    },

    divider: {
        margin: "0 0 30px 0",
        border: "none",
        height: "1px",
        background: "#e2e8f0"
    },

    sectionAndroid: {
        background: "#f0fdf4", // Vert très clair en fond
        padding: "24px",
        borderRadius: "14px",
        marginBottom: "20px",
        border: "1px solid #d1fae5",
        borderLeft: "5px solid #0f5132" // Rappel Vert foncé
    },

    sectionTitleAndroid: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#0f5132",
        margin: "0 0 16px 0",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },

    sectionIos: {
        background: "#f0f9ff", // Bleu très clair en fond
        padding: "24px",
        borderRadius: "14px",
        marginBottom: "30px",
        border: "1px solid #e0f2fe",
        borderLeft: "5px solid #0a3a40" // Rappel Bleu profond
    },

    sectionTitleIos: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#0a3a40",
        margin: "0 0 16px 0",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },

    list: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    listItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        fontSize: "15px",
        color: "#334155",
        lineHeight: "1.5"
    },

    badgeAndroid: {
        background: "#0f5132", // Vert foncé ViteVendu
        color: "#ffffff",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "700",
        flexShrink: 0,
        marginTop: "2px"
    },

    badgeIos: {
        background: "#0a3a40", // Bleu profond ViteVendu
        color: "#ffffff",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "700",
        flexShrink: 0,
        marginTop: "2px"
    },

    note: {
        padding: "16px 20px",
        background: "#fffbeb",
        border: "1px solid #fef3c7",
        borderLeft: "4px solid #d97706",
        borderRadius: "12px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        marginBottom: "30px"
    },

    noteIcon: {
        fontSize: "18px"
    },

    noteText: {
        margin: 0,
        fontSize: "13.5px",
        color: "#92400e",
        lineHeight: "1.6"
    },

    button: {
        display: "block",
        textAlign: "center",
        padding: "14px",
        background: "linear-gradient(135deg, #0a3a40 0%, #0f5132 100%)", // Bouton dégradé premium
        color: "#ffffff",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: "700",
        fontSize: "16px",
        boxShadow: "0 4px 12px rgba(10, 58, 64, 0.15)",
        transition: "transform 0.2s ease"
    }
};