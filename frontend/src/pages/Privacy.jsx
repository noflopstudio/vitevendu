import React from "react";

export default function Privacy() {
    const sections = [
        { id: "1", title: "1. Données collectées", text: "Dans le cadre de l'utilisation de notre plateforme, nous collectons les informations nécessaires au bon fonctionnement des services : votre identité complète (nom, prénom), votre adresse email, votre numéro de téléphone (notamment pour les liaisons WhatsApp), vos données de connexion cryptées, ainsi que l'ensemble des contenus (images, textes, prix) que vous publiez volontairement sur vos micro-boutiques." },
        { id: "2", title: "2. Utilisation de vos données", text: "Les informations recueillies font l'objet d'un traitement informatique destiné exclusivement à : assurer la gestion et la personnalisation de votre compte marchand, fluidifier la mise en relation et l'ouverture des fenêtres de chat direct entre acheteurs et vendeurs, optimiser les performances techniques de l'application et vous adresser des notifications importantes relatives à vos annonces." },
        { id: "3", title: "3. Partage et non-divulgation", text: "Nous appliquons une politique de tolérance zéro concernant le commerce de données : ViteVendu ne vend, ne loue, et ne cède jamais vos informations personnelles à des tiers. Les seules données partagées sont celles indispensables à l'activité commerciale que vous initiez (votre profil public de vendeur et vos annonces visibles par tous les visiteurs)." },
        { id: "4", title: "4. Sécurité des infrastructures", text: "Vos données de connexion et d'authentification sont protégées par des protocoles de chiffrement avancés. Nous mettons en œuvre des mesures de sécurité rigoureuses au niveau de nos bases de données pour prévenir tout accès non autorisé, altération, divulgation ou destruction de vos fichiers personnels." },
        { id: "5", title: "5. Vos droits et contrôle", text: "Conformément aux réglementations sur la protection des données, vous disposez d'un droit absolu d'accès, de rectification, de portabilité et de suppression de toutes les données vous concernant. Vous pouvez modifier vos informations directement depuis votre Dashboard ou formuler une demande de clôture de compte définitive auprès de notre support." }
    ];

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>

                {/* ================= EN-TÊTE PRINCIPAL ================= */}
                <section style={styles.heroSection}>
                    <div style={styles.iconHeader}>🔒</div>
                    <h1 style={styles.mainTitle}>
                        Politique de <span style={styles.gradientText}>Confidentialité</span>
                    </h1>
                    <p style={styles.leadText}>
                        Chez ViteVendu, nous accordons une importance capitale à la protection de votre vie privée et à la sécurité de vos données commerciales.
                    </p>
                </section>

                {/* ================= CONTENU JURIDIQUE FORMATE ================= */}
                <div style={styles.layoutBody}>
                    <div style={styles.articleList}>
                        {sections.map((section) => (
                            <div key={section.id} style={styles.articleCard}>
                                <h2 style={styles.articleTitle}>{section.title}</h2>
                                <p style={styles.articleText}>{section.text}</p>
                            </div>
                        ))}

                        {/* SECTION CONTACT */}
                        <div style={styles.contactBox}>
                            <h3 style={styles.contactTitle}>📧 Contact & Délégué aux données</h3>
                            <p style={styles.contactText}>
                                Pour toute question relative à la présente politique, pour exercer vos droits ou pour toute demande de suppression de compte, contactez directement notre cellule support à l'adresse dédiée :
                            </p>
                            <a href="mailto:support@vitevendu.com" style={styles.emailLink}>
                                support@vitevendu.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* ================= FOOTER DE LA PAGE ================= */}
                <footer style={styles.pageFooter}>
                    <p style={styles.footerNote}>Dernière mise à jour : Mai 2026</p>
                    <p style={styles.footerLegal}>ViteVendu Platform — Document officiel de protection des tiers.</p>
                </footer>

            </div>
        </div>
    );
}

/* =========================================================================
   DESIGN SYSTEM & STYLES (PRIVACY PAGE)
   ========================================================================= */
const styles = {
    pageContainer: {
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
        padding: "60px 24px"
    },
    contentWrapper: {
        maxWidth: "850px",
        margin: "0 auto"
    },
    heroSection: {
        textAlign: "center",
        marginBottom: "48px"
    },
    iconHeader: {
        fontSize: "40px",
        marginBottom: "12px"
    },
    mainTitle: {
        fontSize: "34px",
        fontWeight: "800",
        lineSpacing: "-0.5px",
        color: "#0f172a",
        margin: "0 0 12px 0"
    },
    gradientText: {
        background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    leadText: {
        fontSize: "16.5px",
        lineHeight: "1.6",
        color: "#64748b",
        maxWidth: "640px",
        margin: "0 auto"
    },
    layoutBody: {
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },
    articleList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    articleCard: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
    },
    articleTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 12px 0"
    },
    articleText: {
        fontSize: "14.5px",
        lineHeight: "1.7",
        color: "#475569",
        margin: 0,
        textAlign: "justify"
    },
    contactBox: {
        background: "#eff6ff",
        padding: "30px",
        borderRadius: "16px",
        border: "1px solid #bfdbfe",
        marginTop: "10px"
    },
    contactTitle: {
        fontSize: "16.5px",
        fontWeight: "700",
        color: "#1e40af",
        margin: "0 0 8px 0"
    },
    contactText: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#1e3a8a",
        margin: "0 0 16px 0"
    },
    emailLink: {
        display: "inline-block",
        background: "#4f46e5",
        color: "#ffffff",
        fontWeight: "600",
        fontSize: "14px",
        padding: "10px 20px",
        borderRadius: "8px",
        textDecoration: "none",
        boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)"
    },
    pageFooter: {
        textAlign: "center",
        marginTop: "48px",
        borderTop: "1px solid #e2e8f0",
        paddingTop: "24px"
    },
    footerNote: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#94a3b8",
        margin: "0 0 4px 0"
    },
    footerLegal: {
        fontSize: "11px",
        color: "#cbd5e1",
        margin: 0
    }
};