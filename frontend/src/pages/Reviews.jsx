import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

// 🎨 DESIGN SYSTEM EXCLUSIF VITEVENDU
const SV = {
    colors: {
        primary: "#064e3b",
        primaryLight: "#f0fdf4",
        secondary: "#2563eb",
        accent: "#f59e0b",
        dark: "#0f172a",
        muted: "#64748b",
        border: "#e2e8f0",
        bg: "#f8fafc"
    }
};

export default function Reviews() {
    const [localReviews, setLocalReviews] = useState([]);
    const [newAuthor, setNewAuthor] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [notification, setNotification] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editComment, setEditComment] = useState("");
    const [editRating, setEditRating] = useState(5);
    const [messages, setMessages] = useState({});

    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const load = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) setUserId(data.user.id);

            fetchReviews();
            fetchReplies(); // 👈 AJOUT ICI
        };

        load();
    }, []);

    const fetchReviews = async () => {
        const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
        if (data) setLocalReviews(data);
    };

    const triggerNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return triggerNotification("Connectez-vous pour laisser un avis.", "error");

        const { error } = await supabase.from("reviews").insert({
            user_id: user.id,
            author: newAuthor,
            rating: Number(newRating),
            comment: newComment
        });

        if (error) return triggerNotification(error.message, "error");

        fetchReviews();
        setNewAuthor(""); setNewComment(""); setNewRating(5);
        triggerNotification("Merci pour votre avis ! ⭐", "success");
    };

    const handleUpdateReview = async (id) => {
        const { error } = await supabase.from("reviews").update({ comment: editComment, rating: editRating }).eq("id", id);
        if (error) return triggerNotification(error.message, "error");

        await fetchReviews();
        triggerNotification("Avis modifié ✅", "success");
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Supprimer cet avis ?")) return;
        const { error } = await supabase.from("reviews").delete().eq("id", id);
        if (!error) {
            await fetchReviews();
            triggerNotification("Avis supprimé ✅", "success");
        }
    };

    const hasReviews = localReviews.length > 0;
    const averageRating = hasReviews ? (localReviews.reduce((acc, rev) => acc + rev.rating, 0) / localReviews.length).toFixed(1) : null;


    const fetchReplies = async () => {
        const { data } = await supabase
            .from("review_replies")
            .select("*")
            .order("created_at", { ascending: true });

        if (data) {
            const grouped = {};

            data.forEach((msg) => {
                if (!grouped[msg.review_id]) grouped[msg.review_id] = [];
                grouped[msg.review_id].push(msg);
            });

            setMessages(grouped);
        }
    };
    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <div style={styles.header}>
                    <h2 style={styles.headerTitle}>Avis Clients</h2>
                    {hasReviews && <p style={styles.headerSubtitle}>Note globale : <span style={styles.averageHighlight}>{averageRating} / 5</span></p>}
                </div>

                {notification && <div style={styles.notificationCard(notification.type)}>{notification.message}</div>}

                <div style={styles.formCard}>
                    <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
                        <input type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Votre nom" style={styles.formInput} required />
                        <div style={styles.starRatingSelector}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} onClick={() => setNewRating(star)} style={{ ...styles.clickableStar, color: star <= newRating ? SV.colors.accent : "#cbd5e1" }}>★</span>
                            ))}
                        </div>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Votre commentaire..." rows="3" style={styles.formTextarea} required />
                        <button type="submit" style={styles.submitReviewBtn}>Envoyer mon avis</button>
                    </form>
                </div>

                <div style={styles.listContainer}>
                    {localReviews.map((review) => (
                        <div key={review.id} style={styles.reviewCard}>
                            <div style={styles.reviewHeader}>
                                <span style={styles.reviewAuthor}>{review.author}</span>
                                <span style={styles.reviewStars}>{"★".repeat(review.rating)}</span>
                            </div>

                            {editingId === review.id ? (
                                <div style={{ marginTop: 10 }}>
                                    <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} style={styles.formTextarea} />
                                    <button onClick={() => handleUpdateReview(review.id)} style={styles.submitReviewBtn}>💾 Enregistrer</button>
                                    <button onClick={() => setEditingId(null)} style={{ ...styles.submitReviewBtn, background: SV.colors.muted, marginLeft: 10 }}>Annuler</button>
                                </div>
                            ) : (
                                <><p style={styles.reviewComment}>{review.comment}</p>
                                    {/* RÉPONSES ADMIN */}
                                    {messages[review.id]?.map((msg) => (
                                        <div
                                            key={msg.id}
                                            style={{
                                                marginTop: 10,
                                                padding: "10px 12px",
                                                borderRadius: "12px",
                                                background: msg.is_admin ? "#ffffff" : "#f1f5f9",
                                                color: msg.is_admin ? "#f80000" : "#0f172a",
                                                fontSize: "13px"
                                            }}
                                        >
                                            💬 {msg.message}
                                            {msg.is_admin && (
                                                <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>
                                                    (admin)
                                                </span>
                                            )}
                                        </div>
                                    ))}

                                    {review.user_id === userId && (
                                        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
                                            <button
                                                onClick={() => {
                                                    setEditingId(review.id);
                                                    setEditComment(review.comment);
                                                    setEditRating(review.rating);
                                                }}
                                                style={styles.editBtn}
                                            >
                                                ✏ Modifier
                                            </button>

                                            <button
                                                onClick={() => handleDeleteReview(review.id)}
                                                style={styles.deleteBtn}
                                            >
                                                🗑 Supprimer
                                            </button>
                                        </div>



                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: SV.colors.bg,
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        paddingTop: "90px", // ✅ Alignement exact anti-chevauchement menu burger
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
    },

    wrapper: {
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
    },

    header: {
        padding: "0 4px"
    },

    headerTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "800",
        letterSpacing: "-0.6px",
        background: `linear-gradient(135deg, ${SV.colors.primary} 0%, ${SV.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        display: "inline-block"
    },

    headerSubtitle: {
        margin: "6px 0 0 0",
        fontSize: "13px",
        color: SV.colors.muted,
        fontWeight: "500"
    },

    averageHighlight: {
        color: SV.colors.primary,
        fontWeight: "800"
    },

    notificationCard: (type) => ({
        padding: "14px 16px",
        borderRadius: "14px",
        fontSize: "13px",
        fontWeight: "600",
        boxSizing: "border-box",
        border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecaca"}`,
        background: type === "success" ? SV.colors.primaryLight : "#fef2f2",
        color: type === "success" ? "#166534" : "#991b1b",
        boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
    }),

    formCard: {
        background: "#ffffff",
        border: `1px solid ${SV.colors.border}`,
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.02)"
    },

    sectionTitle: {
        margin: "0 0 20px 0",
        fontSize: "15px",
        fontWeight: "700",
        color: SV.colors.dark,
        letterSpacing: "-0.2px"
    },

    reviewForm: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    formRow: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap"
    },

    formLabel: {
        display: "block",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontWeight: "700",
        color: SV.colors.muted,
        marginBottom: "8px"
    },

    formInput: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        border: `1px solid ${SV.colors.border}`,
        backgroundColor: "#f8fafc",
        fontSize: "14px",
        color: SV.colors.dark,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        fontFamily: "inherit",
        ':focus': {
            borderColor: SV.colors.primary,
            backgroundColor: "#ffffff"
        }
    },

    formTextarea: {
        width: "100%",
        padding: "14px 16px",
        borderRadius: "12px",
        border: `1px solid ${SV.colors.border}`,
        backgroundColor: "#f8fafc",
        fontSize: "14px",
        color: SV.colors.dark,
        outline: "none",
        fontFamily: "inherit",
        resize: "vertical",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease, background-color 0.2s ease"
    },

    starRatingSelector: {
        display: "flex",
        gap: "6px",
        padding: "6px 0"
    },

    clickableStar: {
        fontSize: "26px",
        cursor: "pointer",
        userSelect: "none",
        transition: "transform 0.1s ease",
        lineHeight: "1"
    },

    submitReviewBtn: {
        alignSelf: "flex-start",
        padding: "12px 24px",
        background: SV.colors.primary,
        color: "#ffffff",
        border: "none",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginTop: "4px",
        boxShadow: "0 4px 12px rgba(6, 78, 59, 0.15)"
    },

    listContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    reviewsList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },

    reviewCard: {
        background: "#ffffff",
        border: `1px solid ${SV.colors.border}`,
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 15px rgba(15, 23, 42, 0.01)"
    },

    reviewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px"
    },

    reviewAuthor: {
        fontWeight: "700",
        fontSize: "14px",
        color: SV.colors.dark
    },

    reviewStars: {
        fontSize: "15px",
        color: SV.colors.accent,
        letterSpacing: "1px"
    },

    reviewDate: {
        fontSize: "11px",
        color: SV.colors.muted,
        fontWeight: "500",
        display: "block",
        marginBottom: "12px"
    },

    reviewComment: {
        margin: 0,
        fontSize: "14px",
        color: "#334155",
        lineHeight: "1.6"
    },

    emptyCard: {
        background: "#ffffff",
        border: `1px dashed ${SV.colors.border}`,
        borderRadius: "24px",
        padding: "40px 20px"
    },

    emptyText: {
        margin: 0,
        fontSize: "13px",
        color: SV.colors.muted,
        fontWeight: "500",
        textAlign: "center"
    },

    editBtn: {
        padding: "8px 16px",
        backgroundColor: "#f0f9ff",
        color: "#0369a1",
        border: "1px solid #bae6fd",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease"
    },

    deleteBtn: {
        padding: "8px 16px",
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease"
    },

    // Style spécifique pour l'annulation lors de l'édition
    cancelBtn: {
        padding: "8px 16px",
        backgroundColor: "#f1f5f9",
        color: "#475569",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        marginLeft: "10px"
    },

    // Style pour le sélecteur de note pendant l'édition
    editRatingSelector: {
        display: "flex",
        gap: "8px",
        marginTop: "12px",
        marginBottom: "12px"
    }
};  