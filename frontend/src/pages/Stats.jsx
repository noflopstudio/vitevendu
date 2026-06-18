import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const SV = {
    colors: {
        primary: "#064e3b",
        secondary: "#2563eb",
        accent: "#f97316",
        dark: "#0f172a",
        muted: "#64748b",
        border: "#e2e8f0",
        bg: "#f8fafc"
    }
};

export default function Stats() {
    const [adsCount, setAdsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const currentUser = authData?.user;

                console.log("USER:", currentUser);

                if (!currentUser) {
                    setError("Utilisateur non connecté");
                    setLoading(false);
                    return;
                }

                const { count, error } = await supabase
                    .from("ads")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", currentUser.id);

                console.log("COUNT:", count);
                console.log("ERROR:", error);

                if (error) {
                    setError(error.message);
                } else {
                    setAdsCount(count || 0);
                }

            } catch (err) {
                console.error(err);
                setError("Erreur serveur");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            background: SV.colors.bg,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{
                width: "100%",
                maxWidth: 500,
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
            }}>

                <h2 style={{ color: SV.colors.dark }}>
                    📊 Statistiques Ventes
                </h2>

                <p style={{ color: SV.colors.muted }}>
                    Aperçu de vos annonces publiées
                </p>

                {/* LOADING */}
                {loading && (
                    <div style={{
                        height: 40,
                        background: "#e2e8f0",
                        borderRadius: 8,
                        marginTop: 15
                    }} />
                )}

                {/* ERROR */}
                {error && (
                    <div style={{
                        marginTop: 15,
                        padding: 10,
                        background: "#fee2e2",
                        color: "#b91c1c",
                        borderRadius: 8
                    }}>
                        ❌ {error}
                    </div>
                )}

                {/* DATA */}
                {!loading && !error && (
                    <div style={{
                        marginTop: 20,
                        fontSize: 22,
                        fontWeight: "bold",
                        color: SV.colors.primary
                    }}>
                        {adsCount} <span style={{ fontSize: 14 }}>annonces publiées</span>
                    </div>
                )}

            </div>
        </div>
    );
}
// ================= DESIGN SYSTEM EXCLUSIF VITEVENDU =================
const styles = {
    container: {
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: SV.colors.bg,
        display: "flex",
        justifyContent: "center",
        padding: "24px 16px",
        paddingTop: "90px", // ✅ Aligné sur le Dashboard et Wallet (Zéro collision avec le burger menu)
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
    },

    wrapper: {
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },

    header: {
        padding: "0 4px"
    },

    headerTitle: {
        margin: 0,
        fontSize: "22px",
        fontWeight: "800",
        letterSpacing: "-0.5px",
        background: `linear-gradient(135deg, ${SV.colors.primary} 0%, ${SV.colors.secondary} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
        display: "inline-block"
    },

    subtitle: {
        fontSize: "12px",
        color: SV.colors.muted,
        fontWeight: "500",
        margin: "4px 0 0 0"
    },

    card: {
        background: "#ffffff",
        border: `1px solid ${SV.colors.border}`,
        borderRadius: "24px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)"
    },

    cardLabel: {
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: SV.colors.muted,
        fontWeight: "700"
    },

    counter: {
        fontWeight: "900",
        fontSize: "32px",
        color: SV.colors.accent, // Orange vibrant pour faire ressortir les datas
        letterSpacing: "-1px"
    },

    unit: {
        fontSize: "14px",
        fontWeight: "700",
        color: SV.colors.muted,
        letterSpacing: "0px"
    },

    skeleton: {
        width: "60px",
        height: "38px",
        backgroundColor: "#f1f5f9",
        borderRadius: "8px",
        marginTop: "4px"
    }
};