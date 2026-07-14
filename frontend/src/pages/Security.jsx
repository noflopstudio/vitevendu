import React from "react";

export default function Security() {
    return (
        // Utilisation du conteneur de base
        <div style={securityStyles.container}>

            {/* Titre et Intro */}
            <div style={securityStyles.securityHero}>
                <h1 style={securityStyles.title}>🔒 Sécurité sur ViteVendu</h1>
                <p style={securityStyles.intro}>
                    La confiance est au cœur de ViteVendu. Nous mettons tout en œuvre
                    pour offrir une expérience simple, transparente et sécurisée.
                </p>
            </div>

            {/* Section Acheteurs */}
            <section style={securityStyles.securityCard}>
                <div style={securityStyles.iconBox}>🛡️</div>
                <div>
                    <h2 style={securityStyles.sectionTitle}>Conseils pour les acheteurs</h2>
                    <ul style={securityStyles.securityList}>
                        <li style={securityStyles.securityItem}>✓ Vérifiez les informations du vendeur avant tout achat.</li>
                        <li style={securityStyles.securityItem}>✓ Échangez avec le vendeur pour confirmer les détails.</li>
                        <li style={securityStyles.securityItem}>✓ Méfiez-vous des offres trop belles pour être vraies.</li>
                        <li style={securityStyles.securityItem}>✓ Privilégiez les rencontres dans des lieux publics.</li>
                    </ul>
                </div>
            </section>

            {/* Section Vendeurs */}
            <section style={securityStyles.securityCard}>
                <div style={securityStyles.iconBox}>🏪</div>
                <div>
                    <h2 style={securityStyles.sectionTitle}>Conseils pour les vendeurs</h2>
                    <ul style={securityStyles.securityList}>
                        <li style={securityStyles.securityItem}>✓ Publiez des informations exactes sur vos produits.</li>
                        <li style={securityStyles.securityItem}>✓ Ajoutez des photos réelles et de qualité.</li>
                        <li style={securityStyles.securityItem}>✓ Répondez rapidement aux demandes des clients.</li>
                    </ul>
                </div>
            </section>

            {/* Section Signalement */}
            <section style={securityStyles.securityCard}>
                <div style={securityStyles.iconBox}>🚨</div>
                <div>
                    <h2 style={securityStyles.sectionTitle}>Signaler un problème</h2>
                    <p style={securityStyles.securityItem}>
                        Si vous constatez une annonce suspecte, contactez notre équipe
                        afin que nous puissions prendre les mesures nécessaires.
                    </p>
                </div>
            </section>

        </div>
    );
}

const securityStyles = {

    container: {
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
        padding: "60px 24px",
        maxWidth: "900px",
        margin: "0 auto"
    },


    securityHero: {
        textAlign: "center",
        marginBottom: "60px"
    },


    title: {
        fontSize: "36px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "16px"
    },


    intro: {
        fontSize: "17px",
        lineHeight: "1.6",
        color: "#64748b",
        maxWidth: "680px",
        margin: "0 auto"
    },


    securityCard: {
        background: "#ffffff",
        padding: "32px",
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        marginBottom: "24px",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        boxShadow: "0 5px 15px rgba(0,0,0,0.04)"
    },


    iconBox: {
        width: "60px",
        height: "60px",
        background: "#eff6ff",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        flexShrink: 0
    },


    sectionTitle: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 12px 0"
    },


    securityList: {
        listStyle: "none",
        padding: 0,
        margin: 0
    },


    securityItem: {
        fontSize: "14.5px",
        lineHeight: "1.7",
        color: "#475569",
        padding: "8px 0"
    }

};