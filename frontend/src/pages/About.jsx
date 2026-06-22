import React from "react";

export default function About() {
    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>

                {/* ================= EN-TÊTE PRINCIPAL ================= */}
                <section style={styles.heroSection}>
                    <span style={styles.badge}>Qui sommes-nous ?</span>
                    <h1 style={styles.mainTitle}>
                        Propulser le commerce de proximité dans <span style={styles.gradientText}>l'ère digitale</span>
                    </h1>
                    <p style={styles.leadText}>
                        <p style={{ ...styles.leadText, marginTop: "10px", fontWeight: "500" }}>
                            Achat, vente, livraison et gestion simplifiée — tout dans une seule application mobile et web.
                        </p>
                        ViteVendu est une plateforme digitale nouvelle génération conçue pour briser les barrières du e-commerce traditionnel et dynamiser l'économie locale en Afrique.
                    </p>
                </section>

                {/* ================= NOTRE HISTOIRE / MANIFESTE ================= */}
                <section style={styles.textSection}>
                    <p style={styles.paragraph}>
                        L'aventure <strong>ViteVendu</strong> naît d'un constat simple : des milliers de commerçants, artisans et entrepreneurs locaux débordent d'énergie et de produits exceptionnels, mais manquent d'outils adaptés, simples et abordables pour toucher leurs clients en ligne. Les marketplaces traditionnelles imposent souvent des commissions lourdes ou des configurations techniques complexes.
                    </p>
                    <p style={styles.paragraph}>
                        C'est pourquoi nous avons créé une alternative fluide. Une solution axée sur l'immédiateté, la transparence et le contact humain. Sur ViteVendu, un vendeur peut donner vie à sa micro-boutique en moins de deux minutes chrono, exposer ses articles en temps réel et interagir directement avec sa communauté sans aucun intermédiaire.
                    </p>
                </section>

                {/* ================= NOTRE MISSION & VALEURS ================= */}
                <section style={styles.gridSection}>
                    <div style={styles.valueCard}>
                        <div style={{ ...styles.iconWrapper, background: "#eef2ff", color: "#4f46e5" }}>🎯</div>
                        <h3 style={styles.cardTitle}>Notre Mission</h3>
                        <p style={styles.cardText}>
                            Digitaliser le commerce de proximité en Afrique en offrant à chaque entrepreneur une vitrine web performante, intuitive et instantanée pour développer ses revenus.
                        </p>
                    </div>

                    <div style={styles.valueCard}>
                        <div style={{ ...styles.iconWrapper, background: "#ecfdf5", color: "#10b981" }}>⚡</div>
                        <h3 style={styles.cardTitle}>Zéro Intermédiaire</h3>
                        <p style={styles.cardText}>
                            Nous croyons en un commerce plus juste et plus humain. Les acheteurs et les vendeurs négocient, discutent et concluent leurs transactions directement en direct.
                        </p>
                    </div>
                </section>


                {/* ================= PAIEMENTS & SÉCURITÉ ================= */}
                <section style={styles.textSection}>
                    <h3 style={styles.cardTitle}>Paiements & Sécurité</h3>
                    <p style={styles.paragraph}>
                        ViteVendu assure des échanges sécurisés entre acheteurs et vendeurs.
                        Chaque transaction est protégée afin de limiter les fraudes et garantir la confiance.
                    </p>
                    <p style={styles.paragraph}>
                        Nous travaillons à intégrer des solutions de paiement mobile modernes adaptées à l’Afrique
                        (Mobile Money, cartes bancaires et paiements instantanés).
                    </p>
                </section>

                {/* ================= LIVRAISON ================= */}
                <section style={styles.textSection}>
                    <h3 style={styles.cardTitle}>Livraison & Logistique</h3>
                    <p style={styles.paragraph}>
                        Les vendeurs peuvent organiser leurs propres livraisons ou collaborer avec des partenaires locaux.
                    </p>
                    <p style={styles.paragraph}>
                        L’objectif est de réduire les délais et rapprocher les produits des clients le plus rapidement possible.
                    </p>
                </section>

                {/* ================= SUPPORT ================= */}
                <section style={styles.textSection}>
                    <h3 style={styles.cardTitle}>Support & Assistance</h3>
                    <p style={styles.paragraph}>
                        Notre équipe est disponible pour accompagner les utilisateurs dans l’utilisation de la plateforme.
                    </p>
                    <p style={styles.paragraph}>
                        ViteVendu vise une expérience simple, rapide et accessible même pour les débutants.
                    </p>
                </section>

                {/* ================= DIRECTION & FONDATEURS ================= */}
                <section style={styles.teamSection}>
                    <h2 style={styles.sectionTitle}>L'équipe dirigeante</h2>
                    <p style={styles.sectionSubtitle}>
                        Les esprits passionnés qui guident la vision de ViteVendu.
                    </p>

                    <div style={styles.teamGrid}>
                        {/* Membre 1 - TOI */}
                        <div style={styles.teamCard}>
                            <div style={styles.avatarZone}>👑</div>
                            <div style={styles.teamInfo}>
                                <h4 style={styles.memberName}>Yelo Joel</h4>
                                <span style={styles.memberRole}>Fondateur & CEO</span>
                                <p style={styles.memberBio}>
                                    Fondateur de ViteVendu, il définit la vision globale du projet et supervise le développement stratégique de la plateforme.
                                </p>
                            </div>
                        </div>

                        {/* Membre 2 - GRAND FRÈRE */}
                        <div style={styles.teamCard}>
                            <div style={styles.avatarZone}>🧠</div>
                            <div style={styles.teamInfo}>
                                <h4 style={styles.memberName}>Yelo Ruben</h4>
                                <span style={styles.memberRole}>Conseiller principal & Mentor stratégique</span>
                                <p style={styles.memberBio}>
                                    Il accompagne la vision de ViteVendu en apportant son expérience, ses conseils stratégiques et son expertise pour guider les décisions importantes du projet.
                                </p>
                            </div>
                        </div>

                        {/* Membre 3 - CO-FONDATEUR */}
                        <div style={styles.teamCard}>
                            <div style={styles.avatarZone}>🤝</div>
                            <div style={styles.teamInfo}>
                                <h4 style={styles.memberName}>Yelo Zakiro</h4>
                                <span style={styles.memberRole}>Co-fondateur & Conseiller stratégique</span>
                                <p style={styles.memberBio}>
                                    Il participe au développement du projet en apportant des idées stratégiques et en accompagnant la vision globale de ViteVendu.
                                </p>
                            </div>
                        </div>

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
   DESIGN SYSTEM & STYLES (ABOUT PAGE)
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
        marginBottom: "48px"
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
        fontSize: "18px",
        lineHeight: "1.6",
        color: "#64748b",
        maxWidth: "720px",
        margin: "0 auto"
    },
    textSection: {
        background: "#ffffff",
        padding: "32px 40px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        marginBottom: "32px"
    },
    paragraph: {
        fontSize: "15.5px",
        lineHeight: "1.75",
        color: "#334155",
        margin: "0 0 16px 0",
        textAlign: "justify"
    },
    gridSection: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "24px",
        marginBottom: "56px"
    },
    valueCard: {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0"
    },
    iconWrapper: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        marginBottom: "16px"
    },
    cardTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 10px 0"
    },
    cardText: {
        fontSize: "14.5px",
        lineHeight: "1.6",
        color: "#64748b",
        margin: 0
    },
    teamSection: {
        marginTop: "40px"
    },
    sectionTitle: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a",
        textAlign: "center",
        margin: "0 0 6px 0"
    },
    sectionSubtitle: {
        fontSize: "14.5px",
        color: "#64748b",
        textAlign: "center",
        margin: "0 0 32px 0"
    },
    teamGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "24px"
    },
    teamCard: {
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "20px",
        alignItems: "flex-start"
    },
    avatarZone: {
        width: "56px",
        height: "56px",
        background: "#f1f5f9",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        flexShrink: 0
    },
    teamInfo: {
        display: "flex",
        flexDirection: "column"
    },
    memberName: {
        fontSize: "16.5px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 2px 0"
    },
    memberRole: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#4f46e5",
        marginBottom: "10px"
    },
    memberBio: {
        fontSize: "13.5px",
        lineHeight: "1.5",
        color: "#475569",
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