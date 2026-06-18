import React from "react";

export default function Blog() {
    // Simulation de données d'articles pour rendre le blog dynamique et pro
    const articles = [
        {
            id: 1,
            category: "Astuces Ventes",
            title: "5 astuces incontournables pour rédiger une annonce qui vend à coup sûr",
            excerpt: "Découvrez comment choisir un titre percutant, fixer le bon prix et rédiger une description claire pour attirer un maximum d'acheteurs sur votre micro-boutique.",
            date: "19 Mai 2026",
            readTime: "3 min de lecture",
            icon: "✍️"
        },
        {
            id: 2,
            category: "Stratégie",
            title: "Pourquoi digitaliser votre boutique physique à Abidjan en 2026 ?",
            excerpt: "Le commerce de proximité se transforme. Découvrez comment la création d'un catalogue en ligne accessible 24h/24 peut multiplier vos ventes quotidiennes sans frais cachés.",
            date: "16 Mai 2026",
            readTime: "5 min de lecture",
            icon: "📈"
        },
        {
            id: 3,
            category: "Confiance & Sécurité",
            title: "Comment instaurer une confiance absolue avec vos clients par chat",
            excerpt: "La vente directe sans intermédiaire repose sur la confiance. Apprenez les bonnes pratiques pour répondre rapidement et rassurer vos acheteurs instantanément.",
            date: "10 Mai 2026",
            readTime: "4 min de lecture",
            icon: "🤝"
        }
    ];

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>

                {/* ================= EN-TÊTE DU BLOG ================= */}
                <section style={styles.heroSection}>
                    <span style={styles.badge}>Espace Conseils</span>
                    <h1 style={styles.mainTitle}>
                        Le Blog & <span style={styles.gradientText}>Actualités</span> de ViteVendu
                    </h1>
                    <p style={styles.leadText}>
                        Boostez votre business, découvrez les tendances du marché local et maîtrisez toutes les stratégies pour cartonner sur votre micro-boutique.
                    </p>
                </section>

                {/* ================= GRILLE DES ARTICLES ================= */}
                <section style={styles.articlesGrid}>
                    {articles.map((article) => (
                        <article key={article.id} style={styles.articleCard}>
                            {/* Icône / Visuel de catégorie */}
                            <div style={styles.iconContainer}>
                                {article.icon}
                            </div>

                            <div style={styles.cardContent}>
                                {/* Tag de catégorie */}
                                <span style={styles.categoryTag}>{article.category}</span>

                                {/* Titre de l'article */}
                                <h3 style={styles.cardTitle}>{article.title}</h3>

                                {/* Extrait du texte */}
                                <p style={styles.cardExcerpt}>{article.excerpt}</p>

                                {/* Métadonnées du bas (Date & Temps de lecture) */}
                                <div style={styles.cardMeta}>
                                    <span style={styles.metaText}>📅 {article.date}</span>
                                    <span style={styles.metaDivider}>•</span>
                                    <span style={styles.metaText}>⏱️ {article.readTime}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* ================= NEWSLETTER (BONUS DESIGN) ================= */}
                <section style={styles.newsletterSection}>
                    <h3 style={styles.newsletterTitle}>Ne manquez aucun conseil commercial</h3>
                    <p style={styles.newsletterSubtitle}>Inscrivez-vous pour recevoir directement nos meilleures stratégies de vente.</p>
                    <div style={styles.inputGroup}>
                        <input type="email" placeholder="Votre adresse email..." style={styles.emailInput} />
                        <button style={styles.subscribeBtn}>S'abonner</button>
                    </div>
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
   DESIGN SYSTEM & STYLES (BLOG PAGE)
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
        maxWidth: "900px",
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
        fontSize: "17px",
        lineHeight: "1.6",
        color: "#64748b",
        maxWidth: "680px",
        margin: "0 auto"
    },
    articlesGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        marginBottom: "60px"
    },
    articleCard: {
        background: "#ffffff",
        padding: "28px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer"
    },
    iconContainer: {
        width: "56px",
        height: "56px",
        background: "#f1f5f9",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        flexShrink: 0
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    },
    categoryTag: {
        alignSelf: "flex-start",
        fontSize: "11px",
        fontWeight: "700",
        color: "#4f46e5",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        background: "#eff6ff",
        padding: "4px 10px",
        borderRadius: "6px",
        marginBottom: "12px"
    },
    cardTitle: {
        fontSize: "19px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 8px 0",
        lineHeight: "1.4"
    },
    cardExcerpt: {
        fontSize: "14.5px",
        lineHeight: "1.6",
        color: "#475569",
        margin: "0 0 16px 0"
    },
    cardMeta: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    metaText: {
        fontSize: "12px",
        fontWeight: "500",
        color: "#94a3b8"
    },
    metaDivider: {
        color: "#cbd5e1",
        fontSize: "12px"
    },
    newsletterSection: {
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        padding: "40px",
        borderRadius: "20px",
        textAlign: "center",
        color: "#ffffff"
    },
    newsletterTitle: {
        fontSize: "22px",
        fontWeight: "800",
        margin: "0 0 8px 0"
    },
    newsletterSubtitle: {
        fontSize: "14.5px",
        color: "#94a3b8",
        margin: "0 0 24px 0"
    },
    inputGroup: {
        display: "flex",
        maxWidth: "480px",
        margin: "0 auto",
        gap: "10px"
    },
    emailInput: {
        flexGrow: 1,
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #334155",
        background: "#1e293b",
        color: "#ffffff",
        fontSize: "14px",
        outline: "none"
    },
    subscribeBtn: {
        background: "#4f46e5",
        color: "#ffffff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
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