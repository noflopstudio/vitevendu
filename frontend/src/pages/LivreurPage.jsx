import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

// 🎨 THÈME COULEURS
const colors = {
    blue: "#2563eb",
    green: "#065f46",
    orange: "#f97316",
    bg: "#f4f6f8",
    white: "#ffffff",
    text: "#111827"
};

export default function LivreurPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [profileLoaded, setProfileLoaded] = useState(false);

    const watchId = useRef(null);

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setProfileLoaded(true);
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
        setProfileLoaded(true);
    };

    const fetchOrders = async () => {
        const { data } = await supabase.from("orders").select("*").in("status", ["pending", "paid", "livraison"]).order("created_at", { ascending: false });
        setOrders(data || []);
    };

    useEffect(() => {
        const init = async () => { await loadProfile(); await fetchOrders(); setLoading(false); };
        init();
        const channel = supabase.channel("orders").on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchOrders).subscribe();
        return () => { supabase.removeChannel(channel); stopTracking(); };
    }, []);

    const startTracking = (orderId) => {
        stopTracking();
        setTrackingOrderId(orderId);
        watchId.current = navigator.geolocation.watchPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            await supabase.from("orders").update({ driver_lat: latitude, driver_lng: longitude, status: "livraison" }).eq("id", orderId);
        });
    };

    const stopTracking = () => {
        if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
        setTrackingOrderId(null);
    };

    const updateStatus = async (id, status) => {
        await supabase.from("orders").update({ status }).eq("id", id);
        if (status === "terminée") stopTracking();
        await fetchOrders();
    };

    if (loading) return <div style={styles.center}>🔄 Chargement...</div>;
    if (!profileLoaded) return null;

    // --- PAGE NON-LIVREUR (DESIGN COMPLET) ---
    if (!profile || (profile.role !== "livreur" && profile.role !== "admin")) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <h2 style={{ color: colors.blue }}>🚚 Devenir Livreur</h2>
                    <p>Remplis ce formulaire pour rejoindre notre équipe.</p>

                    <div style={styles.inputGroup}><label>📷 Photo de profil</label><input type="file" accept="image/*" style={styles.input} /></div>
                    <div style={styles.inputGroup}><label>📄 CV (PDF ou image)</label><input type="file" accept=".pdf,image/*" style={styles.input} /></div>
                    <div style={styles.inputGroup}><label>👤 Nom complet</label><input type="text" placeholder="Ex: Kouassi Koffi" style={styles.input} /></div>
                    <div style={styles.inputGroup}><label>📞 Numéro WhatsApp</label><input type="tel" placeholder="Ex: 07XXXXXXXX" style={styles.input} /></div>
                    <div style={styles.inputGroup}><label>🏠 Ville / Zone</label><input type="text" placeholder="Ex: Abidjan - Cocody" style={styles.input} /></div>
                    <div style={styles.inputGroup}><label>🚀 Expérience (optionnel)</label><textarea placeholder="Décris ton expérience" style={{ ...styles.input, height: 80 }} /></div>

                    <a href="https://wa.me/2250748922397?text=Bonjour%20je%20veux%20devenir%20livreur%20chez%20vous."
                        target="_blank" style={styles.btnWhatsApp}>💬 Envoyer ma candidature WhatsApp</a>
                </div>
            </div>
        );
    }

    // --- PAGE LIVREUR (DESIGN COMPLET) ---
    return (
        <div style={styles.page}>
            <h2 style={{ color: colors.blue, marginBottom: 20 }}>🚚 Espace Livreur</h2>
            <div style={styles.container}>
                {orders.map((o) => {
                    let items = [];
                    try { items = typeof o.items === "string" ? JSON.parse(o.items) : o.items || []; } catch (e) { items = []; }
                    const shipping = o.shipping_details || {};

                    return (
                        <div key={o.id} style={styles.card}>
                            <h3 style={{ color: colors.blue }}>📦 Commande #{o.id}</h3>
                            <div style={styles.infoBox}>
                                <p>👤 {shipping.name || "Non défini"}</p>
                                <p>📞 {shipping.phone || "Non défini"}</p>
                                <p>📍 {o.shipping_location || "Non défini"}</p>
                                <p>🏠 {shipping.address || "Non défini"}</p>
                                <p>🧭 {shipping.landmark || "Aucun"}</p>
                            </div>
                            <h4>🛒 Produits :</h4>
                            {items.map((item, i) => (
                                <div key={i} style={styles.item}>
                                    <img src={item.image || "https://via.placeholder.com/60"} style={styles.img} />
                                    <div><b>{item.title}</b><br /> {item.size || item.pointure || "N/A"} | 📦 {item.quantity} | 💰 {item.price} FCFA</div>
                                </div>
                            ))}
                            <p><b>Total:</b> {o.total} FCFA</p>
                            <button onClick={() => trackingOrderId === o.id ? updateStatus(o.id, "terminée") : startTracking(o.id)}
                                style={{ ...styles.btnAction, background: trackingOrderId === o.id ? colors.green : colors.blue }}>
                                {trackingOrderId === o.id ? "✅ Terminer livraison" : "🚚 Accepter commande"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 🎨 DESIGN SYSTEM
const styles = {
    page: { minHeight: "100vh", background: colors.bg, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" },
    container: { width: "100%", maxWidth: "500px" },
    card: { background: colors.white, padding: "20px", borderRadius: "15px", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
    inputGroup: { marginBottom: "12px" },
    input: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", boxSizing: "border-box" },
    infoBox: { background: "#f8fafc", padding: "12px", borderRadius: "10px", marginBottom: "10px", borderLeft: `4px solid ${colors.blue}` },
    item: { display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid #eee" },
    img: { width: 60, height: 60, borderRadius: 8, objectFit: "cover" },
    btnAction: { width: "100%", padding: "12px", borderRadius: "8px", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" },
    btnWhatsApp: { display: "block", textAlign: "center", background: colors.orange, color: "#fff", padding: "12px", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", marginTop: "15px" },
    center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }
};