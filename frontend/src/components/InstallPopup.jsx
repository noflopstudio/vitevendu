import { useEffect, useState } from "react";

export default function InstallPopup() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("vitevendu_rules_accepted");

        if (!accepted) {
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("vitevendu_rules_accepted", "true");
        setShow(false);
    };

    // 🔁 réapparition si pas accepté
    useEffect(() => {
        if (!show) {
            const accepted = localStorage.getItem("vitevendu_rules_accepted");

            if (!accepted) {
                const timer = setTimeout(() => {
                    setShow(true);
                }, 15000); // revient après 15 sec

                return () => clearTimeout(timer);
            }
        }
    }, [show]);

    if (!show) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>

                {/* TITLE */}
                <h2 style={styles.title}>Règles de ViteVendu</h2>

                <p style={styles.text}>
                    En utilisant ViteVendu, vous acceptez de respecter
                    toutes les conditions d’utilisation de la plateforme.
                </p>

                {/* WARNING BOX */}
                <div style={styles.warningBox}>
                    <span style={styles.warningIcon}>⚠️</span>
                    <p style={styles.warningText}>
                        Tout non-respect des règles peut entraîner le
                        <strong> blocage ou bannissement définitif</strong> du compte vendeur ou utilisateur.
                    </p>
                </div>

                <p style={styles.info}>
                    Merci de rester respectueux et d’utiliser la plateforme de manière correcte.
                </p>

                <div style={styles.buttons}>
                    <button onClick={handleAccept} style={styles.button}>
                        Compris
                    </button>
                </div>

            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(10, 25, 47, 0.4)", // Voile bleuté sombre
        backdropFilter: "blur(4px)", // Léger flou d'arrière-plan
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },

    popup: {
        background: "#ffffff",
        padding: "35px 30px",
        borderRadius: "20px",
        maxWidth: "420px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(10, 37, 64, 0.15)",
        border: "1px solid #e2e8f0"
    },

    title: {
        fontSize: "24px",
        fontWeight: "800",
        marginBottom: "14px",
        margin: "0 0 14px 0",
        // Dégradé de Vert foncé à Bleu profond
        background: "linear-gradient(135deg, #0f5132 0%, #0a3a40 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },

    text: {
        fontSize: "15px",
        color: "#475569",
        lineHeight: "1.6",
        margin: "0 0 20px 0"
    },

    warningBox: {
        textAlign: "left",
        background: "#fff5f5", // Fond rouge très léger pour attirer l'attention
        border: "1px solid #fed7d7",
        borderLeft: "4px solid #e53e3e", // Bordure rouge vif pour la gravité de la règle
        padding: "14px 16px",
        borderRadius: "12px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        margin: "0 0 20px 0"
    },

    warningIcon: {
        fontSize: "18px",
        marginTop: "2px"
    },

    warningText: {
        margin: 0,
        fontSize: "14px",
        color: "#c53030", // Rouge sombre lisible
        lineHeight: "1.5"
    },

    info: {
        fontSize: "13.5px",
        color: "#64748b",
        lineHeight: "1.5",
        margin: "0 0 26px 0"
    },

    buttons: {
        display: "flex",
        justifyContent: "center"
    },

    button: {
        width: "100%", // Bouton pleine largeur plus moderne et cliquable
        background: "linear-gradient(135deg, #0f5132 0%, #0a3a40 100%)", // Dégradé aux couleurs de ton site
        color: "#ffffff",
        border: "none",
        padding: "14px",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "15px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(15, 81, 50, 0.15)",
        transition: "transform 0.2s ease"
    }
};