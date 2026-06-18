import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TrackingMap from "../components/TrackingMap";
import { supabase } from "../supabaseClient";

export default function TrackingPage() {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("id", orderId)
                    .single();

                if (error) {
                    setError(error.message);
                    setOrder(null);
                } else {
                    setOrder(data);
                }

            } catch (err) {
                setError("Erreur serveur");
                setOrder(null);
            }

            setLoading(false);
        };

        if (orderId) fetchOrder();
    }, [orderId]);

    // ================= LOADING =================
    if (loading) {
        return (
            <div style={{ padding: 20, textAlign: "center" }}>
                📍 Chargement du tracking...
            </div>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <div style={{ padding: 20, textAlign: "center", color: "red" }}>
                ❌ Erreur : {error}
            </div>
        );
    }

    // ================= NOT FOUND =================
    if (!order) {
        return (
            <div style={{ padding: 20, textAlign: "center" }}>
                ❌ Commande introuvable
            </div>
        );
    }

    // ================= MAP =================
    return <TrackingMap orderId={orderId} order={order} />;
}
// ================= DESIGN SYSTEM ÉPURÉ =================
const styles = {
    container: {
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    header: {
        marginTop: "40px" // Évite le chevauchement avec le menu burger mobile
    },

    headerTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "800",
        color: "#0f172a",
        letterSpacing: "-0.5px"
    },

    card: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "32px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.01)"
    },

    text: {
        margin: 0,
        fontSize: "14px",
        color: "#64748b",
        fontWeight: "500",
        textAlign: "center",
        lineHeight: "1.5"
    }
};