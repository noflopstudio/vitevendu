import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InstallPopup() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const closed = localStorage.getItem("install_popup_closed");

        if (!closed) {
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleInstall = () => {
        setShow(false);
        navigate("/install-guide");
    };

    const handleClose = () => {
        localStorage.setItem("install_popup_closed", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>

                {/* TITLE */}
                <h2 style={styles.title}>Installer ViteVendu</h2>

                <p style={styles.description}>
                    Ajoutez ViteVendu à votre écran d’accueil pour une expérience rapide.
                </p>

                <p style={styles.info}>
                    🚀 Version PWA disponible maintenant<br />
                    Play Store bientôt
                </p>

                <div style={styles.buttons}>
                    <button onClick={handleInstall} style={styles.installButton}>
                        Installer
                    </button>

                    <button onClick={handleClose} style={styles.laterButton}>
                        Plus tard
                    </button>
                </div>

            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(10, 25, 47, 0.4)", // Voile sombre légèrement bleuté
        backdropFilter: "blur(4px)", // Floute doucement le fond de ton site
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: "20px",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },

    popup: {
        width: "100%",
        maxWidth: "400px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "35px 30px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(10, 37, 64, 0.15)",
        border: "1px solid #e2e8f0"
    },

    title: {
        margin: "0 0 12px 0",
        fontSize: "26px",
        fontWeight: "800",
        // Magnifique dégradé Vert foncé à Bleu profond
        background: "linear-gradient(135deg, #0f5132 0%, #0a3a40 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },

    description: {
        margin: "0 0 16px 0",
        color: "#475569",
        lineHeight: "1.6",
        fontSize: "15px",
        fontWeight: "500"
    },

    info: {
        margin: "0 0 24px 0",
        fontSize: "13px",
        color: "#64748b",
        lineHeight: "1.6",
        background: "#f8fafc", // Petit encadré gris/bleu très clair
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #f1f5f9"
    },

    buttons: {
        display: "flex",
        gap: "12px",
        marginTop: "0px"
    },

    installButton: {
        flex: 1,
        // Bouton principal en dégradé corporate premium
        background: "linear-gradient(135deg, #0f5132 0%, #0a3a40 100%)",
        color: "#ffffff",
        border: "none",
        borderRadius: "12px",
        padding: "14px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px",
        boxShadow: "0 4px 12px rgba(15, 81, 50, 0.15)",
        transition: "transform 0.2s ease"
    },

    laterButton: {
        flex: 1,
        background: "#f1f5f9",
        color: "#475569",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "14px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px",
        transition: "background 0.2s ease"
    }
};