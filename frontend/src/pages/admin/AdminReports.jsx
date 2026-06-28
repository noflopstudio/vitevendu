import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function AdminReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const [editingId, setEditingId] = useState(null);

    // 📥 Fetch reports
    const fetchReports = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
            setReports([]);
        } else {
            setReports(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // ✏️ START EDIT
    const startEdit = (r) => {
        setEditingId(r.id);
        setResponses((prev) => ({
            ...prev,
            [r.id]: r.admin_response || ""
        }));
    };

    // 📩 ENVOYER / MODIFIER
    const handleSaveResponse = async (id) => {
        const message = responses[id];

        if (!message || message.trim() === "") {
            alert("Le message ne peut pas être vide.");
            return;
        }

        const { error } = await supabase
            .from("reports")
            .update({
                admin_response: message,
                status: "in_review"
            })
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Erreur lors de la mise à jour");
            return;
        }

        setResponses((prev) => ({ ...prev, [id]: "" }));
        setEditingId(null);
        fetchReports();
    };

    // ✅ RESOLU
    const markResolved = async (id) => {
        const { error } = await supabase
            .from("reports")
            .update({ status: "resolved" })
            .eq("id", id);

        if (error) {
            console.log(error);
            return;
        }
        fetchReports();
    };

    // 🗑️ DELETE
    const deleteReport = async (id) => {
        const confirmDelete = window.confirm(
            "⚠️ Voulez-vous vraiment supprimer ce signalement ?"
        );
        if (!confirmDelete) return;

        const { error } = await supabase
            .from("reports")
            .delete()
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Erreur lors de la suppression");
            return;
        }
        fetchReports();
    };

    // Helper pour le style des badges de statut
    const getStatusStyle = (status) => {
        switch (status) {
            case "resolved":
                return { bg: "#e6f4ea", color: "#137333", text: "Résolu" };
            case "in_review":
                return { bg: "#ffeece", color: "#b06000", text: "En cours" };
            default:
                return { bg: "#fce8e6", color: "#c5221f", text: "En attente" };
        }
    };

    return (
        <div style={styles.container}>
            {/* HERO / HEADER */}
            <div style={styles.heroSection}>
                <h1 style={styles.title}>🛡️ Modération & Signalements</h1>
                <p style={styles.subtitle}>
                    Gérez et traitez les signalements d'arnaques ou de comportements suspects sur la plateforme.
                </p>
            </div>

            {/* LISTE DES SIGNALEMENTS */}
            {loading ? (
                <div style={styles.loadingBox}>Chargement des données...</div>
            ) : reports.length === 0 ? (
                <div style={styles.emptyBox}>Aucun signalement à traiter pour le moment. 🎉</div>
            ) : (
                <div style={styles.listContainer}>
                    {reports.map((r) => {
                        const statusBadge = getStatusStyle(r.status);
                        return (
                            <div key={r.id} style={styles.card}>
                                {/* HEADER DE LA CARD */}
                                <div style={styles.cardHeader}>
                                    <span style={styles.adBadge}>Annonce #{r.ad_id}</span>
                                    <span style={{
                                        ...styles.statusBadge,
                                        background: statusBadge.bg,
                                        color: statusBadge.color
                                    }}>
                                        {statusBadge.text}
                                    </span>
                                </div>

                                {/* DETAILS */}
                                <div style={styles.detailsGrid}>
                                    <p style={styles.metaText}>
                                        <strong>Type de problème :</strong> <span style={styles.typeText}>{r.type}</span>
                                    </p>
                                    <p style={styles.messageText}>
                                        <strong>Description de l'utilisateur :</strong><br />
                                        {r.message}
                                    </p>
                                </div>

                                {/* HISTORIQUE DE REPONSE ADMIN S'IL EXISTE */}
                                {r.admin_response && editingId !== r.id && (
                                    <div style={styles.responseBox}>
                                        <p style={styles.responseText}>
                                            <strong>🧑‍💼 Réponse actuelle de la modération :</strong><br />
                                            {r.admin_response}
                                        </p>
                                    </div>
                                )}

                                {/* ZONE DE TEXTE POUR REPONDRE OU MODIFIER */}
                                <div style={styles.inputGroup}>
                                    <textarea
                                        placeholder={r.admin_response ? "Modifier la réponse officielle..." : "Rédiger une réponse ou des notes internes..."}
                                        value={responses[r.id] !== undefined ? responses[r.id] : (editingId === r.id ? responses[r.id] : "")}
                                        onChange={(e) =>
                                            setResponses({
                                                ...responses,
                                                [r.id]: e.target.value
                                            })
                                        }
                                        style={styles.textarea}
                                    />
                                </div>

                                {/* BARRE D'ACTIONS */}
                                <div style={styles.actionsBar}>
                                    <div style={styles.leftActions}>
                                        <button
                                            onClick={() => handleSaveResponse(r.id)}
                                            style={styles.btnPrimary}
                                        >
                                            📩 Enregistrer la réponse
                                        </button>

                                        {r.admin_response && editingId !== r.id && (
                                            <button
                                                onClick={() => startEdit(r)}
                                                style={styles.btnSecondary}
                                            >
                                                ✏️ Charger la réponse
                                            </button>
                                        )}

                                        {r.status !== "resolved" && (
                                            <button
                                                onClick={() => markResolved(r.id)}
                                                style={styles.btnSuccess}
                                            >
                                                ✅ Marquer résolu
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => deleteReport(r.id)}
                                        style={styles.btnDanger}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>

                                {/* FOOTER DE LA CARD */}
                                <div style={styles.cardFooter}>
                                    🕒 Reçu le : {new Date(r.created_at).toLocaleString("fr-FR")}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px",
        paddingTop: "40px",
        paddingBottom: "60px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#1e293b"
    },

    heroSection: {
        textAlign: "center",
        marginBottom: "35px"
    },

    title: {
        fontSize: "30px",
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

    listContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },

    card: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        border: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: "14px"
    },

    adBadge: {
        background: "#e2e8f0",
        color: "#334155",
        padding: "6px 14px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "700"
    },

    statusBadge: {
        padding: "6px 14px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },

    detailsGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    metaText: {
        margin: 0,
        fontSize: "14px",
        color: "#64748b"
    },

    typeText: {
        color: "#0f172a",
        fontWeight: "600",
        textTransform: "capitalize"
    },

    messageText: {
        margin: 0,
        fontSize: "15px",
        color: "#334155",
        lineHeight: "1.6",
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #f1f5f9"
    },

    responseBox: {
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        padding: "14px",
        borderRadius: "12px"
    },

    responseText: {
        margin: 0,
        fontSize: "14px",
        color: "#166534",
        lineHeight: "1.5"
    },

    inputGroup: {
        width: "100%"
    },

    textarea: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        height: "85px",
        border: "1px solid #cbd5e1",
        borderRadius: "12px",
        fontSize: "14px",
        color: "#0f172a",
        background: "#ffffff",
        outline: "none",
        resize: "none",
        fontFamily: "inherit",
        lineHeight: "1.5",
        transition: "border-color 0.2s ease"
    },

    actionsBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        borderTop: "1px solid #f1f5f9",
        paddingTop: "16px"
    },

    leftActions: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap"
    },

    btnPrimary: {
        background: "#0f172a",
        color: "#ffffff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "opacity 0.2s"
    },

    btnSecondary: {
        background: "#ffffff",
        color: "#475569",
        border: "1px solid #cbd5e1",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer"
    },

    btnSuccess: {
        background: "#10b981",
        color: "#ffffff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer"
    },

    btnDanger: {
        background: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fca5a5",
        padding: "10px 16px",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s"
    },

    cardFooter: {
        fontSize: "12px",
        color: "#94a3b8",
        textAlign: "right",
        marginTop: "-4px"
    },

    loadingBox: {
        textAlign: "center",
        padding: "40px",
        color: "#64748b",
        fontWeight: "600"
    },

    emptyBox: {
        textAlign: "center",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "20px",
        color: "#64748b",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
    }
};