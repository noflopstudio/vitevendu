import { useEffect, useState } from "react";

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Empêche Chrome d'afficher son mini popup automatiquement
            e.preventDefault();

            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            alert("Installation non disponible sur ce navigateur");
            return;
        }

        // Ouvre le prompt natif Chrome
        deferredPrompt.prompt();

        const choiceResult = await deferredPrompt.userChoice;

        if (choiceResult.outcome === "accepted") {
            console.log("✔ Application installée");
        } else {
            console.log("❌ Installation refusée");
        }

        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    // Si pas installable → rien ne s'affiche
    if (!isInstallable) return null;

    return (
        <button style={styles.button} onClick={handleInstall}>
            📲 Installer ViteVendu
        </button>
    );
}

const styles = {
    button: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "linear-gradient(135deg, #10b981, #0ea5e9)",
        color: "#fff",
        border: "none",
        padding: "12px 16px",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        zIndex: 9999,
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)"
    }
};