import React from "react";

export default function Privacy() {
    const sections = [
        {
            id: "1",
            title: "1. Données collectées",
            text: "Dans le cadre de l'utilisation de ViteVendu, nous collectons uniquement les données nécessaires au bon fonctionnement de la plateforme. Cela inclut : votre identité (nom, prénom ou pseudo), votre adresse email, votre numéro de téléphone (si fourni), vos données de connexion sécurisées, ainsi que les contenus que vous publiez volontairement (annonces, images, descriptions et prix)."
        },
        {
            id: "2",
            title: "2. Utilisation des données",
            text: "Les données collectées sont utilisées exclusivement pour : la création et la gestion de votre compte utilisateur, l'affichage de vos annonces, la mise en relation entre acheteurs et vendeurs, l'amélioration de l'expérience utilisateur et la sécurité de la plateforme. Nous n'utilisons jamais vos données à des fins non déclarées."
        },
        {
            id: "3",
            title: "3. Partage des données",
            text: "ViteVendu ne vend, ne loue et ne cède jamais vos données personnelles à des tiers. Certaines informations publiques (comme vos annonces ou votre profil vendeur) peuvent être visibles par les utilisateurs de la plateforme afin de permettre le bon fonctionnement du service."
        },
        {
            id: "4",
            title: "4. Sécurité et protection",
            text: "Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données contre l'accès non autorisé, la perte ou la modification. Les mots de passe sont chiffrés et les échanges sensibles sont sécurisés."
        },
        {
            id: "5",
            title: "5. Vos droits",
            text: "Conformément aux règles de protection des données, vous disposez d'un droit d'accès, de modification et de suppression de vos informations personnelles. Vous pouvez exercer ces droits directement depuis votre compte ou en contactant notre support."
        },
        {
            id: "6",
            title: "6. Contact",
            text: "Pour toute question concernant cette politique de confidentialité ou vos données personnelles, vous pouvez nous contacter à tout moment via : support@vitevendu.com"
        }
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