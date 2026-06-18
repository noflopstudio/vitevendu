import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const SV = {
    colors: {
        primary: "#064e3b",
        muted: "#64748b",
        border: "#e2e8f0",
        bg: "#f8fafc"
    }
};

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [messages, setMessages] = useState({});
    const [draft, setDraft] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadReviews();
    }, []);

    async function loadReviews() {
        setLoading(true);

        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) {
            setReviews(data || []);
            data.forEach((r) => loadMessages(r.id));
        }

        setLoading(false);
    }

    async function loadMessages(reviewId) {
        const { data } = await supabase
            .from("review_replies")
            .select("*")
            .eq("review_id", reviewId)
            .order("created_at", { ascending: true });

        setMessages((prev) => ({
            ...prev,
            [reviewId]: data || []
        }));
    }

    const sendMessage = async (reviewId) => {
        const text = (draft[reviewId] ?? "").trim();
        if (!text) return;

        setLoadingId(reviewId);

        const { error } = await supabase
            .from("review_replies")
            .insert({
                review_id: reviewId,
                message: text,
                is_admin: true
            });

        setLoadingId(null);

        if (error) return alert(error.message);

        setDraft((prev) => ({ ...prev, [reviewId]: "" }));
        loadMessages(reviewId);
    };

    const startEdit = (msg) => {
        setEditId(msg.id);
        setDraft((prev) => ({
            ...prev,
            [msg.review_id]: msg.message
        }));
    };

    const updateMessage = async (reviewId) => {
        const text = draft[reviewId];

        const { error } = await supabase
            .from("review_replies")
            .update({ message: text })
            .eq("id", editId);

        if (error) return alert(error.message);

        setEditId(null);
        loadMessages(reviewId);
    };

    const deleteReview = async (id) => {
        if (!confirm("Supprimer cet avis ?")) return;

        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id);

        if (error) return alert(error.message);

        setReviews((prev) => prev.filter((r) => r.id !== id));
    };

    if (loading) return <p>Chargement...</p>;

 return (
    <div style={styles.container}>
        <h2 style={styles.title}>📜 Gestion des Avis</h2>

        {reviews.map((r) => {
            const msgs = messages[r.id] || [];

            return (
                <div key={r.id} style={styles.card}>
                    {/* HEADER */}
                    <div style={styles.header}>
                        <div>
                            <strong style={styles.author}>
                                {r.author}
                            </strong>
                            <p style={styles.comment}>
                                {r.comment}
                            </p>
                        </div>

                        <div style={styles.stars}>
                            {"★".repeat(r.rating)}
                        </div>
                    </div>

                    {/* CHAT */}
                    <div style={styles.chatBox}>
                        {msgs.map((m) => (
                            <div
                                key={m.id}
                                style={{
                                    ...styles.message,
                                    alignSelf: m.is_admin
                                        ? "flex-end"
                                        : "flex-start",
                                    background: m.is_admin
                                        ? "#064e3b"
                                        : "#f1f5f9",
                                    color: m.is_admin
                                        ? "#fff"
                                        : "#0f172a"
                                }}
                            >
                                {m.message}

                                <button
                                    onClick={() => startEdit(m)}
                                    style={styles.editBtn}
                                >
                                    ✏
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* INPUT */}
                    <div style={styles.inputBox}>
                        <textarea
                            placeholder="Écrire une réponse..."
                            value={draft[r.id] ?? ""}
                            onChange={(e) =>
                                setDraft((prev) => ({
                                    ...prev,
                                    [r.id]: e.target.value
                                }))
                            }
                            style={styles.textarea}
                        />

                        <div style={styles.actions}>
                            <button
                                onClick={() => sendMessage(r.id)}
                                style={styles.primaryBtn}
                            >
                                💬 Envoyer
                            </button>

                            {editId && (
                                <button
                                    onClick={() =>
                                        updateMessage(r.id)
                                    }
                                    style={styles.secondaryBtn}
                                >
                                    💾 Modifier
                                </button>
                            )}

                            <button
                                onClick={() => deleteReview(r.id)}
                                style={styles.dangerBtn}
                            >
                                🗑 Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);
}
const styles = {
 container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto"
},

    title: {
        fontSize: "22px",
        fontWeight: "800",
        marginBottom: "20px",
        color: "#0f172a"
    },

    card: {
        background: "#ffffff",
        border: "1px solid #eef2f7",
        borderRadius: "18px",
        padding: "18px",
        marginBottom: "16px",
        boxShadow: "0 8px 25px rgba(15, 23, 42, 0.06)"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },

    author: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#0f172a"
    },

    comment: {
        marginTop: "6px",
        color: "#64748b",
        fontSize: "14px",
        lineHeight: "1.5"
    },

    stars: {
        color: "#f59e0b",
        fontSize: "14px"
    },

    chatBox: {
        marginTop: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },

    message: {
        padding: "10px 14px",
        borderRadius: "14px",
        maxWidth: "75%",
        fontSize: "14px",
        lineHeight: "1.4",
        border: "1px solid #eef2f7"
    },

    editBtn: {
        marginLeft: "8px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "12px",
        color: "#94a3b8"
    },

    inputBox: {
        marginTop: "15px"
    },

    textarea: {
        width: "100%",
        minHeight: "80px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        outline: "none",
        fontSize: "14px",
        background: "#f8fafc"
    },

    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
        flexWrap: "wrap"
    },

    primaryBtn: {
        background: "#0f172a",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    },

    secondaryBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    },

    dangerBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    }
};