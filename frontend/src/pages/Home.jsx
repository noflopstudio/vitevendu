import { PushNotifications } from '@capacitor/push-notifications';
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useCartStore } from "../store/cartStore";
import MobileMenu from "../components/MobileMenu";

function ProductCard({ ad, navigate }) {
    const [isHovered, setIsHovered] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    const openChat = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
            alert("Vous devez être connecté");
            navigate("/login");
            return;
        }

        const sellerId = ad?.user_id;
        const adId = ad?.id;
        const buyerId = user?.id;

        if (!sellerId || !adId || !buyerId) {
            console.log("Données manquantes :", { sellerId, adId, buyerId, ad });
            alert("Erreur annonce invalide");
            return;
        }

        if (sellerId === buyerId) {
            alert("Vous ne pouvez pas discuter avec vous-même");
            return;
        }

        let { data: conv, error: convError } = await supabase
            .from("conversations")
            .select("*")
            .eq("ad_id", adId)
            .eq("buyer_id", buyerId)
            .eq("seller_id", sellerId)
            .maybeSingle();

        if (convError) {
            console.log("Erreur recherche conversation :", convError);
            alert("Erreur conversation");
            return;
        }

        if (!conv) {
            const { data: newConv, error } = await supabase
                .from("conversations")
                .insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }])
                .select()
                .single();

            if (error) {
                console.log("Erreur création conversation :", error);
                alert("Impossible de créer la conversation");
                return;
            }
            conv = newConv;
        }

        if (!conv?.id) {
            alert("Conversation invalide");
            return;
        }

        navigate(`/chat/${conv.id}`);
    };

    const currentPrice = Number(ad?.price || 0);
    const oldPrice = Number(ad?.old_price || 0);
    let discountBadge = null;

    if (oldPrice > currentPrice && currentPrice > 0) {
        const discountPercentage = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
        discountBadge = `-${discountPercentage}%`;
    }

    return (
        <div
            onClick={() =>
                navigate(`/product/${ad.id}`, {
                    state: { product: ad }
                })
            }
            style={{
                ...styles.card,
                cursor: "pointer",
                transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: isHovered
                    ? "0 12px 24px rgba(0, 0, 0, 0.06)"
                    : "0 2px 8px rgba(0, 0, 0, 0.02)"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* IMAGE PRODUIT */}
            <div style={{ ...styles.imageWrapper, position: "relative" }}>
                {ad.image ? (
                    <img
                        src={ad.image}
                        alt={ad.title || "Produit"}
                        style={{
                            ...styles.cardImage,
                            transform: isHovered ? "scale(1.05)" : "scale(1)",
                            transition: "transform 0.25s ease"
                        }}
                    />
                ) : (
                    <div style={styles.noImage}>📷 Pas de visuel</div>
                )}

                {oldPrice > currentPrice && currentPrice > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "800",
                            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                            zIndex: 10
                        }}
                    >
                        🔥 {discountBadge}
                    </div>
                )}
            </div>

            {/* CONTENU CARTE */}
            <div style={styles.cardBody}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                        {ad.title || "Sans titre"}
                    </h3>

                    <div style={styles.priceContainer}>
                        <span style={styles.cardPrice}>
                            {ad.price
                                ? `${Number(ad.price).toLocaleString()} FCFA`
                                : "Prix non défini"}
                        </span>

                        {oldPrice > currentPrice && (
                            <span style={styles.cardOldPrice}>
                                {oldPrice.toLocaleString()} F
                            </span>
                        )}
                    </div>
                </div>

                <p style={styles.cardDesc}>
                    {ad.description || "Aucune description disponible"}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openChat();
                    }}
                    style={styles.chatBtn}
                >
                    💬 Discuter
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(ad);
                        alert(`🛍️ ${ad.title || "Produit"} ajouté au panier !`);
                    }}
                    style={styles.cartBtn}
                >
                    🛒 Ajouter au panier
                </button>
            </div>
        </div>
    );
}
export default function Home({ ads = [], user, profile }) {

    useEffect(() => {
        const createProfile = async () => {

            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;

            if (!user) return;

            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id, role")
                .eq("id", user.id)
                .maybeSingle();

            if (existingProfile) return;

            const { error } = await supabase.from("profiles").insert({
                id: user.id,
                email: user.email,
                username: user.email?.split("@")[0] || "user",
                role: "client", // ✅ TOUJOURS client au début
                subscription_status: "active"
            });

            if (error) {
                console.log("PROFILE CREATE ERROR:", error);
            }
        };

        createProfile();
    }, []);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState("home");
    const [currentPromo, setCurrentPromo] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationState, setAnimationState] = useState("visible");

    const cart = useCartStore((state) => state.cart || state.items || []);
    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const [searchQuery, setSearchQuery] = useState("");

    const promoSlides = [
        { type: "image", src: "/hotel.jpeg", title: "Publiez votre annonce ici 🚀" },
        { type: "image", src: "/ggb.jpeg", title: "Créez votre boutique gratuitement 💎" },
        { type: "video", src: "/partenaire.mp4", title: "Découvrez ViteVendu 🎥" }
    ];

    const middlePromo = {
        type: "image",
        src: "/Logo vvendu.jpeg",
        title: "Boostez vos ventes ! Devenez partenaire VendiPro 🎯"
    };

    const marketingMessages = [
        { text: "Le commerce en direct, sans intermédiaire.", color: "linear-gradient(135deg, #2563eb, #1e40af)" }, // Bleu
        { text: "Créez votre micro-boutique en moins de 2 minutes.", color: "linear-gradient(135deg, #10b981, #059669)" }, // Vert émeraude
        { text: "Discutez instantanément via WhatsApp.", color: "linear-gradient(135deg, #2563eb, #1e40af)" }, // Bleu
        { text: "Zéro commission, 100% de vos gains en poche.", color: "linear-gradient(135deg, #f97316, #ea580c)" } // Orange
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promoSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [promoSlides.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationState("leaving");
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % marketingMessages.length);
                setAnimationState("entering");
                setTimeout(() => {
                    setAnimationState("visible");
                }, 50);
            }, 400);
        }, 4000);
        return () => clearInterval(interval);
    }, [marketingMessages.length]);

    useEffect(() => {

        if (Capacitor.getPlatform() === "web") return;

        const initPush = async () => {

            try {
                const result = await PushNotifications.requestPermissions();

                if (result.receive === "granted") {
                    await PushNotifications.register();
                }

            } catch (err) {
                console.log("❌ PUSH ERROR:", err);
            }
        };

        initPush();

        PushNotifications.addListener("registration", (token) => {
            console.log("🔥 TOKEN OK:", token.value);
        });

        PushNotifications.addListener("registrationError", (err) => {
            console.log("❌ ERROR PUSH:", err);
        });

    }, []);

    const handleNavClick = (section) => {
        setActiveSection(section);
        if (section === "home") navigate("/");
        else navigate(`/${section}`);
    };

    const filteredAds = ads.filter((ad) => {
        const titleMatch = ad.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = ad.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
    });

    const firstSevenAds = filteredAds.slice(0, 7);

    const adsUntilTwentyOne = filteredAds.slice(7, 21);

    const remainingAds = filteredAds.slice(21);

    return (

        <div style={styles.pageWrapper}>

            <a
                href="https://wa.me/250748922397"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: "fixed",
                    bottom: "15px",
                    right: "15px",
                    backgroundColor: "#25D366",
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                    zIndex: 9999,
                    cursor: "pointer",
                    transition: "transform 0.2s ease"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="white"
                    style={{ width: "22px", height: "22px" }}
                >
                    <path d="M19.11 17.53c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.12-.41-2.14-1.31-.79-.7-1.32-1.57-1.48-1.84-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.65 1.12 2.83c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.02 3C9.38 3 4 8.25 4 14.71c0 2.6.87 5 2.35 6.94L5 29l7.54-1.95c1.83.96 3.91 1.5 6.1 1.5 6.64 0 12.02-5.25 12.02-11.71C30.66 8.25 25.28 3 18.64 3h-2.62z" />
                </svg>
            </a>

            <header style={styles.header}>
                <div style={styles.mobileNavContainer}>
                    <div style={styles.singleRowNav}>

                        <img
                            src="/icon-512.png"
                            alt="Logo"
                            onClick={() => handleNavClick("home")}
                            style={{
                                width: "42px",
                                height: "42px",
                                objectFit: "contain",
                                cursor: "pointer",
                                transition: "0.2s ease"
                            }}
                        />

                        <button
                            onClick={() => navigate("/cart")}
                            style={{
                                background: cartCount > 0 ? "#10b981" : "#f1f5f9",
                                border: "none",
                                color: cartCount > 0 ? "#ffffff" : "#475569",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                fontWeight: "700",
                                fontSize: "11px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ width: "14px", height: "14px" }}
                            >
                                <circle cx="8" cy="21" r="1" />
                                <circle cx="19" cy="21" r="1" />
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                            <span>{cartCount > 0 ? `Panier (${cartCount})` : "Vide"}</span>
                        </button>
                        <a
                            href="/app.apk"
                            download="ViteVendu.apk"
                            style={{
                                background: "#f1f5f9",
                                border: "none",
                                color: "#475569",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                fontWeight: "700",
                                fontSize: "11px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                cursor: "pointer",
                                textDecoration: "none"
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ width: "14px", height: "14px" }}
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>

                            Télécharger
                        </a>

                        {/* BOUTON CONNEXION */}
                        {!user && (
                            <button
                                onClick={() => navigate("/login")}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #e2e8f0",
                                    color: "#475569",
                                    padding: "6px 10px",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    fontSize: "11px",
                                    cursor: "pointer"
                                }}
                            >
                                🔐 Connexion
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* 🔥 MENU AJOUTÉ ICI (IMPORTANT) */}
            <MobileMenu user={user} profile={profile} />

            {/* ================= MAIN CONTENT ================= */}
            <main style={styles.mainContent}>
                <div style={styles.container}>


                    {/* ================= WELCOME SECTION FIXE AVEC EFFET LUMIÈRE ================= */}
                    <>
                        <style>{`
        @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        .shimmer-text {
            background: linear-gradient(90deg, #4f46e5 0%, #10b981 25%, #ffffff 50%, #10b981 75%, #4f46e5 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 4s linear infinite;
        }
    `}</style>

                        <div style={{
                            position: "sticky",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: "#ffffff",
                            textAlign: "center",
                            padding: "24px 16px",
                            marginTop: "-10px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            borderBottom: "1px solid #f1f5f9"
                        }}>
                            <h1 className="shimmer-text" style={{
                                fontSize: "50px",
                                fontWeight: "900",
                                margin: 0,
                                letterSpacing: "-0.5px"
                            }}>
                                Bienvenue sur Vite Vendu 🚀
                            </h1>

                            <p style={{
                                marginTop: "8px",
                                fontSize: "14px",
                                color: "#64748b",
                                fontWeight: "500",
                                maxWidth: "450px",
                                marginRight: "auto",
                                marginLeft: "auto",
                                lineHeight: "1.4"
                            }}>
                                Achetez, vendez et discutez directement avec les vendeurs en toute simplicité
                            </p>
                        </div>
                    </>
                    {/* PREMIÈRE BANNIÈRE PUBLICITAIRE (HAUT) */}
                    <div style={styles.pubContainer}>
                        {promoSlides[currentPromo].type === "image" ? (
                            <img src={promoSlides[currentPromo].src} alt="Publicité" style={styles.pubImage} />
                        ) : (
                            <video src={promoSlides[currentPromo].src} autoPlay muted loop controls style={styles.pubVideo} />
                        )}
                        <div style={styles.pubOverlay}>
                            <h2 style={styles.pubTitle}>{promoSlides[currentPromo].title}</h2>
                        </div>
                    </div>

                    {/* CORPS PRINCIPAL ACCUEIL */}
                    {activeSection === "home" && (
                        <>
                            <div style={styles.heroSection}>
                                <h1 style={styles.heroTitleWrapper}>
                                    <div style={{
                                        width: "100%",
                                        backgroundImage: marketingMessages[currentIndex].color,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        display: "inline-block",
                                        transition: "transform 0.4s ease, opacity 0.4s ease",
                                        opacity: animationState === "visible" ? 1 : 0,
                                        transform: animationState === "visible" ? "translateY(0)" : animationState === "leaving" ? "translateY(-20px)" : "translateY(20px)"
                                    }}>
                                        {marketingMessages[currentIndex].text}
                                    </div>
                                </h1>
                                <p style={styles.heroSubtitle}>
                                    Explorez les catalogues de nos marchands locaux, découvrez des produits uniques et échangez directement sans intermédiaire.
                                </p>
                            </div>

                            {/* ================= BARRE DE RECHERCHE INTEGRÉE ================= */}
                            <div style={styles.searchContainer}>
                                <div style={styles.searchBarWrapper}>
                                    <span style={styles.searchIcon}>🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Que recherchez-vous aujourd'hui ?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={styles.searchInput}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            style={styles.clearSearchBtn}
                                            title="Effacer la recherche"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {filteredAds.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>🔍</span>
                                    <p style={{ margin: 0, fontWeight: "600", color: "#1e293b" }}>Aucun produit ne correspond à votre recherche.</p>
                                </div>
                            ) : (
                                <>
                                    {/* BLOC DES 7 PREMIÈRES ANNONCES */}
                                    <div id="plus-offres" style={styles.categoryBlock}>
                                        <h2 style={styles.categoryTitle}>
                                            {searchQuery
                                                ? `🔍 Résultats de recherche (${filteredAds.length})`
                                                : "🔥 Les nouveautés"}
                                        </h2>

                                        <div style={styles.grid}>
                                            {firstSevenAds.map((ad) => (
                                                <ProductCard
                                                    key={ad.id}
                                                    ad={ad}
                                                    navigate={navigate}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* DEUXIÈME BANNIÈRE PUBLICITAIRE */}
                                    <div style={{ ...styles.pubContainer, margin: "40px 0" }}>
                                        {middlePromo.type === "image" ? (
                                            <img
                                                src={middlePromo.src}
                                                alt="Publicité Partenaire"
                                                style={styles.pubImage}
                                            />
                                        ) : (
                                            <video
                                                src={middlePromo.src}
                                                autoPlay
                                                muted
                                                loop
                                                controls
                                                style={styles.pubVideo}
                                            />
                                        )}

                                        <div style={styles.pubOverlay}>
                                            <h2 style={styles.pubTitle}>{middlePromo.title}</h2>
                                        </div>
                                    </div>

                                    {/* ANNONCES 8 À 21 */}
                                    <div id="plus-offres" style={styles.categoryBlock}>
                                        <h2 style={styles.categoryTitle}>🛍️ Plus de produits</h2>

                                        <div style={styles.grid}>
                                            {adsUntilTwentyOne.map((ad) => (
                                                <ProductCard
                                                    key={ad.id}
                                                    ad={ad}
                                                    navigate={navigate}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {/* ================= BLOC PREMIUM VITEVENDU ================= */}
                                    <div
                                        style={{
                                            margin: "40px 0",
                                            padding: "35px 25px",
                                            borderRadius: "28px",
                                            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
                                            color: "#ffffff",
                                            textAlign: "center",
                                            boxShadow: "0 25px 50px rgba(37, 99, 235, 0.25)",
                                            overflow: "hidden",
                                            position: "relative",
                                            border: "1px solid rgba(255,255,255,0.08)"
                                        }}
                                    >
                                        <style>{`
        @keyframes premiumPulse {
            0%,100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.03);
            }
        }

        @keyframes premiumMarquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }

        @keyframes premiumShine {
            0% {
                left: -100%;
            }
            100% {
                left: 120%;
            }
        }

        .vv-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,0.12),
                transparent
            );
            animation: premiumShine 5s linear infinite;
        }

        .vv-title {
            font-size: 24px;
            font-weight: 900;
            margin-bottom: 12px;
            background: linear-gradient(
                135deg,
                #ffffff,
                #bfdbfe
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .vv-subtitle {
            color: #cbd5e1;
            font-size: 14px;
            line-height: 1.7;
            max-width: 650px;
            margin: 0 auto 22px auto;
        }

        .vv-marquee {
            overflow: hidden;
            background: rgba(255,255,255,0.08);
            padding: 10px;
            border-radius: 12px;
            margin-bottom: 25px;
        }

        .vv-marquee-text {
            white-space: nowrap;
            display: inline-block;
            animation: premiumMarquee 15s linear infinite;
            font-size: 12px;
            font-weight: 800;
            color: #93c5fd;
            letter-spacing: 1px;
        }

        .vv-stats {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 25px;
        }

        .vv-stat {
            background: rgba(255,255,255,0.08);
            backdrop-filter: blur(12px);
            padding: 12px 18px;
            border-radius: 14px;
            min-width: 120px;
        }

       .vv-title {
    font-size: 20px; /* Réduit de 24px à 20px pour moins de lourdeur */
    font-weight: 800; /* Un peu moins épais que 900 */
    margin-bottom: 12px;
    text-transform: none; /* Enlève les majuscules forcées */
    background: linear-gradient(135deg, #ffffff, #bfdbfe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

        .vv-stat-label {
            font-size: 11px;
            color: #cbd5e1;
            text-transform: uppercase;
        }

        .vv-button {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 26px;
            border-radius: 14px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.15);
            color: white;
            font-weight: 700;
            cursor: pointer;
            transition: all .3s ease;
            animation: premiumPulse 3s infinite;
        }

        .vv-button:hover {
            transform: translateY(-3px);
            background: rgba(255,255,255,0.18);
        }
    `}</style>

                                        <div className="vv-shine" />

                                        <h2 className="vv-title">
                                            🚀 DES MILLIERS D'OFFRES VOUS ATTENDENT
                                        </h2>

                                        <p className="vv-subtitle">
                                            Trouvez rapidement des articles neufs et d'occasion publiés par des vendeurs
                                            vérifiés partout en Côte d'Ivoire. Électronique, mode, immobilier,
                                            véhicules, maison et bien plus encore.
                                        </p>

                                        <div className="vv-marquee">
                                            <div className="vv-marquee-text">
                                                🔥 NOUVELLES ANNONCES CHAQUE JOUR • 💰 PRIX COMPÉTITIFS • ✅ VENDEURS VÉRIFIÉS • 🚚 LIVRAISON POSSIBLE • ⭐ ACHATS EN TOUTE CONFIANCE • 🔥 NOUVELLES ANNONCES CHAQUE JOUR •
                                            </div>
                                        </div>

                                        <div className="vv-stats">
                                            <div className="vv-stat">
                                                <span className="vv-stat-number">{ads.length}+</span>
                                                <span className="vv-stat-label">Annonces disponibles</span>
                                            </div>

                                            <div className="vv-stat">
                                                <span className="vv-stat-number">100%</span>
                                                <span className="vv-stat-label">Accès gratuit</span>
                                            </div>

                                            <div className="vv-stat">
                                                <span className="vv-stat-number">⚡</span>
                                                <span className="vv-stat-label">Vente rapide</span>
                                            </div>
                                        </div>

                                        <button
                                            className="vv-button"
                                            onClick={() => {
                                                document
                                                    .querySelector("#plus-offres")
                                                    ?.scrollIntoView({ behavior: "smooth" });
                                            }}
                                        >
                                            🔥 Découvrir les meilleures offres

                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* ANNONCES APRÈS */}
                                    {remainingAds.length > 0 && (
                                        <div id="plus-offres" style={styles.categoryBlock}>
                                            <h2 style={styles.categoryTitle}>
                                                ✨ Encore plus d'offres pour vous
                                            </h2>

                                            <div style={styles.grid}>
                                                {remainingAds.map((ad) => (
                                                    <ProductCard
                                                        key={ad.id}
                                                        ad={ad}
                                                        navigate={navigate}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* ================= FOOTER ================= */}
                    <footer style={styles.footer}>
                        <div style={styles.footerLinksRow}>
                            <button onClick={() => handleNavClick("contact")} style={styles.footerLink}>Contact</button>
                            <button onClick={() => handleNavClick("conditions")} style={styles.footerLink}>Conditions générales</button>
                            <button onClick={() => handleNavClick("about")} style={styles.footerLink}>À propos</button>
                            <button onClick={() => handleNavClick("blog")} style={styles.footerLink}>Blog</button>
                        </div>
                        <div style={styles.copyrightText}>
                            © 2026 ViteVendu. Tous droits réservés.
                        </div>
                    </footer>

                </div>
            </main>
        </div>
    );
}
const styles = {
    pageWrapper: { background: "#fdfdfd", minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#1e293b" },
    mainContent: { padding: "70px 16px 40px 16px" },
    container: { maxWidth: "1200px", margin: "0 auto" },
    header: { background: "rgba(255, 255, 255, 0.94)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #f1f5f9", padding: "10px 0", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
    mobileNavContainer: { maxWidth: "480px", margin: "0 auto", padding: "0 8px" },
    singleRowNav: { display: "flex", justifyContent: "center", alignItems: "center", gap: "2px", width: "100%" },
    navLink: { background: "none", border: "none", color: "#64748b", fontSize: "11px", fontWeight: "600", padding: "6px 4px", borderRadius: "5px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" },
    activeNavLink: { background: "#f1f5f9", border: "none", color: "#0f172a", fontSize: "11px", fontWeight: "700", padding: "6px 6px", borderRadius: "5px", whiteSpace: "nowrap", cursor: "pointer" },
    downloadBtnTextOnly: { background: "none", border: "none", color: "#0f172a", padding: "6px 4px", fontSize: "11px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
    loginBtnTextOnly: { background: "none", border: "none", color: "#64748b", padding: "6px 4px", fontWeight: "600", fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" },
    dashboardBtnTextOnly: { background: "none", border: "none", color: "#2563eb", padding: "6px 4px", fontWeight: "700", fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" },
    pubContainer: { width: "100%", height: "240px", borderRadius: "16px", overflow: "hidden", position: "relative", marginBottom: "32px", background: "#0f172a" },
    pubImage: { width: "100%", height: "100%", objectFit: "cover" },
    pubVideo: { width: "100%", height: "100%", objectFit: "cover" },
    pubOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)" },
    pubTitle: { color: "#ffffff", fontSize: "20px", fontWeight: "800", margin: 0 },
    heroSection: { textAlign: "center", padding: "10px 0 24px 0", maxWidth: "600px", margin: "0 auto" },
    heroTitleWrapper: { fontSize: "26px", fontWeight: "800", margin: "0 0 12px 0", lineHeight: "1.2", minHeight: "70px" },
    heroSubtitle: { fontSize: "14px", color: "#64748b", margin: 0, lineHeight: "1.5" },

    /* ===== SECTION RECHERCHE ===== */
    searchContainer: { width: "100%", maxWidth: "680px", margin: "0 auto 40px auto", padding: "0 10px", boxSizing: "border-box" },
    searchBarWrapper: { display: "flex", alignItems: "center", background: "#ffffff", borderRadius: "16px", padding: "6px 16px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.01)", border: "1px solid #e2e8f0", position: "relative" },
    searchIcon: { fontSize: "18px", marginRight: "12px", color: "#94a3b8", userSelect: "none" },
    searchInput: { flex: 1, border: "none", outline: "none", padding: "10px 0", fontSize: "15px", fontWeight: "500", color: "#0f172a", background: "transparent", fontFamily: "inherit" },
    clearSearchBtn: { background: "#f1f5f9", border: "none", color: "#64748b", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px", fontWeight: "bold", padding: 0, marginLeft: "10px", transition: "background 0.2s ease" },
    emptyState: { textAlign: "center", padding: "50px 20px", background: "#ffffff", borderRadius: "20px", border: "1px dashed #cbd5e1", margin: "30px auto", maxWidth: "500px", boxSizing: "border-box" },

    /* ===== COINS CATEGORIES & GRIDS ===== */
    categoryBlock: { marginBottom: "32px" },
    categoryTitle: { fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0", paddingBottom: "4px", borderBottom: "1px solid #f1f5f9" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginTop: "8px" },

    /* ===== CARDS AD ===== */
    card: { background: "#ffffff", borderRadius: "12px", overflow: "hidden", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
    imageWrapper: { width: "100%", height: "150px", background: "#f8fafc", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRadius: "12px" },
    cardImage: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.25s ease" },
    noImage: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "12px", background: "#f1f5f9" },
    discountTag: { position: "absolute", top: "8px", left: "8px", background: "#97ef44", color: "#ffffff", padding: "3px 7px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" },
    priceContainer: { display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" },
    cardOldPrice: { fontSize: "11px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "500" },
    cardBody: { padding: "10px", display: "flex", flexDirection: "column", flexGrow: 1 },
    cardHeader: { display: "flex", flexDirection: "column", gap: "2px" },
    cardTitle: { fontSize: "13px", fontWeight: "600", color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    cardPrice: { fontSize: "14px", fontWeight: "700", color: "#2563eb" },
    cardDesc: { fontSize: "11px", color: "#64748b", margin: "4px 0 0 0", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", height: "32px", lineHeight: "1.4" },
    chatBtn: { marginTop: "10px", width: "100%", background: "#22c55e", color: "#ffffff", border: "none", padding: "6px", borderRadius: "6px", fontWeight: "600", fontSize: "12px", cursor: "pointer" },

    /* ===== AJOUT : STYLE BOUTON PANIER ===== */
    cartBtn: { width: "100%", marginTop: "10px", padding: "10px", border: "none", borderRadius: "10px", background: "#10b981", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "12px" },

    /* ===== FOOTER ===== */
    footer: { textAlign: "center", padding: "40px 0 20px 0", borderTop: "1px solid #f1f5f9", marginTop: "48px" },
    footerLinksRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" },
    footerLink: { background: "none", border: "none", color: "#475569", fontSize: "13px", fontWeight: "600", padding: "6px 8px", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s ease" },
    copyrightText: { fontSize: "11px", color: "#94a3b8" }
};