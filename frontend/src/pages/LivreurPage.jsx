import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";

// 🎨 THÈME COULEURS ÉLÉGANT
const colors = {
    blue: "#2563eb",
    green: "#10b981",
    orange: "#f97316",
    bg: "#f8fafc",
    white: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    border: "#e2e8f0"
};

export default function LivreurPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [profileLoaded, setProfileLoaded] = useState(false);

    // ✍️ États pour le formulaire de candidature (Tous conservés)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [whatsappNum, setWhatsappNum] = useState("");
    const [zone, setZone] = useState("");
    const [experience, setExperience] = useState("");
    const [transport, setTransport] = useState("");
    const [availability, setAvailability] = useState("");

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

    function stopTracking() {
        if (watchId.current) {
            navigator.geolocation.clearWatch(watchId.current);
        }
        watchId.current = null;
        setTrackingOrderId(null);
    }

    const updateStatus = async (id, status) => {
        await supabase.from("orders").update({ status }).eq("id", id);
        if (status === "terminée") stopTracking();
        await fetchOrders();
    };

    // 🚀 Fonction pour générer le lien WhatsApp dynamique (Conservée avec les nouveaux champs ajoutés)
    const handleWhatsAppSubmit = (e) => {
        if (!fullName || !email || !age || !whatsappNum || !zone) {
            e.preventDefault();
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        const phone = "2250748922397";

        const message = `🚚 Bonjour, je souhaite devenir livreur chez ViteVendu.

Voici mes informations :

👤 Nom complet : ${fullName}
📧 Gmail : ${email}
🎂 Âge : ${age} ans
📞 WhatsApp : ${whatsappNum}
📍 Ville / Commune : ${zone}
🛵 Moyen de transport : ${transport || "Non spécifié"}
🕒 Disponibilité : ${availability || "Non spécifiée"}
🚀 Expérience : ${experience || "Aucune mentionnée"}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
    };

    if (loading) return <div style={styles.center}>🔄 Chargement...</div>;
    if (!profileLoaded) return null;

    // --- PAGE NON-LIVREUR (DESIGN COMPACT & PROFESSIONNEL) ---
    if (!profile || (profile.role !== "livreur" && profile.role !== "admin")) {
        return (
            <div style={styles.page}>
                <div style={styles.container}>
                    <div style={styles.formCard}>
                        <h2 style={styles.title}>🚚 Devenir Livreur</h2>
                        <p style={styles.subtitle}>
                            Rejoignez l'équipe ViteVendu et commencez à livrer des commandes près de chez vous.
                        </p>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>👤 Nom complet</label>
                            <input
                                type="text"
                                placeholder="Ex : Kouassi Koffi"
                                style={styles.input}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>📧 Adresse Gmail</label>
                            <input
                                type="email"
                                placeholder="Ex : exemple@gmail.com"
                                style={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>🎂 Âge</label>
                            <input
                                type="number"
                                placeholder="Ex : 25"
                                style={styles.input}
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>📞 Numéro WhatsApp</label>
                            <input
                                type="tel"
                                placeholder="Ex : 07XXXXXXXX"
                                style={styles.input}
                                value={whatsappNum}
                                onChange={(e) => setWhatsappNum(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>📍 Ville / Commune</label>
                            <input
                                type="text"
                                placeholder="Ex : Abidjan - Cocody"
                                style={styles.input}
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>🛵 Moyen de transport</label>
                            <select
                                style={styles.select}
                                value={transport}
                                onChange={(e) => setTransport(e.target.value)}
                            >
                                <option value="">Choisir...</option>
                                <option>Moto</option>
                                <option>Voiture</option>
                                <option>Vélo</option>
                                <option>Scooter</option>
                                <option>À pied</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>🕒 Disponibilité</label>
                            <select
                                style={styles.select}
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value)}
                            >
                                <option value="">Choisir...</option>
                                <option>Temps plein</option>
                                <option>Temps partiel</option>
                                <option>Week-end uniquement</option>
                                <option>Soir uniquement</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>🚀 Expérience (optionnel)</label>
                            <textarea
                                placeholder="Parlez-nous de votre expérience..."
                                style={styles.textarea}
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                            />
                        </div>

                        <button onClick={handleWhatsAppSubmit} style={styles.btnWhatsApp}>
                            💬 Envoyer ma candidature via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- PAGE LIVREUR (DESIGN COMPLET ESPACE PRO) ---
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h2 style={{ ...styles.title, marginBottom: 20, textAlign: "left" }}>🚚 Espace Livreur</h2>

                {orders.length === 0 ? (
                    <div style={styles.emptyBox}>Aucune commande disponible pour le moment.</div>
                ) : (
                    orders.map((o) => {
                        let items = [];
                        try { items = typeof o.items === "string" ? JSON.parse(o.items) : o.items || []; } catch (e) { items = []; }
                        const shipping = o.shipping_details || {};

                        return (
                            <div key={o.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>📦 Commande #{o.id.substring(0, 8)}</h3>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: o.status === "livraison" ? "#fef3c7" : "#e0f2fe",
                                        color: o.status === "livraison" ? "#b45309" : "#0369a1"
                                    }}>
                                        {o.status}
                                    </span>
                                </div>

                                <div style={styles.infoBox}>
                                    <p style={styles.infoText}><b>👤 Destinataire :</b> {shipping.name || "Non défini"}</p>
                                    <p style={styles.infoText}><b>📞 Téléphone :</b> {shipping.phone || "Non défini"}</p>
                                    <p style={styles.infoText}><b>📍 Zone :</b> {o.shipping_location || "Non défini"}</p>
                                    <p style={styles.infoText}><b>🏠 Adresse :</b> {shipping.address || "Non défini"}</p>
                                    <p style={styles.infoText}><b>🧭 Repère :</b> {shipping.landmark || "Aucun"}</p>
                                </div>

                                <h4 style={styles.sectionLabel}>🛒 Articles à livrer :</h4>
                                {items.map((item, i) => (
                                    <div key={i} style={styles.item}>
                                        <img src={item.image || "https://via.placeholder.com/60"} style={styles.img} alt={item.title} />
                                        <div style={styles.itemDetails}>
                                            <b style={{ color: colors.text }}>{item.title}</b>
                                            <span style={styles.itemMeta}>
                                                Taille/Pointure : {item.size || item.pointure || "N/A"} | Qté : {item.quantity}
                                            </span>
                                            <b style={{ color: colors.blue }}>{item.price} FCFA</b>
                                        </div>
                                    </div>
                                ))}

                                <div style={styles.cardFooter}>
                                    <span style={styles.totalText}>Montant à percevoir :</span>
                                    <span style={styles.totalAmount}>{o.total} FCFA</span>
                                </div>

                                <button onClick={() => trackingOrderId === o.id ? updateStatus(o.id, "terminée") : startTracking(o.id)}
                                    style={{ ...styles.btnAction, background: trackingOrderId === o.id ? colors.green : colors.blue }}>
                                    {trackingOrderId === o.id ? "✅ Terminer la livraison" : "🚚 Accepter la commande"}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// 🎨 NOUVEAU DESIGN SYSTEM CONSOLIDÉ
const styles = {
    page: { minHeight: "100vh", background: colors.bg, padding: "24px 16px", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "system-ui, sans-serif" },
    container: { width: "100%", maxWidth: "480px" },
    formCard: { background: colors.white, padding: "28px", borderRadius: "20px", boxShadow: "0 4px 18px rgba(15, 23, 42, 0.04)", border: `1px solid ${colors.border}` },
    title: { color: colors.text, fontSize: "24px", fontWeight: "700", textAlign: "center", margin: "0 0 8px 0" },
    subtitle: { color: colors.muted, fontSize: "14px", textAlign: "center", margin: "0 0 24px 0", lineHeight: "1.5" },
    card: { background: colors.white, padding: "20px", borderRadius: "16px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)", border: `1px solid ${colors.border}` },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
    cardTitle: { color: colors.text, fontSize: "16px", fontWeight: "600", margin: 0 },
    badge: { padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: "600", textTransform: "capitalize" },
    inputGroup: { marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" },
    label: { color: colors.text, fontSize: "14px", fontWeight: "600" },
    input: { width: "100%", padding: "12px", borderRadius: "10px", border: `1px solid ${colors.border}`, boxSizing: "border-box", fontSize: "15px", color: colors.text, background: "#fff" },
    select: { width: "100%", padding: "12px", borderRadius: "10px", border: `1px solid ${colors.border}`, boxSizing: "border-box", fontSize: "15px", color: colors.text, background: "#fff" },
    textarea: { width: "100%", padding: "12px", borderRadius: "10px", border: `1px solid ${colors.border}`, boxSizing: "border-box", fontSize: "15px", color: colors.text, background: "#fff", height: "90px", resize: "none" },
    infoBox: { background: "#f1f5f9", padding: "14px", borderRadius: "12px", marginBottom: "16px", borderLeft: `4px solid ${colors.blue}`, display: "flex", flexDirection: "column", gap: "6px" },
    infoText: { color: colors.text, fontSize: "14px", margin: 0 },
    sectionLabel: { color: colors.muted, fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 10px 0" },
    item: { display: "flex", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${colors.border}` },
    img: { width: 64, height: 64, borderRadius: 10, objectFit: "cover", background: "#eaeaea" },
    itemDetails: { display: "flex", flexDirection: "column", gap: "2px", fontSize: "14px" },
    itemMeta: { color: colors.muted, fontSize: "12px" },
    cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0", padding: "12px 0", borderTop: `1px solid ${colors.border}` },
    totalText: { color: colors.muted, fontSize: "14px" },
    totalAmount: { color: colors.text, fontSize: "18px", fontWeight: "700" },
    btnAction: { width: "100%", padding: "14px", borderRadius: "12px", border: "none", color: "#fff", fontWeight: "600", fontSize: "15px", cursor: "pointer", transition: "background 0.2s" },
    btnWhatsApp: { display: "block", width: "100%", border: "none", textAlign: "center", background: colors.orange, color: "#fff", padding: "14px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "15px", marginTop: "8px", cursor: "pointer" },
    center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: colors.bg, color: colors.text, fontSize: "16px", fontFamily: "system-ui" },
    emptyBox: { textAlign: "center", padding: "40px 20px", background: colors.white, borderRadius: "16px", color: colors.muted, border: `1px solid ${colors.border}` }
};