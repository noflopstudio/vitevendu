import React from "react";

export default function Contact() {
    const whatsappNumber = "2250748922397"; // Numéro officiel sans le +

    const supportTopics = [
        { title: "🔑 Connexion & Comptes", desc: "Difficultés d'accès, modification de profil marchand ou gestion des identifiants." },
        { title: "📦 Publication d'Annonces", desc: "Aide pour l'importation de photos, gestion des prix (FCFA) ou mise à jour de catalogue." },
        { title: "💳 Facturation & Abonnements", desc: "Questions relatives aux formules marchandes et options de mise en avant." },
        { title: "🛠️ Signalement de Bugs", desc: "Assistance technique immédiate en cas de ralentissement ou comportement anormal." }
    ];

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>

                {/* ================= EN-TÊTE PRINCIPAL ================= */}
                <section style={styles.heroSection}>
                    <span style={styles.badge}>Centre d'Assistance</span>
                    <h1 style={styles.mainTitle}>
                        Une question ? Notre équipe est <span style={styles.gradientText}>à votre écoute</span>
                    </h1>
                    <p style={styles.leadText}>
                        Un problème technique, une question sur vos annonces ou besoin d'un accompagnement personnalisé ? L'équipe ViteVendu est à votre entière disposition pour propulser votre activité.
                    </p>
                </section>

                {/* ================= CORPS DE PAGE EN DEUX COLONNES ================= */}
                <div style={styles.layoutGrid}>

                    {/* COLONNE GAUCHE : COORDONNÉES DIRECTES */}
                    <div style={styles.leftColumn}>
                        <h2 style={styles.sectionTitle}>📞 Nos coordonnées</h2>
                        <div style={styles.contactCardsStack}>

                            <div style={styles.contactItemCard}>
                                <div style={styles.iconCircle}>📍</div>
                                <div>
                                    <h4 style={styles.cardLabel}>Siège Social</h4>
                                    <p style={styles.cardValue}>Abidjan, Côte d'Ivoire</p>
                                </div>
                            </div>

                            <div style={styles.contactItemCard}>
                                <div style={styles.iconCircle}>📞</div>
                                <div>
                                    <h4 style={styles.cardLabel}>Téléphone</h4>
                                    <p style={styles.cardValue}>+225 07 48 92 23 97</p>
                                </div>
                            </div>

                            <div style={styles.contactItemCard}>
                                <div style={styles.iconCircle}>✉️</div>
                                <div>
                                    <h4 style={styles.cardLabel}>Adresse Email</h4>
                                    <a
                                        href="mailto:vitevendu1@gmail.com"
                                        style={{ ...styles.cardValue, color: "#4f46e5", textDecoration: "none" }}
                                    >
                                        vitevendu1@gmail.com
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* COLONNE DROITE : THÉMATIQUES DE SUPPORT */}
                    <div style={styles.rightColumn}>
                        <h2 style={styles.sectionTitle}>🛠️ Domaines d'intervention</h2>
                        <div style={styles.supportGrid}>
                            {supportTopics.map((topic, idx) => (
                                <div key={idx} style={styles.supportTopicCard}>
                                    <h4 style={styles.topicTitle}>{topic.title}</h4>
                                    <p style={styles.topicDesc}>{topic.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ================= ZONE DE CONTACT WHATSAPP (CALL TO ACTION) ================= */}
                <section style={styles.ctaWhatsApp}>
                    <h3 style={styles.ctaTitle}>💬 Assistance Instantanée sur WhatsApp</h3>
                    <p style={styles.ctaSubtitle}>
                        Pour une prise en charge immédiate par l'un de nos conseillers techniques, ouvrez un ticket directement sur WhatsApp.
                    </p>

                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Bonjour%20l%27%C3%A9quipe%20ViteVendu%2C%20j%27ai%20besoin%20d%27aide%20concernant%20ma%20boutique.`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.whatsappButton}
                    >
                        Contacter le Support Client
                    </a>

                    <p style={styles.responseTime}>⏱️ Délai moyen de réponse : moins de 30 minutes</p>
                </section>

            </div>

            {/* ================= FOOTER ================= */}
            <footer style={{
                ...styles.footer,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%"
            }}>
                <p style={styles.footerText}>
                    © {new Date().getFullYear()} <b>ViteVendu</b>. Document légal et obligatoire.
                </p>
            </footer>

        </div>
    );
}

/* =========================================================================
   DESIGN SYSTEM & STYLES (CONTACT PAGE)
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
        maxWidth: "1000px",
        margin: "0 auto"
    },
    heroSection: {
        textAlign: "center",
        marginBottom: "56px"
    },
    badge: {
        display: "inline-block",
        background: "#e0e7ff",
        color: "#4338ca",
        fontSize: "12px",
        fontWeight: "700",
        padding: "6px 14px",
        borderRadius: "20px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "16px"
    },
    mainTitle: {
        fontSize: "36px",
        fontWeight: "800",
        lineHeight: "1.25",
        letterSpacing: "-0.5px",
        margin: "0 0 16px 0",
        color: "#0f172a"
    },
    gradientText: {
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    leadText: {
        fontSize: "16.5px",
        lineHeight: "1.65",
        color: "#64748b",
        maxWidth: "750px",
        margin: "0 auto"
    },
    layoutGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "40px",
        marginBottom: "56px"
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "20px",
        borderBottom: "2px solid #e2e8f0",
        paddingBottom: "10px"
    },
    contactCardsStack: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    contactItemCard: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    iconCircle: {
        width: "44px",
        height: "44px",
        background: "#f1f5f9",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        flexShrink: 0
    },
    cardLabel: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#94a3b8",
        margin: "0 0 2px 0",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    cardValue: {
        fontSize: "15.5px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0
    },
    supportGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    supportTopicCard: {
        background: "#ffffff",
        padding: "18px 22px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0"
    },
    topicTitle: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 4px 0"
    },
    topicDesc: {
        fontSize: "13.5px",
        lineHeight: "1.5",
        color: "#64748b",
        margin: 0
    },
    ctaWhatsApp: {
        background: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        border: "1px solid #bbf7d0",
        textAlign: "center",
        boxShadow: "0 10px 30px -10px rgba(22, 163, 74, 0.08)"
    },
    ctaTitle: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#0f172a",
        margin: "0 0 8px 0"
    },
    ctaSubtitle: {
        fontSize: "15px",
        color: "#475569",
        maxWidth: "600px",
        margin: "0 auto 24px auto",
        lineHeight: "1.6"
    },
    whatsappButton: {
        display: "inline-block",
        background: "#25D366",
        color: "#ffffff",
        padding: "14px 32px",
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: "700",
        textDecoration: "none",
        boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
        transition: "all 0.2s ease"
    },
    responseTime: {
        fontSize: "12.5px",
        fontWeight: "600",
        color: "#16a34a",
        marginTop: "16px",
        marginHeight: 0
    },

    footer: {
        marginTop: "20px",
        borderTop: "1px solid #eeeeee",
        paddingTop: "30px"
    },
    footerText: {
        fontSize: "13px",
        color: "#888888",
        margin: 0
    }
};