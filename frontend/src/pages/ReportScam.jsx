import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ReportScam() {
    const navigate = useNavigate();
    const [adId, setAdId] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [report, setReport] = useState(null);

    useEffect(() => {
        loadMyReports();
    }, []);

    const loadMyReports = async () => {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error && data.length > 0) {
            setReport(data[0]);
        }
    };

    // Actualisation automatique
    useEffect(() => {
        if (!report) return;

        const interval = setInterval(async () => {
            const { data } = await supabase
                .from("reports")
                .select("*")
                .eq("id", report.id)
                .single();

            if (data) {
                setReport(data);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [report]);

    // Envoyer un signalement
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Vous devez être connecté.");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("reports")
            .insert([
                {
                    user_id: user.id,
                    ad_id: adId,
                    type,
                    message,
                    status: "pending"
                }
            ])
            .select()
            .single();

        if (error) {
            console.log(error);
            setStatus("error");
        } else {
            setStatus("success");
            setReport(data);
            setAdId("");
            setType("");
            setMessage("");
            loadMyReports();
        }

        setLoading(false);
    };

    // Helper pour le badge de statut utilisateur
    const getStatusDetails = (status) => {
        switch (status) {
            case "resolved":
                return { label: "🟢 Résolu", bg: "#e6f4ea", color: "#137333" };
            case "in_review":
                return { label: "🟠 En cours d'analyse", bg: "#ffeece", color: "#b06000" };
            default:
                return { label: "🟡 En attente de traitement", bg: "#f0f4f8", color: "#475569" };
        }
    };

    return (
        <div style={styles.container}>
            {/* BOUTON RETOUR */}
            <div style={styles.headerNav}>
                <button style={styles.backButton} onClick={() => navigate(-1)}>
                    <span style={styles.backIcon}>←</span> Retour
                </button>
            </div>

            {/* HERO SECTION */}
            <div style={styles.heroSection}>
                <h1 style={styles.title}>🚨 Signaler une arnaque</h1>
                <p style={styles.subtitle}>
                    Aidez-nous à protéger la communauté en nous signalant tout comportement suspect.
                </p>
            </div>

            {/* BLOC PRINCIPAL DE CONTENU */}
            <div style={styles.mainGrid}>

                {/* FORMULAIRE */}
                <div style={styles.card}>
                    <h2 style={styles.heading}>Formulaire de signalement</h2>
                    <p style={styles.text}>
                        Toutes les informations envoyées seront analysées par notre équipe de modération sous 24h.
                    </p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Référence de l'annonce</label>
                            <input
                                style={styles.input}
                                placeholder="Ex: 4892397 (ou le numéro du produit)"
                                value={adId}
                                onChange={(e) => setAdId(e.target.value)}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Type de problème</label>
                            <select
                                style={styles.select}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez le motif...</option>
                                <option value="arnaque">Arnaque suspectée</option>
                                <option value="fake_product">Faux produit / Contrefaçon</option>
                                <option value="fake_seller">Faux vendeur / Profil suspect</option>
                                <option value="price_issue">Prix trompeur ou abusif</option>
                                <option value="other">Autre problème</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description détaillée</label>
                            <textarea
                                style={styles.textarea}
                                placeholder="Décrivez précisément la situation (comportement, demandes suspectes, etc.)..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <button style={styles.button} disabled={loading}>
                            {loading ? "Envoi en cours..." : "🔒 Envoyer le signalement sécurisé"}
                        </button>
                    </form>

                    {/* NOTIFICATIONS DE STATUT RECENT D'ENVOI */}
                    {status === "success" && (
                        <div style={styles.successCard}>
                            ✅ <strong>Signalement envoyé avec succès !</strong> Merci pour votre vigilance, notre équipe prend le relais.
                        </div>
                    )}

                    {status === "error" && (
                        <div style={styles.errorCard}>
                            ❌ <strong>Une erreur est survenue.</strong> Impossible d'envoyer le signalement. Veuillez vérifier votre connexion et réessayer.
                        </div>
                    )}
                </div>

                {/* SUIVI DE VOTRE SIGNALEMENT */}
                {report && (
                    <div style={styles.responseCard}>
                        <h3 style={styles.cardHeading}>📨 Statut de votre dernier signalement</h3>

                        <div style={styles.infoRow}>
                            <span style={styles.infoLabel}>Annonce concernée :</span>
                            <span style={styles.infoValue}>#{report.ad_id}</span>
                        </div>

                        <div style={{
                            ...styles.statusBadge,
                            background: getStatusDetails(report.status).bg,
                            color: getStatusDetails(report.status).color
                        }}>
                            {getStatusDetails(report.status).label}
                        </div>

                        <div style={styles.divider}></div>

                        <h4 style={styles.subHeading}>Réponse de l'équipe ViteVendu :</h4>
                        {report.admin_response ? (
                            <div style={styles.adminMessage}>
                                {report.admin_response}
                            </div>
                        ) : (
                            <p style={styles.waitingText}>
                                Notre équipe a bien reçu votre signalement. Nous l'étudions actuellement avec la plus grande attention.
                            </p>
                        )}
                    </div>
                )}

                {/* WHATSAPP CARD (PREUVES) */}
                <div style={styles.whatsappCard}>
                    <h3 style={{ ...styles.cardHeading, color: "#0f172a" }}>📎 Envoyer des preuves supplémentaires</h3>
                    <p style={styles.whatsappText}>
                        Si vous possédez des captures d'écran, des conversations, des reçus ou tout autre élément pouvant accélérer notre enquête, merci de nous les envoyer directement.
                    </p>
                    <p style={styles.whatsappTextHighlight}>
                        Plus vous fournissez de preuves, plus notre équipe pourra intervenir rapidement pour bloquer le fraudeur.
                    </p>
                    <a
                        href="https://wa.me/2250748922397"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.whatsappButton}
                    >
                        💬 Envoyer les preuves sur WhatsApp
                    </a>
                </div>

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
        maxWidth: 700,
        width: "100%",
        margin: "0 auto",
        padding: "20px",
        paddingTop: "30px",
        paddingBottom: "60px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#1e293b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    headerNav: {
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "20px"
    },

    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 18px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        background: "#ffffff",
        color: "#334155",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    },

    backIcon: {
        fontSize: "15px"
    },

    heroSection: {
        textAlign: "center",
        marginBottom: "35px"
    },

    title: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#0f172a",
        marginBottom: "10px",
        letterSpacing: "-0.5px"
    },

    subtitle: {
        color: "#64748b",
        fontSize: "15px",
        margin: 0,
        lineHeight: "1.6"
    },

    mainGrid: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "stretch"
    },

    card: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        border: "1px solid #f1f5f9"
    },

    heading: {
        fontSize: "20px",
        fontWeight: "700",
        marginBottom: "8px",
        color: "#0f172a"
    },

    cardHeading: {
        fontSize: "18px",
        fontWeight: "700",
        margin: "0 0 12px 0",
        color: "#1e293b"
    },

    subHeading: {
        fontSize: "14px",
        fontWeight: "700",
        margin: "0 0 8px 0",
        color: "#475569"
    },

    text: {
        lineHeight: "1.6",
        color: "#64748b",
        fontSize: "14px",
        margin: "0 0 24px 0"
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#334155"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        background: "#ffffff",
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.2s ease"
    },

    select: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        background: "#ffffff",
        outline: "none",
        fontFamily: "inherit",
        cursor: "pointer"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "14px",
        height: "110px",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        background: "#ffffff",
        outline: "none",
        resize: "none",
        fontFamily: "inherit",
        lineHeight: "1.6"
    },

    button: {
        width: "100%",
        padding: "14px",
        background: "#0f172a",
        color: "#ffffff",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px",
        marginTop: "5px",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
        transition: "opacity 0.2s ease"
    },

    responseCard: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.03)"
    },

    infoRow: {
        fontSize: "14px",
        marginBottom: "12px"
    },

    infoLabel: {
        color: "#64748b",
        marginRight: "6px"
    },

    infoValue: {
        fontWeight: "700",
        color: "#0f172a"
    },

    statusBadge: {
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "700",
        marginBottom: "16px"
    },

    divider: {
        height: "1px",
        background: "#f1f5f9",
        margin: "16px 0"
    },

    adminMessage: {
        background: "#f8fafc",
        borderLeft: "4px solid #0f172a",
        padding: "14px",
        borderRadius: "0 12px 12px 0",
        fontSize: "14px",
        color: "#334155",
        lineHeight: "1.6",
        fontWeight: "500"
    },

    waitingText: {
        margin: 0,
        fontSize: "14px",
        color: "#64748b",
        lineHeight: "1.5"
    },

    whatsappCard: {
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: "20px",
        padding: "24px"
    },

    whatsappText: {
        fontSize: "14px",
        lineHeight: "1.6",
        color: "#166534",
        margin: "0 0 10px 0"
    },

    whatsappTextHighlight: {
        fontSize: "13px",
        lineHeight: "1.5",
        color: "#15803d",
        fontWeight: "600",
        margin: "0 0 18px 0"
    },

    whatsappButton: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 20px",
        background: "#22c55e",
        color: "#ffffff",
        textDecoration: "none",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "14px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
        transition: "background 0.2s"
    },

    successCard: {
        background: "#ecfdf5",
        border: "1px solid #a7f3d0",
        borderRadius: "14px",
        padding: "14px",
        color: "#065f46",
        fontSize: "14px",
        lineHeight: "1.5",
        marginTop: "16px"
    },

    errorCard: {
        background: "#fef2f2",
        border: "1px solid #fca5a5",
        borderRadius: "14px",
        padding: "14px",
        color: "#991b1b",
        fontSize: "14px",
        lineHeight: "1.5",
        marginTop: "16px"
    },

    footer: {
        textAlign: "center",
        marginTop: "40px",
        color: "#94a3b8",
        fontSize: "13px",
        fontWeight: "600"
    },

    menu: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "20px"
    },

    menuItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: "14px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
    },

    menuItemLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },

    menuIcon: {
        fontSize: "18px",
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        background: "#f1f5f9"
    },

    menuText: {
        display: "flex",
        flexDirection: "column"
    },

    menuTitle: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#0f172a"
    },

    menuSubtitle: {
        fontSize: "12px",
        color: "#64748b"
    },

    menuArrow: {
        fontSize: "14px",
        color: "#94a3b8"
    },


    card: {
        width: "100%",
        boxSizing: "border-box",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        border: "1px solid #f1f5f9"
    }

};