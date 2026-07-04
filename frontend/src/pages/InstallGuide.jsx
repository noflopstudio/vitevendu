import React from "react";

export default function InstallGuide() {
    return (
        <div style={styles.container}>

            <div style={styles.card}>

                {/* TITLE */}
                <h1 style={styles.title}>
                    Installer ViteVendu
                </h1>

                <p style={styles.text}>
                    ViteVendu est une <b>application PWA</b>, pas besoin de téléchargement APK.
                </p>

                <hr style={styles.hr} />

                {/* ANDROID */}
                <div style={styles.sectionAndroid}>
                    <h2 style={styles.h2Android}>🤖 Android</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <span style={styles.badgeAndroid}>1</span>
                            <span>Lors de la première visite sur <b>vite-vendu.com</b> avec Chrome, une option peut apparaître pour installer l’application (PWA).</span>
                        </li>

                        <li style={styles.listItem}>
                            <span style={styles.badgeAndroid}>2</span>
                            <span>Cette option dépend du navigateur et peut apparaître sous forme de bouton “Installer l’application” ou “Ajouter à l’écran d’accueil”.</span>
                        </li>

                        <li style={styles.listItem}>
                            <span style={styles.badgeAndroid}>3</span>
                            <span>Si vous ne voyez pas cette option, continuez simplement à utiliser le site.</span>
                        </li>

                        <li style={styles.listItem}>
                            <span style={styles.badgeAndroid}>4</span>
                            <span>Le navigateur peut la proposer à nouveau lors d’une prochaine visite.</span>
                        </li>

                        <li style={styles.listItem}>
                            <span style={styles.badgeAndroid}>5</span>
                            <span>Une fois accepté, ViteVendu s’installe comme une application sans APK.</span>
                        </li>
                    </ul>
                </div>

                {/* IPHONE */}
                <div style={styles.sectionIos}>
                    <h2 style={styles.h2Ios}>🍎 iPhone (Safari)</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>
                            <span style={styles.badgeIos}>1</span>
                            <span>Ouvre Safari</span>
                        </li>
                        <li style={styles.listItem}>
                            <span style={styles.badgeIos}>2</span>
                            <span>Appuie sur “Partager”</span>
                        </li>
                        <li style={styles.listItem}>
                            <span style={styles.badgeIos}>3</span>
                            <span>“Ajouter à l’écran d’accueil”</span>
                        </li>
                    </ul>
                </div>

                {/* NOTE */}
                <div style={styles.note}>
                    <span style={styles.noteIcon}>🚀</span>
                    <p style={styles.noteText}>Play Store arrive bientôt</p>
                </div>

            </div>

        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f1f5f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#0f172a"
    },

    card: {
        background: "#ffffff",
        maxWidth: "750px",
        width: "100%",
        padding: "40px 30px",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(10, 25, 47, 0.06)",
        border: "1px solid #e2e8f0",
        color: "#0f172a"
    },

    title: {
        fontSize: "32px",
        fontWeight: "800",
        textAlign: "center",
        marginBottom: "12px",
        // Superbe dégradé corporate (Vert foncé à Bleu profond)
        background: "linear-gradient(135deg, #0f5132 0%, #0a3a40 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },

    text: {
        textAlign: "center",
        color: "#475569",
        fontSize: "15px",
        lineHeight: "1.6",
        maxWidth: "550px",
        margin: "0 auto"
    },

    hr: {
        border: "none",
        height: "1px",
        background: "#e2e8f0",
        margin: "30px 0"
    },

    sectionAndroid: {
        background: "#f0fdf4", // Fond vert clair
        padding: "24px",
        borderRadius: "14px",
        marginBottom: "20px",
        border: "1px solid #d1fae5",
        borderLeft: "5px solid #0f5132" // Rappel vert foncé
    },

    h2Android: {
        fontSize: "19px",
        fontWeight: "700",
        color: "#0f5132",
        margin: "0 0 16px 0"
    },

    sectionIos: {
        background: "#f0f9ff", // Fond bleu clair
        padding: "24px",
        borderRadius: "14px",
        marginBottom: "25px",
        border: "1px solid #e0f2fe",
        borderLeft: "5px solid #0a3a40" // Rappel bleu profond
    },

    h2Ios: {
        fontSize: "19px",
        fontWeight: "700",
        color: "#0a3a40",
        margin: "0 0 16px 0"
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
        gap: "12px",
        fontSize: "15px",
        color: "#334155",
        lineHeight: "1.5"
    },

    badgeAndroid: {
        background: "#0f5132",
        color: "#ffffff",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "11px",
        fontWeight: "700",
        flexShrink: 0,
        marginTop: "1px"
    },

    badgeIos: {
        background: "#0a3a40",
        color: "#ffffff",
        width: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "11px",
        fontWeight: "700",
        flexShrink: 0,
        marginTop: "1px"
    },

    note: {
        marginTop: "25px",
        padding: "16px 20px",
        background: "#fffbeb",
        border: "1px solid #fef3c7",
        borderLeft: "4px solid #f59e0b",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    noteIcon: {
        fontSize: "18px"
    },

    noteText: {
        margin: 0,
        fontSize: "14px",
        color: "#92400e",
        fontWeight: "600"
    }
};