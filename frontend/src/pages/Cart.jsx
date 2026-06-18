import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { supabase } from "../supabaseClient";

export default function Cart({ user }) {
    const navigate = useNavigate();

    const {
        cart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        increaseQuantity // 🔥 Récupération directe si elle existe dans le store
    } = useCartStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shippingLocation, setShippingLocation] = useState("abidjan");

    // 📦 ÉTATS POUR LES VRAIES INFOS DE LIVRAISON
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerDistrict, setCustomerDistrict] = useState("");
    const [customerLandmark, setCustomerLandmark] = useState("");

    const subTotal = getTotalPrice();
    const shippingFee = shippingLocation === "abidjan" ? 1500 : 2500;
    const totalPrice = subTotal + shippingFee;

    const handleCheckout = async () => {

        const handleCheckout = async () => {
            if (!cart.length) return;

            if (!customerName || !customerPhone || !customerAddress || !customerDistrict) {
                alert("Remplis toutes les infos de livraison");
                return;
            }

            setIsProcessing(true);

            try {
                // FORMAT CART
                const formattedCart = cart.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: Number(item.price),
                    quantity: Number(item.quantity || 1),
                    size: item.size || item.pointure || null,
                    clothSize: item.clothSize || null,
                    color: item.color || null,
                    image: item.image || null
                }));

                // SHIPPING
                const shipping_details = {
                    name: customerName.trim(),
                    phone: customerPhone.trim(),
                    address: customerAddress.trim(),
                    district: customerDistrict.trim(),
                    landmark: customerLandmark.trim()
                };

                console.log("ORDER SENT:", {
                    cart: formattedCart,
                    user_id: user.id
                });
                const subTotal = getTotalPrice();
                const shippingFee = shippingLocation === "abidjan" ? 1500 : 2500;
                const totalPrice = subTotal + shippingFee;

                // INSERT ORDER
                const { data, error } = await supabase.from("orders").insert([
                    {
                        user_id: user.id,
                        items: formattedCart,
                        shipping_details,
                        shipping_location: shippingLocation,
                        payment_method: paymentMethod,
                        total: totalPrice,
                        status: "pending"
                    }
                ]).select();

                if (error) {
                    console.log(error);
                    alert("Erreur commande");
                    return;
                }

                // NOTIFICATION
                await supabase.from("notifications").insert([
                    {
                        user_id: user.id,
                        message: "📦 Commande envoyée au livreur"
                    }
                ]);

                clearCart();
                alert("Commande envoyée avec succès 🚚");
                navigate("/");

            } catch (err) {
                console.error(err);
                alert("Erreur serveur");
            } finally {
                setIsProcessing(false);
            }
        };


        if (!cart.length) return;

        // 🚨 Validation stricte des champs obligatoires
        if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !customerDistrict.trim()) {
            alert("Veuillez remplir toutes les informations de livraison obligatoires (Nom, Téléphone, Quartier/Ville et Adresse).");
            return;
        }

        setIsProcessing(true);

        try {
            // ✨ Définition et formatage propre du panier avant envoi
            const formattedCart = cart.map(item => ({
                id: item.id,
                title: item.title,
                price: Number(item.price),
                quantity: Number(item.quantity || 1),
                size: item.size || null,
                clothSize: item.clothSize || null,
                color: item.color || null,
                image: item.image || null
            }));

            // 1️⃣ CREATE ORDER
            const orderRes = await fetch(
                "https://lahinfodbprtocyavgod.supabase.co/functions/v1/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
                        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        cart: formattedCart,
                        user_id: user.id,
                        payment_method: paymentMethod,

                        shipping_location: shippingLocation,
                        shipping_fee: shippingFee,

                        total_price: totalPrice,

                        shipping_details: {
                            name: customerName.trim(),
                            phone: customerPhone.trim(),
                            address: customerAddress.trim(),
                            district: customerDistrict.trim(),
                            landmark: customerLandmark.trim()
                        }
                    })
                }
            );

            const orderData = await orderRes.json();
            console.log("ORDER RESPONSE:", orderData);

            if (!orderData.success || !orderData.order_id) {
                alert("🎉 Commande validée ! Le vendeur vous contactera pour la livraison.");
                return;
            }

            // 🔔 NOTIFICATION CLIENT
            await supabase.from("notifications").insert([
                {
                    user_id: user.id,
                    message: "📦 Votre commande a été confirmée"
                }
            ]);

            // 2️⃣ CREATE PAYMENT
            const paymentRes = await fetch(
                "https://lahinfodbprtocyavgod.supabase.co/functions/v1/create-payment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
                        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        cart: formattedCart,
                        user_id: user.id,
                        order_id: orderData.order_id,
                        payment_method: paymentMethod
                    })
                }
            );

            const paymentData = await paymentRes.json();
            console.log("PAYMENT RESPONSE:", paymentData);

            if (paymentMethod === "cod") {
                alert("Commande confirmée ✔ Vos informations ont été transmises au service de livraison.");
                clearCart();
                navigate("/");
                return;
            }

            if (paymentData.payment_url) {
                window.location.href = paymentData.payment_url;
            } else {
                alert("Le lien de paiement en ligne n'a pas pu être généré.");
            }

        } catch (err) {
            console.error(err);
            alert("Une erreur est survenue lors de la validation.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={styles.page}>

            {/* 🔙 HEADER */}
            <header style={styles.header}>
                <button onClick={() => navigate("/")} style={styles.backBtn}>
                    ← Boutique
                </button>
                <h2 style={styles.headerTitle}>Mon Panier</h2>
                <span style={styles.countBadge}>{cart.reduce((acc, item) => acc + (item.quantity || 1), 0)} articles</span>
            </header>

            <main style={styles.mainLayout}>

                {cart.length === 0 ? (
                    <div style={styles.empty}>
                        <span style={{ fontSize: "64px" }}>🛍️</span>
                        <h3 style={{ margin: "15px 0 5px 0", fontSize: "18px", fontWeight: "700" }}>Votre panier est vide</h3>
                        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Découvrez nos articles et commencez vos achats.</p>
                        <button onClick={() => navigate("/")} style={styles.shopBtn}>
                            Retourner à l'accueil
                        </button>
                    </div>
                ) : (

                    <div style={styles.contentGrid}>

                        {/* 📦 LISTE DES PRODUITS */}
                        <div style={styles.itemsList}>

                            {cart.map(item => {
                                console.log("CART ITEM:", item); // 🔍 debug

                                return (
                                    <div
                                        key={`${item.id}-${item.size || ""}-${item.color || ""}-${item.clothSize || ""}`}
                                        style={styles.card}
                                    >

                                        <div style={styles.productInfo}>
                                            <img
                                                src={item.image || "https://via.placeholder.com/70"}
                                                alt={item.title}
                                                style={styles.itemImage}
                                            />

                                            <div>
                                                <h4 style={styles.itemTitle}>{item.title}</h4>

                                                {/* 👟 CHAUSSURES */}
                                                {item.size && (
                                                    <p style={styles.itemSize}>
                                                        👟 Pointure : <strong>{item.size}</strong>
                                                    </p>
                                                )}

                                                {/* 👕 HABITS */}
                                                {item.clothSize && (
                                                    <p style={styles.itemSize}>
                                                        👕 Taille : <strong>{item.clothSize}</strong>
                                                    </p>
                                                )}

                                                {/* 🎨 COULEUR */}
                                                {item.color && (
                                                    <p style={styles.itemSize}>
                                                        🎨 Couleur : <strong>{item.color}</strong>
                                                    </p>
                                                )}

                                                {/* 📦 QUANTITÉ */}
                                                <p style={styles.itemSize}>
                                                    📦 Quantité : <strong>{item.quantity || 1}</strong>
                                                </p>

                                                {/* 💰 PRIX */}
                                                <p style={styles.itemPrice}>
                                                    {Number(item.price).toLocaleString()} FCFA
                                                </p>

                                                {/* 🧾 TOTAL */}
                                                <p style={styles.orderLine}>
                                                    <strong>Total Produit :</strong>{" "}
                                                    {(Number(item.price) * (item.quantity || 1)).toLocaleString()} FCFA
                                                </p>
                                            </div>
                                        </div>

                                        <div style={styles.rightActions}>
                                            <div style={styles.qtyBox}>
                                                <button onClick={() => decreaseQuantity(item)}>-</button>
                                                <span>{item.quantity || 1}</span>
                                                {/* ✅ Syntaxe nettoyée et propre pour l'incrémentation */}
                                                <button onClick={() => increaseQuantity ? increaseQuantity(item) : addToCart(item)}>+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item)}>🗑️</button>
                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                        {/* 💳 COORDONNÉES, ZONE DE LIVRAISON & FACTURATION */}
                        <div style={styles.summaryBox}>
                            <h3 style={styles.summaryTitle}>Détails de la livraison</h3>

                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>Nom & Prénoms *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Kouassi Koffi"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    style={styles.inputField}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>Numéro de Téléphone *</label>
                                <input
                                    type="tel"
                                    placeholder="Ex: 0707XXXXXX"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    style={styles.inputField}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>Quartier / Ville *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Cocody Angré / Bouaké"
                                    value={customerDistrict}
                                    onChange={(e) => setCustomerDistrict(e.target.value)}
                                    style={styles.inputField}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>Adresse précise (Rue, Porte, Face à...) *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Cité CNPS, Bâtiment H, Appt 24"
                                    value={customerAddress}
                                    onChange={(e) => setCustomerAddress(e.target.value)}
                                    style={styles.inputField}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>Point de repère (Optionnel)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Près de la pharmacie des Allées"
                                    value={customerLandmark}
                                    onChange={(e) => setCustomerLandmark(e.target.value)}
                                    style={styles.inputField}
                                />
                            </div>

                            <hr style={styles.divider} />

                            <label style={styles.selectLabel}>Zone de destination :</label>
                            <select
                                value={shippingLocation}
                                onChange={(e) => setShippingLocation(e.target.value)}
                                style={styles.paymentSelect}
                            >
                                <option value="abidjan">📍 Abidjan (Ville) — 1 500 FCFA</option>
                                <option value="interieur">🌍 Hors Abidjan (Intérieur) — 2 500 FCFA</option>
                            </select>

                            <div style={styles.deliveryInfoBox}>
                                <div style={styles.deliveryRowDetail}>
                                    <span>⏱️ Délai de réception estimé :</span>
                                    <strong>{shippingLocation === "abidjan" ? "2 jours ouvrés" : "3 jours ouvrés"}</strong>
                                </div>
                            </div>

                            <label style={styles.selectLabel}>Mode de réglage :</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                style={styles.paymentSelect}
                            >
                                <option value="cod">🚚 Paiement cash à la livraison</option>
                                <option value="wave">💙 Wave Money (1)</option>
                                <option value="orange">🧡 Orange Money (2)</option>
                            </select>

                            {paymentMethod === "cod" && (
                                <div style={styles.codAlert}>
                                    👍 Mode choisi : Vous règlerez la somme finale au livreur à l'arrivée.
                                </div>
                            )}

                            <hr style={styles.divider} />

                            <div style={styles.summaryRow}>
                                <span>Sous-total</span>
                                <span>{subTotal.toLocaleString()} FCFA</span>
                            </div>

                            <div style={styles.summaryRow}>
                                <span>Livraison</span>
                                <span>{shippingFee.toLocaleString()} FCFA</span>
                            </div>

                            <div style={styles.totalRow}>
                                <span>Total Net à Payer</span>
                                <span style={styles.totalAmount}>{totalPrice.toLocaleString()} FCFA</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                style={{
                                    ...styles.payBtn,
                                    background: isProcessing ? "#94a3b8" : "#10b981",
                                    cursor: isProcessing ? "not-allowed" : "pointer"
                                }}
                            >
                                {isProcessing ? "Validation en cours..." : "Confirmer et Commander"}
                            </button>

                            <button onClick={clearCart} style={styles.clearBtn}>
                                Vider le panier
                            </button>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}

/* ===== STYLES AMÉLIORÉS ET PROPRES ===== */
const styles = {
    page: {
        padding: "90px 24px 40px 24px",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        color: "#0f172a"
    },
    header: {
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 24px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    },
    backBtn: {
        background: "none",
        border: "none",
        color: "#64748b",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "14px"
    },
    headerTitle: {
        fontSize: "16px",
        fontWeight: "700",
        margin: "0 auto 0 20px",
        color: "#1e293b"
    },
    countBadge: {
        background: "#f1f5f9",
        color: "#475569",
        fontSize: "13px",
        padding: "4px 10px",
        borderRadius: "12px",
        fontWeight: "600"
    },
    mainLayout: {
        maxWidth: "1100px",
        margin: "0 auto",
    },
    contentGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "28px",
        alignItems: "flex-start"
    },
    itemsList: {
        flex: "1 1 500px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    card: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.01)",
    },
    productInfo: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    itemImage: {
        width: "70px",
        height: "70px",
        objectFit: "contain",
        background: "#f8fafc",
        borderRadius: "12px",
        padding: "4px",
        border: "1px solid #f1f5f9"
    },
    itemTitle: {
        margin: "0 0 4px 0",
        fontSize: "15px",
        fontWeight: "700",
        color: "#1e293b"
    },
    itemSize: {
        margin: "0 0 4px 0",
        fontSize: "12px",
        color: "#64748b"
    },
    itemPrice: {
        margin: 0,
        fontSize: "14px",
        fontWeight: "700",
        color: "#10b981"
    },
    rightActions: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    qtyBox: {
        display: "flex",
        alignItems: "center",
        background: "#f1f5f9",
        padding: "4px",
        borderRadius: "10px",
        gap: "4px"
    },
    qtyBtn: {
        background: "#ffffff",
        border: "none",
        width: "28px",
        height: "28px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px",
    },
    qtyValue: {
        fontSize: "14px",
        fontWeight: "700",
        minWidth: "24px",
        textAlign: "center"
    },
    deleteBtn: {
        background: "#fef2f2",
        border: "none",
        cursor: "pointer",
        padding: "8px 10px",
        borderRadius: "10px",
        fontSize: "14px",
    },
    summaryBox: {
        flex: "1 1 420px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.01)"
    },
    summaryTitle: {
        margin: "0 0 20px 0",
        fontSize: "16px",
        fontWeight: "700",
        color: "#1e293b"
    },
    formGroup: {
        marginBottom: "14px"
    },
    inputLabel: {
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        marginBottom: "6px",
        color: "#475569"
    },
    inputField: {
        width: "100%",
        padding: "11px 14px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        outline: "none",
        fontFamily: "inherit",
        boxSizing: "border-box"
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        color: "#475569",
        marginBottom: "10px"
    },
    selectLabel: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#475569",
        display: "block",
        marginBottom: "6px"
    },
    paymentSelect: {
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        background: "#fff",
        fontSize: "14px",
        fontWeight: "600",
        outline: "none",
        color: "#0f172a",
        marginBottom: "14px",
        fontFamily: "inherit"
    },
    codAlert: {
        marginTop: "4px",
        marginBottom: "14px",
        background: "#f0fdf4",
        color: "#166534",
        padding: "10px 12px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "500",
        border: "1px solid #dcfce7"
    },
    deliveryInfoBox: {
        background: "#f8fafc",
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0",
        marginBottom: "14px"
    },
    deliveryRowDetail: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        color: "#475569",
    },
    divider: {
        border: "none",
        borderTop: "1px solid #e2e8f0",
        margin: "20px 0"
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    totalAmount: {
        fontSize: "20px",
        fontWeight: "800",
        color: "#0f172a"
    },
    payBtn: {
        color: "#fff",
        padding: "16px",
        border: "none",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "15px",
        width: "100%",
        cursor: "pointer",
        boxSizing: "border-box"
    },
    clearBtn: {
        background: "none",
        border: "none",
        color: "#ef4444",
        fontSize: "13px",
        fontWeight: "600",
        width: "100%",
        marginTop: "14px",
        cursor: "pointer"
    },
    empty: {
        textAlign: "center",
        padding: "60px 20px",
        background: "#ffffff",
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        maxWidth: "450px",
        margin: "40px auto 0 auto"
    },
    shopBtn: {
        background: "#2563eb",
        color: "#ffffff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        fontWeight: "600",
        fontSize: "14px",
        cursor: "pointer",
        marginTop: "15px"
    },
    orderDetails: {
        marginTop: "8px",
        background: "#f8fafc",
        padding: "8px",
        borderRadius: "10px",
        border: "1px solid #e2e8f0"
    },
    orderLine: {
        margin: "4px 0",
        fontSize: "13px",
        color: "#334155"
    }
};