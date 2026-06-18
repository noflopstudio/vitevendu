import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function MobileMenu({ profile }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    // ================= ROLE SAFE =================
    const role = profile?.role?.toLowerCase()?.trim() || "client";

    const handleNavigate = (path) => {
        setOpen(false);
        setTimeout(() => navigate(path), 150);
    };
    const sections = role === "admin" ? [
        {
            title: "👑 ADMIN PANEL",
            items: [
                // ================= DASHBOARD =================
                {
                    path: "/admin",
                    label: "⚙️ Dashboard Admin"
                },

                // ================= USERS =================
                {
                    path: "/users",
                    label: "👥 Utilisateurs"
                },
                {
                    path: "/users/roles",
                    label: "🎭 Gestion des rôles"
                },
                {
                    path: "/users/blocked",
                    label: "🚫 Comptes bloqués"
                },

                // ================= ORDERS =================
                {
                    path: "/admin/orders",
                    label: "📦 Toutes les commandes"
                },
                {
                    path: "/admin/orders/pending",
                    label: "⏳ Commandes en attente"
                },
                {
                    path: "/admin/orders/paid",
                    label: "💳 Commandes payées"
                },
                {
                    path: "/admin/orders/shipping",
                    label: "🚚 En livraison"
                },

                // ================= BUSINESS =================
                {
                    path: "/admin/sales",
                    label: "💰 Ventes globales"
                },
                {
                    path: "/admin/revenue",
                    label: "📊 Revenus plateforme"
                },
                {
                    path: "/admin/analytics",
                    label: "📈 Statistiques"
                },

                // ================= CONTENT =================
                {
                    path: "/admin/products",
                    label: "📦 Produits"
                },
                {
                    path: "/admin/categories",
                    label: "🗂️ Catégories"
                },



                {
                    path: "/admin/moderation",
                    label: "🧹 Modération des annonces"
                },

                {
                    path: "/admin/marketplace",
                    label: "🛒 Preview Marketplace"
                },

                // ================= SYSTEM =================
                {
                    path: "/settings",
                    label: "🛠️ Paramètres système"
                },
                {
                    path: "/admin/security",
                    label: "🔐 Sécurité"
                },
                {
                    path: "/admin/logs",
                    label: "📜 Logs système"
                },

                {

                    path: "/admin/reviews",

                    label: "📜 reviews"

                }

            ]
        }

    ] : [

        {
            title: "👤 ESPACE CLIENT",
            roles: ["client", "vendeur", "livreur", "owner", "admin"],
            items: [
                { path: "/", label: "🏠 Accueil" },
                { path: "/marketplace", label: "🛍️ Marketplace" }, // 🆕
                { path: "/cart", label: "🛒 Mon Panier" },
                { path: "/messages", label: "💬 Messagerie" },
                { path: "/orders", label: "📦 Mes commandes" }
            ]
        },

        {
            title: "🏪 VENDEUR",
            roles: ["vendeur"],
            items: [
                { path: "/dashboard", label: "📊 Tableau de bord" },
                { path: "/seller", label: "🏪 Ma Boutique" },

                { path: "/wallet", label: "💰 Revenus / Wallet" },
                { path: "/reviews", label: "⭐ Avis clients" },
                { path: "/stock", label: "📦 Gestion stock" }
            ]
        },

        {
            title: "🚚 LOGISTIQUE",
            roles: ["vendeur", "livreur"],
            items: [
                { path: "/livreur", label: "🚚 Livraisons" }
            ]
        },

        {
            title: "🤝 RÉSEAU",
            roles: ["client", "vendeur", "livreur"],
            items: [
                { path: "/partner", label: "🤝 Club partenaires" }
            ]
        }
    ];
    return (
        <>
            {/* INJECTION DE L'ANIMATION DU DÉGRADÉ LUMINEUX */}
            <style>
                {`
                    @keyframes waveEffect {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}
            </style>

            {/* OVERLAY */}
            <div
                onClick={() => setOpen(false)}
                style={{
                    ...styles.overlay,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none"
                }}
            />

            {/* BURGER */}
            <button onClick={() => setOpen(!open)} style={styles.burgerBtn}>
                <div style={{ ...styles.burgerLine, transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }} />
                <div style={{ ...styles.burgerLine, opacity: open ? 0 : 1 }} />
                <div style={{ ...styles.burgerLine, transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
            </button>

            {/* DRAWER */}
            <div
                style={{
                    ...styles.drawer,
                    transform: open ? "translateX(0)" : "translateX(-100%)"
                }}
            >
                {/* HEADER */}
                <div style={styles.header}>
                    <h3 style={styles.title}>Vite Vendu</h3>

                    <div style={styles.roleBadge}>
                        <span style={styles.roleDot} />
                        <span style={styles.roleText}>
                            {role.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* CONTENT */}
                <div style={styles.content}>
                    {sections.map((section) => (
                        <div key={section.title} style={styles.section}>
                            <h4 style={styles.sectionTitle}>
                                {section.title}
                            </h4>

                            <div style={styles.itemContainer}>
                                {section.items.map((item) => {
                                    const active = location.pathname === item.path;

                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => handleNavigate(item.path)}
                                            style={{
                                                ...styles.item,
                                                background: active ? "#f1f5f9" : "transparent",
                                                color: active ? "#0f172a" : "#475569",
                                                fontWeight: active ? "700" : "500"
                                            }}
                                        >
                                            {item.label}
                                            {active && <span style={styles.activeCheck}>✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div style={styles.footer}>
                    © {new Date().getFullYear()} Vite Vendu
                </div>
            </div>
        </>
    );
}

// ================= DESIGN SYSTEM OPTIMISÉ =================
const styles = {
    burgerBtn: {
        position: "fixed",
        top: "16px",
        left: "16px",
        zIndex: 10002,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "32px",
        height: "32px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "9px 8px",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "all 0.2s ease"
    },

    burgerLine: {
        width: "100%",
        height: "2px",
        backgroundColor: "#0f172a",
        borderRadius: "2px",
        transition: "all 0.2s ease"
    },

    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.12)",
        backdropFilter: "blur(1px)",
        zIndex: 9998,
        transition: "opacity 0.25s ease"
    },

    drawer: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "275px",
        height: "100vh",
        background: "#ffffff",
        zIndex: 9999,
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)",
        borderRight: "1px solid #f1f5f9"
    },

    header: {
        padding: "24px 20px",
        borderBottom: "1px solid #f1f5f9",
        marginTop: "55px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    title: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "900",
        letterSpacing: "-0.5px",
        // Styles pour le dégradé animé Vert / Bleu
        background: "linear-gradient(270deg, #10b981, #3b82f6, #10b981)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "waveEffect 4s ease infinite"
    },

    roleBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        padding: "3px 10px",
        borderRadius: "6px",
        alignSelf: "flex-start"
    },

    roleDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#10b981"
    },

    roleText: {
        fontSize: "10px",
        fontWeight: "700",
        color: "#64748b",
        letterSpacing: "0.5px"
    },

    content: {
        flex: 1,
        padding: "20px 12px",
        overflowY: "auto"
    },

    section: {
        marginBottom: "20px"
    },

    sectionTitle: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#94a3b8",
        letterSpacing: "0.5px",
        marginBottom: "8px",
        paddingLeft: "10px"
    },

    itemContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2px"
    },

    item: {
        width: "100%",
        textAlign: "left",
        padding: "11px 14px",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.15s ease"
    },

    activeCheck: {
        fontSize: "12px",
        color: "#10b981",
        fontWeight: "bold"
    },

    footer: {
        padding: "16px",
        fontSize: "11px",
        fontWeight: "500",
        textAlign: "center",
        color: "#94a3b8",
        borderTop: "1px solid #f1f5f9"
    }
};