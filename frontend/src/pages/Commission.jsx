import { useNavigate } from "react-router-dom";

export default function Commission() {
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
                    💰 Commission ViteVendu
                </h1>
                <p style={styles.subtitle}>
                    Transparence, simplicité et aucun abonnement.
                </p>
            </div>

            {/* INTRO */}
            <div style={styles.card}>
                <h2 style={styles.heading}>Pourquoi une commission ?</h2>
                <p style={styles.text}>
                    ViteVendu est une plateforme qui met en relation des vendeurs et des acheteurs
                    partout en Côte d'Ivoire.
                </p>
                <p style={styles.text}>
                    Afin de maintenir une plateforme fiable, rapide et sécurisée, une commission
                    est appliquée uniquement lorsqu'une vente est réalisée avec succès.
                </p>
                <p style={styles.text}>
                    Cette commission permet d'assurer le développement continu de ViteVendu
                    et d'offrir un meilleur service à tous les utilisateurs.
                </p>
            </div>

            {/* PROMOMINENT HIGHLIGHT BADGE */}
            <div style={styles.highlight}>
                <div style={styles.highlightBadge}>TARIF UNIQUE</div>
                <div style={styles.highlightText}>
                    1 000 FCFA <span style={{ fontWeight: 'normal', fontSize: '18px' }}>par vente réalisée</span>
                </div>
            </div>

            {/* COMMENT ÇA FONCTIONNE */}
            <div style={styles.card}>
                <h2 style={styles.heading}>
                    📌 Comment fonctionne la commission ?
                </h2>
                <p style={styles.text}>
                    Toutes les annonces publiées sur ViteVendu sont gratuites.
                    Aucun abonnement mensuel et aucun frais d'inscription ne sont demandés.
                </p>
                <p style={styles.text}>
                    En revanche, lorsqu'un vendeur réalise une vente grâce à
                    ViteVendu, il s'engage à verser une commission fixe de
                    <strong> 1 000 FCFA</strong>.
                </p>
                <p style={styles.text}>
                    Pour le moment, cette commission n'est pas prélevée
                    automatiquement.
                    Le vendeur effectue lui-même le paiement après la confirmation
                    de la vente.
                </p>
                <p style={styles.text}>
                    Ce fonctionnement est temporaire. Une future version de
                    ViteVendu intégrera un système de paiement automatique afin
                    de simplifier les transactions.
                </p>
            </div>

            {/* EXEMPLES AVEC TABLEAU DESIGN */}
            <div style={styles.card}>
                <h2 style={styles.heading}>Exemples de gains</h2>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Prix de vente</th>
                                <th style={styles.th}>Commission</th>
                                <th style={styles.thHighlight}>Vous recevez</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={styles.tr}>
                                <td style={styles.td}>10 000 FCFA</td>
                                <td style={styles.tdComm}>1 000 FCFA</td>
                                <td style={styles.tdTotal}>9 000 FCFA</td>
                            </tr>
                            <tr style={styles.tr}>
                                <td style={styles.td}>25 000 FCFA</td>
                                <td style={styles.tdComm}>1 000 FCFA</td>
                                <td style={styles.tdTotal}>24 000 FCFA</td>
                            </tr>
                            <tr style={styles.tr}>
                                <td style={styles.td}>50 000 FCFA</td>
                                <td style={styles.tdComm}>1 000 FCFA</td>
                                <td style={styles.tdTotal}>49 000 FCFA</td>
                            </tr>
                            <tr style={styles.tr}>
                                <td style={styles.td}>100 000 FCFA</td>
                                <td style={styles.tdComm}>1 000 FCFA</td>
                                <td style={styles.tdTotal}>99 000 FCFA</td>
                            </tr>
                            <tr style={styles.tr}>
                                <td style={styles.tdLast}>300 000 FCFA</td>
                                <td style={styles.tdCommLast}>1 000 FCFA</td>
                                <td style={styles.tdTotalLast}>299 000 FCFA</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAIEMENT ENCADRÉ PREMIUM (WAVE & ORANGE) */}
            <div style={styles.cardPayment}>
                <h2 style={styles.headingPayment}>
                    💳 Paiement de la commission
                </h2>
                <p style={styles.textPaymentIntro}>
                    Après chaque vente réalisée et confirmée, le vendeur doit
                    envoyer sa commission de 1 000 FCFA via l'un des canaux suivants :
                </p>

                {/* GRILLE DES DEUX MOYENS DE PAIEMENT */}
                <div style={styles.paymentMethodsGrid}>

                    {/* ENCADRÉ WAVE */}
                    <div style={styles.paymentBoxWave}>
                        <div style={styles.waveHeader}>
                            <span style={styles.waveLogo}>💚</span>
                            <span style={styles.waveName}>Wave</span>
                        </div>
                        <div style={styles.paymentNumberContainer}>
                            <span style={styles.numberLabel}>Numéro de transfert :</span>
                            <h2 style={styles.paymentNumber}>+225 07 48 92 23 97</h2>
                        </div>
                    </div>

                    {/* ENCADRÉ ORANGE MONEY */}
                    <div style={styles.paymentBoxOrange}>
                        <div style={styles.orangeHeader}>
                            <span style={styles.orangeLogo}>🟧</span>
                            <span style={styles.orangeName}>Orange Money</span>
                        </div>
                        <div style={styles.paymentNumberContainer}>
                            <span style={styles.numberLabel}>Numéro de transfert :</span>
                            <h2 style={styles.paymentNumber}>+225 07 48 92 23 97</h2>
                        </div>
                    </div>

                </div>

                {/* DETAILS DE PAIEMENT COMMUNS */}
                <div style={styles.paymentGlobalInfo}>
                    <div style={styles.paymentInfoRow}>
                        <span>Montant à envoyer :</span>
                        <strong style={styles.paymentAmount}>1 000 FCFA</strong>
                    </div>

                    <p style={styles.paymentWarning}>
                        💡 <strong>Important :</strong> Merci de conserver votre reçu Wave ou Orange Money après le paiement.
                        Celui-ci pourra être demandé en cas de vérification.
                    </p>
                </div>
            </div>

            {/* AVANTAGES */}
            <div style={styles.card}>
                <h2 style={styles.heading}>Pourquoi choisir une commission fixe ?</h2>
                <div style={styles.gridContainer}>
                    <div style={styles.gridItem}>✅ Aucun abonnement mensuel</div>
                    <div style={styles.gridItem}>✅ Aucun frais d'inscription</div>
                    <div style={styles.gridItem}>✅ Aucun coût caché</div>
                    <div style={styles.gridItem}>✅ Payez uniquement quand vous vendez</div>
                    <div style={styles.gridItem}>✅ Simple et facile à comprendre</div>
                    <div style={styles.gridItem}>✅ Gardez la quasi-totalité de vos revenus</div>
                </div>
            </div>

            {/* UTILISATION & ENGAGEMENT */}
            <div style={styles.card}>
                <h2 style={styles.heading}>À quoi sert cette commission ?</h2>

                <ul style={styles.list}>
                    <li style={styles.listItem}>🚀 Développement de nouvelles fonctionnalités.</li>
                    <li style={styles.listItem}>🔒 Sécurité des comptes et des transactions.</li>
                    <li style={styles.listItem}>☁️ Hébergement des serveurs.</li>
                    <li style={styles.listItem}>📦 Maintenance de la plateforme.</li>
                    <li style={styles.listItem}>📞 Assistance aux utilisateurs.</li>
                    <li style={styles.listItem}>📈 Amélioration continue de ViteVendu.</li>
                </ul>

                <div style={styles.innerCard}>
                    <h3 style={styles.innerHeading}>📜 Engagement du vendeur</h3>
                    <p style={styles.textInner}>
                        En utilisant ViteVendu, chaque vendeur accepte les conditions de fonctionnement de la plateforme.
                    </p>
                    <p style={styles.textInner}>
                        Après chaque vente réalisée grâce à ViteVendu, le vendeur s'engage à régler la commission fixe de 1 000 FCFA. Cette participation permet à ViteVendu de continuer son développement et d'améliorer continuellement les services proposés.
                    </p>
                </div>
            </div>

            {/* FAQ STYLE ACCORDÉON COMPACT */}
            <div style={styles.card}>
                <h2 style={styles.heading}>❓ Questions fréquentes</h2>

                <div style={styles.faqBlock}>
                    <p style={styles.question}>Quand dois-je payer la commission ?</p>
                    <p style={styles.answer}>La commission est payable uniquement après une vente réalisée et confirmée. Aucun paiement n'est demandé avant une vente.</p>
                </div>

                <div style={styles.faqBlock}>
                    <p style={styles.question}>Comment payer la commission ?</p>
                    <p style={styles.answer}>Pour le moment, le paiement s'effectue manuellement via Wave ou Orange Money.</p>

                    <div style={styles.faqMultiBox}>
                        <div style={{ fontWeight: 'bold', color: '#0f172a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div>💚 Wave : <strong>+225 07 48 92 23 97</strong></div>
                            <div>🟧 Orange : <strong>+225 07 48 92 23 97</strong></div>
                        </div>
                        <div style={{ fontSize: '14px', marginTop: '8px', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                            Montant : <strong>1 000 FCFA</strong> par vente réalisée.
                        </div>
                    </div>
                </div>

                <div style={styles.faqBlock}>
                    <p style={styles.question}>Dois-je payer chaque mois ?</p>
                    <p style={styles.answer}>Non. ViteVendu ne demande aucun abonnement mensuel. Vous ne payez une commission que lorsque vous réalisez une vente.</p>
                </div>

                <div style={styles.faqBlock}>
                    <p style={styles.question}>Puis-je publier gratuitement mes annonces ?</p>
                    <p style={styles.answer}>Oui. La publication de vos annonces est entièrement gratuite.</p>
                </div>

                <div style={styles.faqBlock}>
                    <p style={styles.question}>La commission change-t-elle selon le prix du produit ?</p>
                    <p style={styles.answer}>Non. Que votre produit coûte 10 000 FCFA ou 300 000 FCFA, la commission reste toujours fixée à 1 000 FCFA.</p>
                </div>

                <div style={styles.faqBlock}>
                    <p style={styles.question}>Pourquoi la commission n'est-elle pas prélevée automatiquement ?</p>
                    <p style={styles.answer}>Nous travaillons actuellement sur un système de paiement automatique qui sera disponible dans une prochaine version de ViteVendu. En attendant, le paiement est effectué directement par le vendeur après chaque vente confirmée.</p>
                </div>

                <div style={styles.faqBlockLast}>
                    <p style={styles.question}>Que se passe-t-il si je ne paie pas la commission ?</p>
                    <p style={styles.answer}>Le paiement de la commission fait partie des conditions d'utilisation de ViteVendu. En cas de non-paiement volontaire ou répété, la plateforme pourra suspendre temporairement ou définitivement le compte vendeur.</p>
                </div>
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
                ❤️ Merci de faire confiance à ViteVendu.
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
        margin: 0
    },

    card: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        border: "1px solid #f1f5f9"
    },

    cardPayment: {
        background: "linear-gradient(145deg, #ffffff 0%, #f7fee7 100%)",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.04)",
        border: "1px solid #f0fdf4"
    },

    heading: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "16px",
        color: "#0f172a"
    },

    headingPayment: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "12px",
        color: "#0f172a"
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
        marginBottom: "20px"
    },

    highlight: {
        background: "#026824",
        color: "#ffffff",
        padding: "24px",
        borderRadius: "20px",
        textAlign: "center",
        marginBottom: "24px",
        boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px"
    },

    highlightBadge: {
        background: "rgba(255, 255, 255, 0.15)",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "bold",
        letterSpacing: "1px"
    },

    highlightText: {
        fontSize: "28px",
        fontWeight: "800"
    },

    tableWrapper: {
        overflowX: "auto",
        borderRadius: "14px",
        border: "1px solid #e2e8f0"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        fontSize: "15px"
    },

    th: {
        background: "#f8fafc",
        padding: "14px 18px",
        fontWeight: "600",
        color: "#64748b",
        borderBottom: "1px solid #e2e8f0"
    },

    thHighlight: {
        background: "#f0fdf4",
        padding: "14px 18px",
        fontWeight: "700",
        color: "#166534",
        borderBottom: "1px solid #e2e8f0"
    },

    tr: {
        borderBottom: "1px solid #f1f5f9"
    },

    td: {
        padding: "14px 18px",
        color: "#334155"
    },

    tdComm: {
        padding: "14px 18px",
        color: "#64748b"
    },

    tdTotal: {
        padding: "14px 18px",
        fontWeight: "600",
        color: "#0f172a",
        background: "#f8fafc"
    },

    tdLast: {
        padding: "14px 18px",
        color: "#334155",
        borderBottom: "none"
    },

    tdCommLast: {
        padding: "14px 18px",
        color: "#64748b",
        borderBottom: "none"
    },

    tdTotalLast: {
        padding: "14px 18px",
        fontWeight: "700",
        color: "#0f172a",
        background: "#f8fafc",
        borderBottom: "none"
    },

    paymentMethodsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
    },

    paymentBoxWave: {
        background: "#ffffff",
        border: "1px solid #bbf7d0",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.01)"
    },

    paymentBoxOrange: {
        background: "#ffffff",
        border: "1px solid #fed7aa",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.01)"
    },

    waveHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "14px"
    },

    orangeHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "14px"
    },

    waveLogo: { fontSize: "20px" },
    waveName: { fontSize: "18px", fontWeight: "700", color: "#166534" },

    orangeLogo: { fontSize: "20px" },
    orangeName: { fontSize: "18px", fontWeight: "700", color: "#c2410c" },

    paymentNumberContainer: {
        background: "#f8fafc",
        padding: "10px 14px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
    },

    numberLabel: {
        fontSize: "12px",
        color: "#64748b",
        display: "block",
        marginBottom: "4px"
    },

    paymentNumber: {
        margin: 0,
        fontSize: "19px",
        color: "#0f172a",
        fontFamily: "monospace",
        fontWeight: "700"
    },

    paymentGlobalInfo: {
        background: "#ffffff",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0"
    },

    paymentInfoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "14px",
        fontSize: "15px"
    },

    paymentAmount: {
        fontSize: "18px",
        color: "#0f172a"
    },

    paymentWarning: {
        margin: 0,
        fontSize: "13px",
        color: "#64748b",
        lineHeight: "1.5",
        background: "#f8fafc",
        padding: "12px",
        borderRadius: "10px"
    },

    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "12px",
        marginTop: "10px"
    },

    gridItem: {
        background: "#f8fafc",
        padding: "12px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#334155",
        border: "1px solid #f1f5f9"
    },

    list: {
        listStyle: "none",
        padding: 0,
        margin: "0 0 20px 0"
    },

    listItem: {
        fontSize: "15px",
        color: "#475569",
        marginBottom: "10px",
        lineHeight: "1.5"
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
        fontSize: "16px",
        color: "#0f172a",
        fontWeight: "700"
    },

    textInner: {
        fontSize: "14px",
        color: "#64748b",
        lineHeight: "1.6",
        margin: "0 0 10px 0"
    },

    faqBlock: {
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: "16px",
        marginBottom: "16px"
    },

    faqBlockLast: {
        paddingBottom: 0,
        marginBottom: 0
    },

    question: {
        fontWeight: "600",
        fontSize: "15px",
        color: "#0f172a",
        margin: "0 0 8px 0"
    },

    answer: {
        color: "#475569",
        fontSize: "14px",
        lineHeight: "1.6",
        margin: 0
    },

    faqMultiBox: {
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "12px 16px",
        marginTop: "10px",
        display: "inline-block",
        minWidth: "260px"
    },

    footer: {
        textAlign: "center",
        marginTop: "30px",
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: "600"
    }
};