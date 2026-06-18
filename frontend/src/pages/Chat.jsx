import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Chat() {
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [interlocuteurName, setInterlocuteurName] = useState("Interlocuteur");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    // MODIFICATION MESSAGE
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editText, setEditText] = useState("");

    const messagesEndRef = useRef(null);

    // Helper pour détecter si le texte est un lien d'image direct
    const isImageUrl = (url) => {
        return (url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null) || url.startsWith("data:image/");
    };

    // 🔐 GET USER
    useEffect(() => {
        const initUser = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user || null);
            setLoading(false);
        };
        initUser();
    }, []);

    // 💬 LOAD CONVERSATION + MESSAGES
    useEffect(() => {
        if (!conversationId || !user) return;

        const load = async () => {
            // CONVERSATION
            const { data: conv } = await supabase
                .from("conversations")
                .select("*")
                .eq("id", conversationId)
                .single();

            setConversation(conv);

            // NOM INTERLOCUTEUR
            if (conv) {
                const targetId = conv.buyer_id === user.id ? conv.seller_id : conv.buyer_id;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, name, username")
                    .eq("id", targetId)
                    .single();

                if (profile) {
                    setInterlocuteurName(
                        profile.full_name ||
                        profile.name ||
                        profile.username ||
                        "Utilisateur"
                    );
                }
            }

            // MESSAGES
            const { data: msgs } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            setMessages(msgs || []);
        };

        load();

        // REALTIME
        const channel = supabase
            .channel(`chat-${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setMessages((prev) => [...prev, payload.new]);
                    }
                    if (payload.eventType === "UPDATE") {
                        setMessages((prev) =>
                            prev.map((msg) =>
                                msg.id === payload.new.id ? payload.new : msg
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, user]);

    const getReceiverId = () => {
        if (!conversation || !user) return null;
        return conversation.buyer_id === user.id ? conversation.seller_id : conversation.buyer_id;
    };

    const sendMessage = async () => {
        if (!text.trim()) return;

        const receiver_id = getReceiverId();

        const { error } = await supabase
            .from("messages")
            .insert([
                {
                    conversation_id: conversationId,
                    sender_id: user.id,
                    receiver_id,
                    message: text.trim(),
                    read: false
                }
            ]);

        if (!error) {
            setText("");
        } else {
            console.log(error);
        }
    };

    const startEditing = (msg) => {
        setEditingMessageId(msg.id);
        setEditText(msg.message);
    };

    const saveEdit = async (msgId) => {
        if (!editText.trim()) return;

        const { error } = await supabase
            .from("messages")
            .update({
                message: editText.trim(),
                updated_at: new Date().toISOString()
            })
            .eq("id", msgId);

        if (error) {
            console.log("UPDATE ERROR :", error);
            alert("Erreur modification");
        } else {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === msgId
                        ? {
                            ...msg,
                            message: editText.trim(),
                            updated_at: new Date().toISOString()
                        }
                        : msg
                )
            );
            setEditingMessageId(null);
            setEditText("");
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.loginCard}>
                    <p style={{ marginBottom: "16px", color: "#64748b", fontSize: "14px" }}>Veuillez vous connecter pour accéder à la messagerie.</p>
                    <button style={styles.loginBtn} onClick={() => navigate("/login")}>
                        Connexion
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.chatContainer}>

                {/* HEADER */}
                <div style={styles.chatHeader}>
                    <div style={styles.headerInfo}>
                        <div style={styles.avatarPlaceholder}>
                            {interlocuteurName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style={styles.headerTitle}>{interlocuteurName}</h3>
                            <div style={styles.statusWrapper}>
                                <span style={styles.statusDot}></span>
                                <p style={styles.headerSubtitle}>En ligne</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => navigate(-1)} style={styles.backBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Retour
                    </button>
                </div>

                {/* MESSAGES AREA */}
                <div style={styles.messagesArea}>
                    {messages.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p style={{ margin: "0 0 6px 0", fontWeight: "500", color: "#64748b" }}>Aucun message pour le moment.</p>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Lancez la conversation !</span>
                        </div>
                    ) : (
                        messages.map((m) => {
                            const isMe = m.sender_id === user.id;
                            const isEditing = editingMessageId === m.id;
                            const hasImage = isImageUrl(m.message) || m.image_url;
                            const imgSrc = m.image_url || m.message;

                            return (
                                <div
                                    key={m.id}
                                    style={{
                                        ...styles.messageRow,
                                        justifyContent: isMe ? "flex-end" : "flex-start"
                                    }}
                                >
                                    <div style={{ ...styles.bubbleCard, alignItems: isMe ? "flex-end" : "flex-start" }}>
                                        <div
                                            onDoubleClick={() => isMe && !isEditing && !hasImage && startEditing(m)}
                                            style={{
                                                ...styles.messageBubble,
                                                background: isMe
                                                    ? "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)"
                                                    : "#ffffff",
                                                color: isMe ? "white" : "#1e293b",
                                                borderRadius: isMe
                                                    ? "16px 16px 4px 16px"
                                                    : "16px 16px 16px 4px",
                                                border: isMe ? "none" : "1px solid #e2e8f0",
                                                padding: hasImage ? "6px" : "10px 14px",
                                            }}
                                            title={isMe && !hasImage ? "Double-cliquez pour modifier" : ""}
                                        >
                                            {isEditing ? (
                                                <div style={styles.editContainer}>
                                                    <input
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && saveEdit(m.id)}
                                                        style={styles.editInput}
                                                        autoFocus
                                                    />
                                                    <div style={styles.editActions}>
                                                        <button onClick={() => saveEdit(m.id)} style={styles.saveBtn}>✓</button>
                                                        <button onClick={() => { setEditingMessageId(null); setEditText(""); }} style={styles.cancelBtn}>✕</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {hasImage ? (
                                                        <div style={styles.imageWrapper}>
                                                            <img
                                                                src={imgSrc}
                                                                alt="Contenu partagé"
                                                                style={styles.chatImage}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div style={styles.messageText}>{m.message}</div>
                                                    )}
                                                    <div style={{
                                                        ...styles.timeText,
                                                        color: isMe ? "rgba(255,255,255,0.75)" : "#64748b",
                                                        padding: hasImage ? "4px 6px 2px 6px" : "0"
                                                    }}>
                                                        {formatTime(m.created_at)}
                                                        {m.updated_at && m.updated_at !== m.created_at && " • modifié"}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* INPUT AREA */}
                <div style={styles.inputArea}>
                    <div
                        style={{
                            ...styles.inputWrapper,
                            borderColor: isFocused ? "#4f46e5" : "#e2e8f0",
                            boxShadow: isFocused ? "0 0 0 3px rgba(79, 70, 229, 0.1)" : "none"
                        }}
                    >
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Écrire un message ou coller le lien d'une image..."
                            style={styles.chatInput}
                        />
                        <button onClick={sendMessage} style={{
                            ...styles.sendButton,
                            backgroundColor: text.trim() ? "#4f46e5" : "#cbd5e1",
                            cursor: text.trim() ? "pointer" : "default"
                        }} disabled={!text.trim()}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

// 🎨 DESIGN SYSTEM OPTIMISÉ (UI PRO ET SOBRE)
const styles = {
    pageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    chatContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "460px",
        height: "100%",
        maxHeight: "850px",
        backgroundColor: "#ffffff",
        boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
    },
    chatHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        zIndex: 10,
    },
    headerInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    avatarPlaceholder: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#e0e7ff",
        color: "#4f46e5",
        fontWeight: "600",
        fontSize: "15px",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
    },
    headerTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: "600",
        color: "#0f172a",
        letterSpacing: "-0.01em",
    },
    statusWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "2px",
    },
    statusDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: "#10b981",
    },
    headerSubtitle: {
        margin: 0,
        fontSize: "12px",
        color: "#64748b",
    },
    backBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        color: "#64748b",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    messagesArea: {
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
    },
    messageRow: {
        display: "flex",
        width: "100%",
    },
    bubbleCard: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "80%",
    },
    messageBubble: {
        fontSize: "14px",
        lineHeight: "1.45",
        position: "relative",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        transition: "all 0.2s ease",
    },
    messageText: {
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
    },
    imageWrapper: {
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#f1f5f9",
    },
    chatImage: {
        width: "100%",
        maxHeight: "240px",
        objectFit: "cover",
        display: "block",
        cursor: "pointer",
    },
    timeText: {
        fontSize: "10px",
        marginTop: "4px",
        textAlign: "right",
        fontWeight: "400",
    },
    inputArea: {
        padding: "16px 20px 20px 20px",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "4px 6px 4px 14px",
        transition: "all 0.2s ease",
    },
    chatInput: {
        flex: 1,
        border: "none",
        backgroundColor: "transparent",
        outline: "none",
        fontSize: "14px",
        color: "#0f172a",
        padding: "10px 0",
    },
    sendButton: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        border: "none",
        color: "#ffffff",
        transition: "all 0.2s ease",
    },
    editContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        minWidth: "180px",
    },
    editInput: {
        width: "100%",
        padding: "6px 10px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.3)",
        backgroundColor: "rgba(255,255,255,0.15)",
        color: "inherit",
        fontSize: "14px",
        outline: "none",
    },
    editActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "6px",
    },
    saveBtn: {
        border: "none",
        background: "rgba(255,255,255,0.2)",
        color: "white",
        borderRadius: "6px",
        width: "26px",
        height: "26px",
        cursor: "pointer",
        fontSize: "12px",
    },
    cancelBtn: {
        border: "none",
        background: "transparent",
        color: "white",
        borderRadius: "6px",
        width: "26px",
        height: "26px",
        cursor: "pointer",
        fontSize: "12px",
        opacity: 0.8,
    },
    centerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f8fafc",
    },
    spinner: {
        width: "28px",
        height: "28px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#4f46e5",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    loginCard: {
        backgroundColor: "#ffffff",
        padding: "32px 24px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "340px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)"
    },
    loginBtn: {
        padding: "10px 24px",
        backgroundColor: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    }
};