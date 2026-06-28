import { useNavigate } from "react-router-dom";

export default function SecurityTips() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* BOUTON RETOUR REPENSI */}
            <div style={styles.headerNav}>
                <button
                    style={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <span style={styles.backIcon}>←</span> Retour
                </button>
            </div>

            {/* HERO SECTION */}
            <div style={styles.heroSection}>
                <h1 style={styles.title}>
                    🛡️ Conseils de sécurité
                </h1>
                <p style={styles.subtitle}>
                    Votre sécurité est notre priorité. Découvrez les bonnes pratiques pour acheter et vendre en toute confiance sur ViteVendu.
                </p>
            </div>

            {/* INTRODUCTION */}
            <div style={styles.card}>
                <h2 style={styles.heading}>Bienvenue sur ViteVendu</h2>
                <p style={styles.text}>
                    ViteVendu met en relation des milliers d'acheteurs et de vendeurs partout en Côte d'Ivoire.
                </p>
                <p style={styles.text}>
                    Notre objectif est d'offrir une plateforme simple, rapide et surtout sécurisée.
                </p>
                <p style={styles.text}>
                    Même si nous travaillons chaque jour pour protéger nos utilisateurs, votre vigilance reste essentielle.
                </p>
            </div>

            {/* GRILLE DES CONSEILS ACHETEURS & VENDEURS */}
            <div style={styles.gridContainer}>

                {/* ENCADRÉ ACHETEURS */}
                <div style={styles.cardBuyer}>
                    <h2 style={styles.headingBuyer}>🛒 Pour les acheteurs</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>🔍 Vérifiez attentivement les photos et la description du produit.</li>
                        <li style={styles.listItem}>💬 Posez toutes vos questions au vendeur avant de confirmer votre achat.</li>
                        <li style={styles.listItem}>📸 Demandez des photos récentes ou une vidéo lorsque cela est possible.</li>
                        <li style={styles.listItem}>📍 Rencontrez le vendeur dans un lieu public lorsque la remise est en main propre.</li>
                        <li style={styles.listItem}>👀 Vérifiez le produit avant d'effectuer votre paiement.</li>
                        <li style={styles.listItem}>📁 Conservez toujours les preuves de paiement et vos échanges.</li>
                    </ul>
                </div>

                {/* ENCADRÉ VENDEURS */}
                <div style={styles.cardSeller}>
                    <h2 style={styles.headingSeller}>🏪 Pour les vendeurs</h2>
                    <ul style={styles.list}>
                        <li style={styles.listItem}>✏️ Décrivez vos produits avec précision.</li>
                        <li style={styles.listItem}>🖼️ Utilisez des photos réelles et de bonne qualité.</li>
                        <li style={styles.listItem}>⚠️ Indiquez clairement les éventuels défauts.</li>
                        <li style={styles.listItem}>🤝 Évitez les informations trompeuses.</li>
                        <li style={styles.listItem}>🛑 Ne remettez jamais un produit avant d'avoir confirmé le paiement.</li>
                        <li style={styles.listItem}>📦 Gardez les preuves de livraison lorsque cela est possible.</li>
                    </ul>
                </div>

            </div>

            {/* PAIEMENT SECURISE ENCADRE PREMIUM */}
            <div style={styles.cardPayment}>
                <h2 style={styles.headingPayment}>💳 Paiements sécurisés</h2>
                <p style={styles.textPaymentIntro}>
                    Avant d'effectuer un paiement, assurez-vous que toutes les informations concernant le produit sont correctes.
                </p>
                <div style={styles.paymentGlobalInfo}>
                    <p style={styles.text} style={{ margin: 0, fontSize: "14px", color: "#334155" }}>
                        🔒 <strong>Règle d'or :</strong> Ne communiquez jamais vos codes secrets, vos mots de passe ou vos codes de validation reçus par SMS à une autre personne. Conservez toujours vos reçus de paiement Wave ou Orange Money.
                    </p>
                </div>
            </div>

            {/* LIVRAISON */}
            <div style={styles.card}>
                <h2 style={styles.heading}>🚚 Livraison</h2>
                <div style={styles.flexGrid}>
                    <div style={styles.gridItem}>📦 Vérifiez que le colis correspond bien à votre commande.</div>
                    <div style={styles.gridItem}>🔍 Contrôlez l'état du produit dès sa réception.</div>
                    <div style={styles.gridItem}>🚨 Signalez immédiatement toute anomalie.</div>
                    <div style={styles.gridItem}>📄 Gardez les informations concernant la livraison.</div>
                </div>
            </div>

            {/* ALERTE ARNAQUES */}
            <div style={styles.warningCard}>
                <div style={styles.highlightBadgeWarning}>ALERTE VIGILANCE</div>
                <h2 style={styles.warningTitle}>🚨 Attention aux arnaques</h2>
                <ul style={styles.list}>
                    <li style={styles.listItemWarning}>📉 Méfiez-vous des prix anormalement bas ou trop beaux pour être vrais.</li>
                    <li style={styles.listItemWarning}>❌ Refusez toute demande de paiement suspecte ou compliquée.</li>
                    <li style={styles.listItemWarning}>🔗 Ne cliquez jamais sur un lien inconnu envoyé par SMS ou WhatsApp.</li>
                    <li style={styles.listItemWarning}>🔑 Ne partagez jamais votre mot de passe ou identifiant de connexion.</li>
                    <li style={styles.listItemWarning}>🪪 Vérifiez toujours l'identité et la cohérence de votre interlocuteur.</li>
                </ul>
            </div>

            {/* COMPTE */}
            <div style={styles.card}>
                <h2 style={styles.heading}>🔐 Protégez votre compte</h2>
                <ul style={styles.list}>
                    <li style={styles.listItem}>💡 Choisissez un mot de passe robuste et difficile à deviner.</li>
                    <li style={styles.listItem}>🔄 Changez régulièrement votre mot de passe pour plus de sécurité.</li>
                    <li style={styles.listItem}>💻 Déconnectez-vous systématiquement lorsque vous utilisez un appareil public ou partagé.</li>
                    <li style={styles.listItem}>🤫 Ne partagez jamais vos identifiants, même avec un proche.</li>
                </ul>
            </div>

            {/* QUE FAIRE EN CAS DE PROBLEME */}
            <div style={styles.card}>
                <h2 style={styles.heading}>📞 Que faire en cas de problème ?</h2>
                <p style={styles.text}>
                    Si vous pensez être victime d'une fraude ou si vous constatez un comportement suspect sur la plateforme, contactez rapidement notre équipe d'assistance.
                </p>
                <div style={styles.innerCard}>
                    <h3 style={styles.innerHeading}>🚀 Réactivité maximale</h3>
                    <p style={styles.textInner}>
                        Plus un signalement est effectué rapidement, plus nous pouvons agir efficacement pour bloquer le compte suspect et protéger le reste de la communauté.
                    </p>
                </div>
            </div>

            {/* ENGAGEMENT */}
            <div style={styles.successCard}>
                <h2 style={styles.successTitle}>❤️ Notre engagement</h2>
                <p style={styles.successText}>
                    Chez ViteVendu, nous améliorons continuellement la sécurité de notre plateforme afin d'offrir une expérience fiable, transparente et sécurisée à tous nos utilisateurs.
                </p>
                <p style={styles.successText} style={{ margin: 0, fontWeight: "600", color: "#166534" }}>
                    Merci de respecter ces recommandations et de contribuer à une communauté de confiance.
                </p>
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
                Ensemble, rendons ViteVendu plus sûr pour tous 🇨🇮
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 850,
        margin: "0 auto",
        padding: "20px",
        paddingTop: "40px",
        paddingBottom: "60px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#1e293b"
    },

    headerNav: {
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "25px"
    },

    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        background: "#ffffff",
        color: "#334155",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    },

    backIcon: {
        fontSize: "16px"
    },

    heroSection: {
        textAlign: "center",
        marginBottom: "35px"
    },

    title: {
        fontSize: "32px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "10px",
        letterSpacing: "-0.5px"
    },

    subtitle: {
        color: "#64748b",
        fontSize: "16px",
        margin: 0,
        lineHeight: "1.6"
    },

    card: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        border: "1px solid #f1f5f9"
    },

    cardBuyer: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
    },

    cardSeller: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
    },

    cardPayment: {
        background: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.04)",
        border: "1px solid #dcfce7"
    },

    warningCard: {
        background: "#0f172a",
        color: "#ffffff",
        padding: "28px",
        borderRadius: "20px",
        marginBottom: "24px",
        boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    successCard: {
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "24px"
    },

    heading: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "#0f172a"
    },

    headingBuyer: {
        fontSize: "19px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "#0369a1"
    },

    headingSeller: {
        fontSize: "19px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "#b45309"
    },

    headingPayment: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "12px",
        color: "#0f172a"
    },

    warningTitle: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#f97316",
        margin: 0
    },

    successTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#065f46",
        marginBottom: "12px"
    },

    text: {
        lineHeight: "1.7",
        color: "#475569",
        fontSize: "15px",
        marginBottom: "14px"
    },

    textPaymentIntro: {
        lineHeight: "1.7",
        color: "#475569",
        fontSize: "15px",
        marginBottom: "16px"
    },

    successText: {
        lineHeight: "1.7",
        color: "#065f46",
        fontSize: "15px",
        marginBottom: "12px"
    },

    highlightBadgeWarning: {
        background: "rgba(249, 115, 22, 0.2)",
        color: "#f97316",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "bold",
        letterSpacing: "1px",
        alignSelf: "flex-start"
    },

    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: "20px",
        marginBottom: "24px"
    },

    flexGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "12px",
        marginTop: "10px"
    },

    gridItem: {
        background: "#f8fafc",
        padding: "14px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#334155",
        border: "1px solid #f1f5f9",
        lineHeight: "1.5"
    },

    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },

    listItem: {
        fontSize: "14px",
        color: "#475569",
        lineHeight: "1.6"
    },

    listItemWarning: {
        fontSize: "14px",
        color: "#cbd5e1",
        lineHeight: "1.6"
    },

    paymentGlobalInfo: {
        background: "#ffffff",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0"
    },

    innerCard: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "18px",
        marginTop: "20px"
    },

    innerHeading: {
        margin: "0 0 10px 0",
        fontSize: "15px",
        color: "#0f172a",
        fontWeight: "700"
    },

    textInner: {
        fontSize: "14px",
        color: "#64748b",
        lineHeight: "1.6",
        margin: 0
    },

    footer: {
        textAlign: "center",
        marginTop: "30px",
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: "600"
    }
};