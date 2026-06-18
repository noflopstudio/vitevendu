import React from "react";

export default function Conditions() {
    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentWrapper}>

                {/* ================= HEADER ================= */}
                <header style={styles.hero}>
                    <h1 style={styles.title}>
                        <span style={{ color: "#111827" }}>Conditions </span>
                        <span style={{ color: "#4f46e5" }}>d’utilisation</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Mise à jour : {new Date().getFullYear()} — Version 1.2
                    </p>
                    <div style={styles.divider}></div>
                </header>

                {/* ================= TIMELINE CONTAINER ================= */}
                <div style={styles.timeline}>

                    {/* 1. ACCEPTATION */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>01</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Acceptation des conditions</h2>
                            <p style={styles.text}>
                                En accédant et en utilisant la plateforme <b>ViteVendu</b>, vous acceptez pleinement et sans réserve
                                les présentes conditions d’utilisation. Si vous n’acceptez pas ces conditions, vous devez cesser
                                immédiatement d’utiliser le service.
                            </p>
                        </div>
                    </div>

                    {/* 2. UTILISATION */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>02</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Utilisation de la plateforme</h2>
                            <p style={styles.text}>
                                ViteVendu est une plateforme de mise en relation entre vendeurs et acheteurs. Vous vous engagez à utiliser
                                le service uniquement à des fins légales, honnêtes et conformes aux lois en vigueur en Côte d’Ivoire.
                            </p>
                        </div>
                    </div>

                    {/* 3. CONTENU */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>03</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Contenu des annonces</h2>
                            <p style={styles.text}>
                                Tous les utilisateurs sont responsables du contenu qu’ils publient. Les annonces doivent impérativement être :
                            </p>
                            <div style={styles.tagContainer}>
                                <span style={styles.tagPositive}>✓ Exactes &amp; véridiques</span>
                                <span style={styles.tagPositive}>✓ Sans contenu trompeur</span>
                                <span style={styles.tagPositive}>✓ Conformes aux lois locales</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. INTERDITS */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumberDanger}>04</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Activités strictement interdites</h2>
                            <p style={styles.text}>
                                Tout manquement entraînera une suppression immédiate. Sont proscrits :
                            </p>
                            <div style={styles.tagContainer}>
                                <span style={styles.tagNegative}>✕ Faux trafic</span>
                                <span style={styles.tagNegative}>✕ Spam / Pub</span>
                                <span style={styles.tagNegative}>✕ Usurpation</span>
                                <span style={styles.tagNegative}>✕ Fraude / Arnaque</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. COMPTE */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>05</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Comptes utilisateurs</h2>
                            <p style={styles.text}>
                                Chaque utilisateur est responsable de la confidentialité de ses identifiants.
                                ViteVendu ne peut être tenu responsable en cas d’utilisation frauduleuse de votre compte.
                            </p>
                        </div>
                    </div>

                    {/* 6. RESPONSABILITÉ */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>06</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Responsabilité</h2>
                            <p style={styles.text}>
                                ViteVendu acts as a technical intermediary and does not guarantee transactions between users.
                                Chaque transaction est effectuée sous la responsabilité des parties concernées.
                            </p>
                        </div>
                    </div>

                    {/* 7. SUSPENSION */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>07</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Suspension de compte</h2>
                            <p style={styles.text}>
                                Nous nous réservons le droit de suspendre ou supprimer un compte en cas de non-respect des présentes conditions
                                sans préavis.
                            </p>
                        </div>
                    </div>

                    {/* 8. MODIFICATIONS */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumber}>08</div>
                            <div style={styles.verticalLine}></div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Modifications</h2>
                            <p style={styles.text}>
                                ViteVendu peut modifier ces conditions à tout moment. Les utilisateurs seront informés en cas de changement important.
                            </p>
                        </div>
                    </div>

                    {/* 9. CONTACT */}
                    <div style={styles.timelineItem}>
                        <div style={styles.timelineLeft}>
                            <div style={styles.stepNumberFinal}>09</div>
                        </div>
                        <div style={styles.timelineRight}>
                            <h2 style={styles.h2}>Contact &amp; Support</h2>
                            <p style={styles.text}>
                                Pour toute question concernant ces conditions, vous pouvez nous contacter via WhatsApp ou notre adresse email dédiée.
                            </p>
                        </div>
                    </div>

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
        </div>
    );
}

/* ================= STYLES ALTERNATIFS REPARAMÉTRÉS ================= */
const styles = {
    pageContainer: {
        background: "#fafafa",
        minHeight: "100vh",
        padding: "80px 20px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        display: "flex",
        justifyContent: "center"
    },
    contentWrapper: {
        maxWidth: "760px",
        width: "100%",
        background: "#ffffff",
        padding: "40px"
    },
    hero: {
        marginBottom: "60px",
        textAlign: "center" // Centrage pour s'aligner harmonieusement avec le footer
    },
    title: {
        fontSize: "40px",
        fontWeight: "800",
        letterSpacing: "-0.04em",
        margin: "0 0 10px 0"
    },
    subtitle: {
        fontSize: "14px",
        color: "#666666",
        margin: 0
    },
    divider: {
        width: "60px",
        height: "4px",
        backgroundImage: "linear-gradient(90deg, #111827 0%, #4f46e5 50%, #065f46 100%)",
        marginTop: "25px",
        borderRadius: "2px",
        marginLeft: "auto",
        marginRight: "auto" // Centre également le petit trait dégradé
    },
    timeline: {
        display: "flex",
        flexDirection: "column"
    },
    timelineItem: {
        display: "flex",
        gap: "24px"
    },
    timelineLeft: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "40px"
    },
    stepNumber: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#4f46e5",
        background: "#eff6ff",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
    },
    stepNumberDanger: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#dc2626",
        background: "#fef2f2",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
    },
    stepNumberFinal: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#065f46",
        background: "#ecfdf5",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%"
    },
    verticalLine: {
        width: "2px",
        flexGrow: 1,
        backgroundImage: "linear-gradient(180deg, #e5e7eb 0%, #cbd5e1 100%)",
        margin: "8px 0"
    },
    timelineRight: {
        paddingBottom: "45px",
        flex1: 1
    },
    h2: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#111111",
        margin: "4px 0 12px 0",
        letterSpacing: "-0.02em"
    },
    text: {
        fontSize: "15px",
        lineHeight: "1.65",
        color: "#444444",
        margin: 0
    },
    tagContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "14px"
    },
    tagPositive: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#065f46",
        background: "#e6f4ea",
        padding: "4px 12px",
        borderRadius: "6px"
    },
    tagNegative: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#b91c1c",
        background: "#fef2f2",
        padding: "4px 12px",
        borderRadius: "6px"
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