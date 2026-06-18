import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function MessagesList() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState(null);

    /* =========================================================================
       🔐 GET USER
       ========================================================================= */
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                setUser(data.session.user);
            }
            setLoading(false);
        };
        getUser();
    }, []);

    /* =========================================================================
       💬 LOAD DATA (CONVERSATIONS + PROFILES + LAST MESSAGES)
       ========================================================================= */
    const loadConversations = async (currentUser) => {
        if (!currentUser) return;

        const { data: convs } = await supabase
            .from("conversations")
            .select("*")
            .or(`buyer_id.eq.${currentUser.id},seller_id.eq.${currentUser.id}`)
            .order("created_at", { ascending: false });

        if (!convs) return;

        const finalData = await Promise.all(
            convs.map(async (conv) => {
                const otherUserId = conv.buyer_id === currentUser.id ? conv.seller_id : conv.buyer_id;

                // 👤 PROFILE INTERLOCUTEUR
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("username, avatar_url, full_name, name")
                    .eq("id", otherUserId)
                    .single();

                // 💬 DERNIER MESSAGE
                const { data: lastMessage } = await supabase
                    .from("messages")
                    .select("*")
                    .eq("conversation_id", conv.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                // 🔴 COMPTEUR DE NON LUS
                const { count } = await supabase
                    .from("messages")
                    .select("*", { count: "exact", head: true })
                    .eq("conversation_id", conv.id)
                    .eq("receiver_id", currentUser.id)
                    .eq("read", false);

                return {
                    ...conv,
                    displayName: profile?.full_name || profile?.name || profile?.username || "Utilisateur",
                    avatarUrl: profile?.avatar_url || null,
                    lastMessage: lastMessage || null,
                    unreadCount: count || 0,
                    updatedTimestamp: lastMessage ? new Date(lastMessage.created_at).getTime() : new Date(conv.created_at).getTime()
                };
            })
        );

        finalData.sort((a, b) => b.updatedTimestamp - a.updatedTimestamp);
        setConversations(finalData);
    };

    /* =========================================================================
       🔥 ECOUTEUR TEMPS REEL GLOBAL
       ========================================================================= */
    useEffect(() => {
        if (!user) return;

        loadConversations(user);

        const channel = supabase
            .channel("messages-global-listener")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `receiver_id=eq.${user.id}`,
                },
                async () => {
                    await loadConversations(user);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Formatage rapide de l'heure
    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    /* =========================================================================
       ⏳ ECOUTEURS DE CHARGEMENT ET D'ACCÈS
       ========================================================================= */
    if (loading) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.spinner}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <div style={styles.loadingText}>Chargement des discussions...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.centerContainer}>
                <div style={styles.cardEmpty}>
                    <div style={{ fontSize: "42px", marginBottom: "16px" }}>🔐</div>
                    <h3 style={{ margin: "0 0 10px 0", color: "#0f172a", fontWeight: "700" }}>Connexion requise</h3>
                    <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.5" }}>
                        Veuillez vous connecter pour accéder à votre espace de messagerie privé.
                    </p>
                    <button onClick={() => navigate("/login")} style={styles.primaryBtn}>
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>

                {/* BLOC TOP HEADER */}
                <div style={styles.mainHeader}>
                    <div>
                        <h1 style={styles.mainTitle}>Discussions</h1>
                        <p style={styles.mainSubtitle}>Gérez vos négociations et échanges en direct</p>
                    </div>
                    <div style={styles.activeBadgeGlobal}>
                        <span style={styles.pulseDot}></span>
                        <style>{`
                            @keyframes pulse {
                                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                                70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                            }
                        `}</style>
                        Temps réel actif
                    </div>
                </div>

                {/* CONTAINER DE LA LISTE */}
                <div style={styles.listContainer}>
                    {conversations.length === 0 ? (
                        <div style={styles.emptyStateContainer}>
                            <div style={styles.emptyIllustration}>✉️</div>
                            <h3 style={{ margin: "0 0 6px 0", color: "#1e293b", fontSize: "16px", fontWeight: "700" }}>Aucun message pour le moment</h3>
                            <p style={{ margin: 0, color: "#94a3b8", fontSize: "13.5px", maxWidth: "280px", lineHeight: "1.5" }}>
                                Les conversations liées aux articles que vous achetez ou vendez apparaîtront ici.
                            </p>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const hasUnread = conv.unreadCount > 0;
                            const isHovered = hoveredId === conv.id;

                            // Gestion dynamique des bordures et fonds dégradés
                            let cardBorder = "1px solid rgba(226, 232, 240, 0.8)";
                            let cardBackground = "rgba(255, 255, 255, 0.75)";
                            let cardShadow = "0 4px 12px -2px rgba(15, 23, 42, 0.01)";

                            if (hasUnread) {
                                cardBorder = "1px solid rgba(79, 70, 229, 0.3)";
                                cardBackground = "linear-gradient(135deg, #ffffff 0%, #f5f3ff 100%)";
                            }
                            if (isHovered) {
                                cardShadow = "0 12px 24px -8px rgba(79, 70, 229, 0.15)";
                                cardBackground = hasUnread
                                    ? "linear-gradient(135deg, #ffffff 0%, #ede9fe 100%)"
                                    : "#ffffff";
                            }

                            return (
                                <div
                                    key={conv.id}
                                    style={{
                                        ...styles.conversationCard,
                                        border: cardBorder,
                                        background: cardBackground,
                                        boxShadow: cardShadow,
                                        transform: isHovered ? "translateY(-2px)" : "translateY(0)"
                                    }}
                                    onMouseEnter={() => setHoveredId(conv.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    onClick={() => navigate(`/chat/${conv.id}`)}
                                >
                                    {/* BLOC AVATAR DYNAMIQUE */}
                                    <div style={styles.avatarWrapper}>
                                        {conv.avatarUrl ? (
                                            <img src={conv.avatarUrl} alt="avatar" style={styles.userAvatar} />
                                        ) : (
                                            <div style={styles.avatarFallback}>
                                                {conv.displayName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        {hasUnread && <span style={styles.indicatorDot}></span>}
                                    </div>

                                    {/* DETAILS DU MESSAGE */}
                                    <div style={styles.cardContent}>
                                        <div style={styles.cardTopLine}>
                                            <h3 style={{
                                                ...styles.usernameText,
                                                fontWeight: hasUnread ? "700" : "600",
                                                color: hasUnread ? "#4f46e5" : "#1e293b"
                                            }}>
                                                {conv.displayName}
                                            </h3>
                                            <span style={{
                                                ...styles.timeText,
                                                color: hasUnread ? "#6366f1" : "#94a3b8",
                                                fontWeight: hasUnread ? "600" : "500"
                                            }}>
                                                {formatTime(conv.lastMessage?.created_at)}
                                            </span>
                                        </div>

                                        <div style={styles.cardBottomLine}>
                                            <p style={{
                                                ...styles.lastMessageSnippet,
                                                fontWeight: hasUnread ? "500" : "400",
                                                color: hasUnread ? "#334155" : "#64748b"
                                            }}>
                                                {conv.lastMessage?.message || "Nouvelle discussion créée..."}
                                            </p>

                                            {hasUnread && (
                                                <div style={styles.unreadCounterBadge}>
                                                    {conv.unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================================
   👑 DESIGN SYSTEM ULTRALIGHT & GRADIENT PREMIUM
   ========================================================================= */
const styles = {
    pageWrapper: {
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
        minHeight: "100vh",
        padding: "50px 20px",
        display: "flex",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    container: {
        width: "100%",
        maxWidth: "580px",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
    },
    mainHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 6px",
    },
    mainTitle: {
        margin: 0,
        fontSize: "32px",
        fontWeight: "800",
        background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.025em",
    },
    mainSubtitle: {
        margin: "6px 0 0 0",
        fontSize: "14px",
        color: "#64748b",
        fontWeight: "500",
    },
    activeBadgeGlobal: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255, 255, 255, 0.8)",
        padding: "6px 14px",
        borderRadius: "99px",
        fontSize: "12px",
        fontWeight: "600",
        color: "#1e293b",
        boxShadow: "0 4px 10px rgba(15, 23, 42, 0.03)",
        border: "1px solid #e2e8f0",
        backdropFilter: "blur(4px)"
    },
    pulseDot: {
        width: "7px",
        height: "7px",
        background: "#10b981",
        borderRadius: "50%",
        display: "inline-block",
        animation: "pulse 2s infinite ease-in-out",
    },
    listContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    conversationCard: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "18px",
        borderRadius: "24px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(12px)",
        outline: "none",
    },
    avatarWrapper: {
        position: "relative",
        display: "inline-block",
    },
    userAvatar: {
        width: "54px",
        height: "54px",
        borderRadius: "18px",
        objectFit: "cover",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
    avatarFallback: {
        width: "54px",
        height: "54px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        fontWeight: "700",
    },
    indicatorDot: {
        position: "absolute",
        top: "-2px",
        right: "-2px",
        width: "12px",
        height: "12px",
        background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
        borderRadius: "50%",
        border: "2.5px solid #ffffff",
    },
    cardContent: {
        flex: 1,
        minWidth: 0,
    },
    cardTopLine: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "5px",
    },
    usernameText: {
        margin: 0,
        fontSize: "15.5px",
        letterSpacing: "-0.01em",
    },
    timeText: {
        fontSize: "12px",
    },
    cardBottomLine: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
    },
    lastMessageSnippet: {
        margin: 0,
        fontSize: "13.5px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        flex: 1,
    },
    unreadCounterBadge: {
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "700",
        minWidth: "20px",
        height: "20px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 6px",
        boxShadow: "0 4px 10px rgba(79, 70, 229, 0.25)",
    },
    emptyStateContainer: {
        background: "rgba(255, 255, 255, 0.5)",
        borderRadius: "32px",
        padding: "60px 24px",
        textAlign: "center",
        border: "1px dashed rgba(203, 213, 225, 0.8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backdropFilter: "blur(4px)"
    },
    emptyIllustration: {
        fontSize: "40px",
        marginBottom: "16px",
    },
    centerContainer: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5f9",
    },
    cardEmpty: {
        background: "#ffffff",
        padding: "40px 32px",
        borderRadius: "32px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.05)",
        border: "1px solid #e2e8f0",
        maxWidth: "360px",
    },
    primaryBtn: {
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        color: "#fff",
        border: "none",
        padding: "12px 28px",
        borderRadius: "16px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
        transition: "transform 0.2s, opacity 0.2s",
        ":hover": { transform: "scale(1.02)" }
    },
    spinner: {
        width: "36px",
        height: "36px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#4f46e5",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    loadingText: {
        marginTop: "16px",
        fontSize: "14px",
        color: "#475569",
        fontWeight: "600",
    }
};