import React from "react";

export default function Partner() {

    const whatsappNumber = "2250748922397";

    const partnerInfo = {
        platform: "ViteVendu",
        status: "Programme Partenaire Officiel",
        country: "Côte d'Ivoire",
        contact: "WhatsApp disponible 24h/24"
    };

    const benefits = [
        { title: "Visibilité Décuplée", desc: "Exposez votre marque au cœur d’un écosystème commercial dynamique.", icon: "👁️" },
        { title: "Audience Qualifiée", desc: "Touchez des marchands et acheteurs actifs prêts à acheter.", icon: "🎯" },
        { title: "Ventes Accélérées", desc: "Augmentez vos ventes grâce à la mise en relation directe.", icon: "⚡" },
        { title: "Suivi Privilégié", desc: "Bénéficiez d’un accompagnement personnalisé.", icon: "🤝" }
    ];

    const types = [
        { label: "Boutiques & Commerçants", desc: "Digitalisation de produits et stocks physiques." },
        { label: "Influenceurs", desc: "Monétisation via visibilité et affiliation future." },
        { label: "Marques", desc: "Campagnes marketing ciblées et performantes." },
        { label: "Startups", desc: "Partenariats technologiques et business." }
    ];

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>

                {/* ===== HERO ===== */}
                <section style={styles.heroSection}>
                    <span style={styles.badge}>🚀 Opportunités Business</span>

                    <h1 style={styles.mainTitle}>
                        Construisons ensemble le commerce de <span style={styles.gradientText}>demain</span>
                    </h1>

                    <p style={styles.leadText}>
                        Chez <strong>ViteVendu</strong>, nous connectons vendeurs, marques et partenaires pour créer un écosystème de commerce digital puissant en Côte d’Ivoire.
                    </p>

                    {/* INFO OFFICIELLE */}
                    <div style={{
                        marginTop: "20px",
                        padding: "12px",
                        background: "#f1f5f9",
                        borderRadius: "10px",
                        fontSize: "14px",
                        color: "#334155"
                    }}>
                        <strong>{partnerInfo.status}</strong> • {partnerInfo.country} • {partnerInfo.contact}
                    </div>
                </section>

                {/* ===== BENEFITS ===== */}
                <section style={styles.sectionArea}>
                    <h2 style={styles.sectionTitle}>🚀 Pourquoi devenir partenaire ?</h2>

                    <div style={styles.gridContainer}>
                        {benefits.map((b, i) => (
                            <div key={i} style={styles.infoCard}>
                                <div style={styles.iconBox}>{b.icon}</div>
                                <h3 style={styles.cardTitle}>{b.title}</h3>
                                <p style={styles.cardText}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== TYPES ===== */}
                <section style={styles.sectionArea}>
                    <h2 style={styles.sectionTitle}>📦 Qui peut rejoindre ?</h2>
                    <p style={styles.sectionSubtitle}>
                        Tous les profils business peuvent collaborer avec nous.
                    </p>

                    <div style={styles.listContainer}>
                        {types.map((t, i) => (
                            <div key={i} style={styles.listItem}>
                                <div style={styles.bulletDot} />
                                <div>
                                    <h4 style={styles.listLabel}>{t.label}</h4>
                                    <p style={styles.listDesc}>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== CONDITIONS ===== */}
                <section style={styles.sectionArea}>
                    <h2 style={styles.sectionTitle}>📜 Conditions de partenariat</h2>

                    <div style={styles.listContainer}>

                        <div style={styles.listItem}>
                            <div style={styles.bulletDot} />
                            <div>
                                <h4 style={styles.listLabel}>Engagement sérieux</h4>
                                <p style={styles.listDesc}>
                                    Nous travaillons avec des partenaires actifs et professionnels.
                                </p>
                            </div>
                        </div>

                        <div style={styles.listItem}>
                            <div style={styles.bulletDot} />
                            <div>
                                <h4 style={styles.listLabel}>Croissance mutuelle</h4>
                                <p style={styles.listDesc}>
                                    Objectif : faire grandir les deux parties ensemble.
                                </p>
                            </div>
                        </div>

                        <div style={styles.listItem}>
                            <div style={styles.bulletDot} />
                            <div>
                                <h4 style={styles.listLabel}>Évolution vers l’affiliation</h4>
                                <p style={styles.listDesc}>
                                    Les partenaires actifs auront accès à un système de commission.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* ===== CTA ===== */}
                <section style={styles.ctaCard}>
                    <div style={styles.ctaHeader}>
                        <span style={styles.onlineBadge}>🟢 En ligne</span>
                        <h3 style={styles.ctaTitle}>💬 Contact Direct</h3>
                    </div>

                    <p style={styles.ctaText}>
                        Discutez directement avec notre équipe pour rejoindre le programme partenaire.
                    </p>

                    {/* MESSAGE PROPRE */}
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                            "Bonjour ViteVendu, je souhaite devenir partenaire."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.whatsappBtn}
                    >
                        📲 Ouvrir WhatsApp
                    </a>

                    <p style={styles.footerNote}>
                        Réponse rapide sous 24h ⚡
                    </p>
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
   DESIGN SYSTEM & STYLES (PARTNER PAGE)
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
        lineHeight: "1.65",
        color: "#64748b",
        maxWidth: "750px",
        margin: "0 auto"
    },
    sectionArea: {
        marginBottom: "48px"
    },
    sectionTitle: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "24px"
    },
    sectionSubtitle: {
        fontSize: "15px",
        color: "#64748b",
        marginTop: "-16px",
        marginBottom: "24px"
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px"
    },
    infoCard: {
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column"
    },
    iconBox: {
        width: "40px",
        height: "40px",
        background: "#f1f5f9",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        marginBottom: "14px"
    },
    cardTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 8px 0"
    },
    cardText: {
        fontSize: "13.5px",
        lineHeight: "1.5",
        color: "#64748b",
        margin: 0
    },
    listContainer: {
        background: "#ffffff",
        padding: "24px 32px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    listItem: {
        display: "flex",
        gap: "16px",
        alignItems: "flex-start"
    },
    bulletDot: {
        width: "8px",
        height: "8px",
        background: "#4f46e5",
        borderRadius: "50%",
        marginTop: "7px",
        flexShrink: 0
    },
    listLabel: {
        fontSize: "15.5px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 2px 0"
    },
    listDesc: {
        fontSize: "14px",
        color: "#475569",
        margin: 0
    },
    ctaCard: {
        background: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        border: "1px solid #bbf7d0",
        boxShadow: "0 10px 25px -5px rgba(22, 163, 74, 0.05)",
        textAlign: "center"
    },
    ctaHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "12px"
    },
    onlineBadge: {
        color: "#22c55e",
        fontSize: "12px",
        animation: "pulse 2s infinite" // Purement indicatif visuellement
    },
    ctaTitle: {
        fontSize: "20px",
        fontWeight: "800",
        color: "#0f172a",
        margin: 0
    },
    ctaText: {
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#475569",
        maxWidth: "600px",
        margin: "0 auto 24px auto"
    },
    whatsappBtn: {
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: "#25D366",
        color: "#ffffff",
        padding: "14px 28px",
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: "700",
        textDecoration: "none",
        boxShadow: "0 4px 14px rgba(37, 211, 102, 0.3)",
        transition: "all 0.2s ease"
    },
    footerNote: {
        fontSize: "12px",
        color: "#94a3b8",
        fontWeight: "500",
        marginTop: "20px",
        margin: 0
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