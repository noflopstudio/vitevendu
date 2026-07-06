// 1. LES IMPORTS TOUJOURS TOUT EN HAUT DU FICHIER 
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState(location.state?.product || null);
    const [mainImage, setMainImage] = useState(
        product?.images?.[0] || product?.image || null
    );

    useEffect(() => {
        if (product) {
            setMainImage(product?.images?.[0] || product?.image || null);
        }
    }, [product]);

    let variants = {
        colors: [],
        sizes: []
    };

    try {
        if (product?.variants) {
            variants =
                typeof product.variants === "string"
                    ? JSON.parse(product.variants)
                    : product.variants;
        }
    } catch (e) {
        variants = {
            colors: [],
            sizes: []
        };
    }
    const { addToCart, cart } = useCartStore();

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // --- ÉTATS POUR LA GESTION DES AVIS ---
    const [localReviews, setLocalReviews] = useState(
        Array.isArray(product?.reviews) ? product.reviews : []
    );
    const [newAuthor, setNewAuthor] = useState("");
    const [newRating, setNewRating] = useState(5); // Note par défaut à 5
    const [newComment, setNewComment] = useState("");

    // Validation basée sur le type de produit
    const isShoes = product?.type === "shoes";
    const isClothes = product?.type === "clothes";
    const needsSize = isShoes || isClothes;

    // Calcul dynamique du panier
    const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

    // Récupération et calcul des avis basés sur l'état local
    const hasReviews = localReviews.length > 0;
    const averageRating = hasReviews
        ? (localReviews.reduce((acc, rev) => acc + rev.rating, 0) / localReviews.length).toFixed(1)
        : null;

    const imagesList =
        product?.images?.length > 0
            ? product.images
            : product?.image
                ? [product.image]
                : [];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === imagesList.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? imagesList.length - 1 : prev - 1
        );
    };

    // Partage propre de l'annonce
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.title,
                text: `Découvre cette annonce sur ViteVendu : ${product?.title}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Lien de l'annonce copié ! 📋");
        }
    };

    // Soumission du nouvel avis client
    const handleSubmitReview = (e) => {
        e.preventDefault();

        if (!newAuthor.trim() || !newComment.trim()) {
            alert("Veuillez remplir votre nom et laisser un commentaire.");
            return;
        }

        const newReviewObj = {
            id: Date.now().toString(), // ID unique temporaire
            author: newAuthor,
            rating: Number(newRating),
            comment: newComment,
            date: new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        };

        // Mise à jour de l'affichage local des avis
        setLocalReviews([newReviewObj, ...localReviews]);

        // Réinitialisation du formulaire
        setNewAuthor("");
        setNewComment("");
        setNewRating(5);

        alert("Merci ! Votre avis a été publié avec succès. ⭐");

        // TODO: Ici, tu pourras ajouter ton appel API / Supabase 
        // pour sauvegarder l'avis en base de données de manière persistante.
    };

    if (!product) {
        return (
            <div style={styles.errorContainer}>
                <div style={{ fontSize: "48px" }}>⚠️</div>
                <h2>Produit introuvable</h2>
                <p>Les détails de cet article ne sont pas disponibles ou ont expiré.</p>
                <button onClick={() => navigate("/")} style={styles.errorBtn}>
                    Retour à l'accueil
                </button>
            </div>
        );
    }


    let sizes = [];

    try {
        // Les tailles sont enregistrées dans product.variants.sizes
        if (product?.variants?.sizes) {
            sizes =
                typeof product.variants.sizes === "string"
                    ? JSON.parse(product.variants.sizes)
                    : product.variants.sizes;
        }
    } catch (e) {
        sizes = [];
    }

    // Aucune taille automatique.
    // On affiche uniquement celles saisies par le vendeur.
    if (!Array.isArray(sizes)) {
        sizes = [];
    }

    const titleLabel = isShoes
        ? "Pointures disponibles"
        : isClothes
            ? "Tailles disponibles"
            : "Options disponibles";

    const buildCartItem = () => {
        return {
            ...product,
            size: needsSize ? (selectedSize || null) : null,
            color: selectedColor || null,
            quantity: 1
        };
    };

    const handleAddToCart = () => {
        if (needsSize && !selectedSize) {
            alert(
                isShoes
                    ? "Veuillez sélectionner une pointure"
                    : "Veuillez sélectionner une taille"
            );
            return;
        }

        addToCart(buildCartItem());
        alert("Produit ajouté au panier ! 🛒");
    };

    const handleBuyNow = () => {
        if (needsSize && !selectedSize) {
            alert(
                isShoes
                    ? "Veuillez sélectionner une pointure"
                    : "Veuillez sélectionner une taille"
            );
            return;
        }

        addToCart(buildCartItem());
        navigate("/cart");
    };
    return (
        <div style={styles.pageWrapper}>

            {/* HEADER */}
            <header style={styles.header}>
                <button onClick={() => navigate("/")} style={styles.backBtn}>
                    ← Boutique
                </button>
                <h2 style={styles.headerTitle}>Détails de l'article</h2>
                <button onClick={() => navigate("/cart")} style={styles.cartBadgeBtn}>
                    🛒 <span style={styles.badgeCount}>{cartCount}</span>
                </button>
            </header>

            {/* LAYOUT */}
            <main style={styles.mainLayout}>

                {/* COLONNE GAUCHE */}
                <div style={styles.leftColumn}>

                    <div style={styles.imageContainer}>

                        {/* IMAGE PRINCIPALE */}
                        {imagesList.length > 0 ? (
                            <div style={{ position: "relative" }}>

                                <img
                                    src={imagesList[currentIndex]}
                                    alt={product.title}
                                    style={styles.image}
                                />

                                {/* FLÈCHE GAUCHE */}
                                {imagesList.length > 1 && (
                                    <button
                                        onClick={prevImage}
                                        style={{
                                            position: "absolute",
                                            left: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "rgba(0,0,0,0.5)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "35px",
                                            height: "35px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ‹
                                    </button>
                                )}

                                {/* FLÈCHE DROITE */}
                                {imagesList.length > 1 && (
                                    <button
                                        onClick={nextImage}
                                        style={{
                                            position: "absolute",
                                            right: "10px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "rgba(0,0,0,0.5)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "35px",
                                            height: "35px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ›
                                    </button>
                                )}

                            </div>
                        ) : (
                            <div style={styles.noImage}>📷 Aucune image</div>
                        )}

                        {/* MINIATURES */}
                        {imagesList.length > 1 && (
                            <div style={{
                                display: "flex",
                                gap: "8px",
                                marginTop: "10px",
                                flexWrap: "wrap"
                            }}>
                                {imagesList.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        onClick={() => setCurrentIndex(index)}
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            border: currentIndex === index
                                                ? "2px solid #2563eb"
                                                : "1px solid #ddd"
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                    </div>

                    {/* INFOS DE L'ANNONCE */}
                    <div style={styles.announcementDetailsCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={styles.categoryTag}>{product.category || "Annonce ViteVendu"}</span>
                            <button onClick={handleShare} style={styles.shareBtn}>
                                🔗 Partager l'annonce
                            </button>
                        </div>

                        <h1 style={styles.announcementTitle}>{product.title}</h1>

                        {/* Note globale réelle recalculée */}
                        {hasReviews && (
                            <div style={styles.ratingSummaryRow}>
                                <span style={styles.starIcon}>⭐</span>
                                <span style={styles.ratingText}>
                                    <strong>{averageRating}</strong> ({localReviews.length} {localReviews.length > 1 ? "avis" : "avis"})
                                </span>
                            </div>
                        )}

                        <div style={styles.announcementPriceRow}>
                            <span style={styles.announcementPrice}>
                                {Number(product.price).toLocaleString()} FCFA
                            </span>
                        </div>

                        {/* CARACTÉRISTIQUES RÉELLES */}
                        <div style={{ marginTop: "24px" }}>
                            <h3 style={styles.sectionTitle}>Fiche descriptive</h3>

                            <table style={styles.specTable}>
                                <tbody>

                                    <tr>
                                        <td style={styles.specLabel}>État de l'article</td>
                                        <td style={styles.specValue}>
                                            {product.condition || "Non spécifié"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style={styles.specLabel}>Lieu de disponibilité</td>
                                        <td style={styles.specValue}>
                                            {product.location || "Abidjan, Côte d'Ivoire"}
                                        </td>
                                    </tr>

                                    {product.brand && (
                                        <tr>
                                            <td style={styles.specLabel}>Marque</td>
                                            <td style={styles.specValue}>
                                                {product.brand}
                                            </td>
                                        </tr>
                                    )}

                                    <tr>
                                        <td style={styles.specLabel}>Stock disponible</td>
                                        <td
                                            style={{
                                                ...styles.specValue,
                                                fontWeight: "700",
                                                color:
                                                    Number(product.stock) > 0
                                                        ? "#16a34a"
                                                        : "#dc2626"
                                            }}
                                        >
                                            {Number(product.stock) > 0
                                                ? `${product.stock} article${Number(product.stock) > 1 ? "s" : ""} en stock`
                                                : "Rupture de stock"}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        {/* DESCRIPTION */}
                        <div style={styles.descriptionBox}>
                            <h3 style={styles.sectionTitle}>Description détaillée</h3>
                            <p style={styles.descriptionText}>
                                {product.description || "Aucune description supplémentaire fournie par le vendeur."}
                            </p>
                        </div>
                        {variants.colors.length > 0 && (
                            <div style={{ marginTop: 24 }}>
                                <h3 style={styles.sectionTitle}>
                                    Couleurs disponibles
                                </h3>

                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    {variants.colors.map((color, i) => {

                                        const colorMap = {
                                            noir: "black",
                                            blanc: "white",
                                            rouge: "red",
                                            bleu: "blue",
                                            vert: "green",
                                            jaune: "yellow",
                                            gris: "gray",
                                            orange: "orange",
                                            violet: "purple",
                                            rose: "pink",
                                            marron: "brown",
                                            beige: "beige",
                                            doré: "gold",
                                            argent: "silver"
                                        };

                                        const cssColor = colorMap[color.toLowerCase()] || color;

                                        const isSelected = selectedColor === color;

                                        const isWhite =
                                            cssColor === "white" ||
                                            cssColor === "#fff" ||
                                            cssColor === "#ffffff";

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    backgroundColor: cssColor,
                                                    cursor: "pointer",
                                                    border: isSelected
                                                        ? "3px solid #000"
                                                        : isWhite
                                                            ? "1px solid #ccc"
                                                            : "2px solid transparent",
                                                    boxShadow: isSelected
                                                        ? "0 0 0 3px #fff, 0 0 0 5px #000"
                                                        : "0 2px 6px rgba(0,0,0,.15)",
                                                    transition: ".2s",
                                                    padding: 0
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                {selectedColor && (
                                    <p
                                        style={{
                                            marginTop: 12,
                                            fontSize: 14,
                                            color: "#475569",
                                            fontWeight: 600
                                        }}
                                    >
                                        Couleur sélectionnée : {selectedColor}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* --- NOUVELLE SECTION : FORMULAIRE LAISSER UN AVIS --- */}
                        <div style={styles.reviewFormContainer}>
                            <h3 style={styles.sectionTitle}>Donner votre avis</h3>
                            <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
                                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                                    <div style={{ flex: 1, minWidth: "200px" }}>
                                        <label style={styles.formLabel}>Votre Nom / Pseudo</label>
                                        <input
                                            type="text"
                                            value={newAuthor}
                                            onChange={(e) => setNewAuthor(e.target.value)}
                                            placeholder="Ex: Kouassi Marc"
                                            style={styles.formInput}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={styles.formLabel}>Note globale</label>
                                        <div style={styles.starRatingSelector}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    onClick={() => setNewRating(star)}
                                                    style={{
                                                        ...styles.clickableStar,
                                                        color: star <= newRating ? "#eab308" : "#cbd5e1"
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: "12px" }}>
                                    <label style={styles.formLabel}>Votre commentaire</label>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Qu'avez-vous pensé de cet article ou de la réactivité du vendeur ?"
                                        rows="3"
                                        style={styles.formTextarea}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" style={styles.submitReviewBtn}>
                                    Envoyer mon avis
                                </button>
                            </form>
                        </div>

                        {/* SECTION DES AVIS CLIENTS */}
                        <div style={styles.reviewsSection}>
                            <h3 style={styles.sectionTitle}>Avis des clients</h3>

                            {hasReviews ? (
                                <div style={styles.reviewsList}>
                                    {localReviews.map((review, index) => (
                                        <div key={review.id || index} style={styles.reviewCard}>
                                            <div style={styles.reviewHeader}>
                                                <span style={styles.reviewAuthor}>{review.author || "Client ViteVendu"}</span>
                                                <span style={styles.reviewStars}>
                                                    {"⭐".repeat(review.rating)}
                                                </span>
                                            </div>
                                            {review.date && <span style={styles.reviewDate}>{review.date}</span>}
                                            <p style={styles.reviewComment}>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={styles.noReviewsBox}>
                                    <p style={styles.noReviewsText}>
                                        💬 Aucun avis n'a encore été laissé pour cet article.
                                        Soyez le premier à donner votre avis ci-dessus !
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* COLONNE DROITE : TUNNEL D'ACHAT */}
                <div style={styles.rightColumn}>
                    <div style={styles.infoBox}>

                        <div style={styles.checkoutPriceSection}>
                            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Montant à régler</span>
                            <h2 style={styles.price}>
                                {Number(product.price).toLocaleString()} FCFA
                            </h2>
                        </div>

                        {/* CHOIX DES TAILLES */}
                        {needsSize && (
                            <div style={{ marginTop: 20 }}>
                                <h3 style={styles.sectionTitle}>{titleLabel}</h3>
                                <div style={styles.sizeContainer}>
                                    {sizes.map((size) => {
                                        const isSelected = selectedSize === size;
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                style={{
                                                    ...styles.sizeBtn,
                                                    background: isSelected ? "#2563eb" : "#fff",
                                                    color: isSelected ? "#fff" : "#0f172a",
                                                    borderColor: isSelected ? "#2563eb" : "#cbd5e1",
                                                    fontWeight: isSelected ? "700" : "500"
                                                }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div style={styles.actionBox}>
                            <button onClick={handleAddToCart} style={styles.cartBtn}>
                                Ajouter au panier
                            </button>

                            <button onClick={handleBuyNow} style={styles.buyBtn}>
                                Acheter maintenant
                            </button>
                        </div>

                        {/* INFOS LIVRAISON PRATIQUES */}
                        <div style={styles.guaranteesBox}>
                            <div style={styles.guaranteeItem}>
                                <span style={{ fontSize: "18px" }}>🚚</span>
                                <div>
                                    <h4 style={styles.guaranteeHeading}>Modes de livraison</h4>
                                    <p style={styles.guaranteeText}>Expédition sur Abidjan et intérieur du pays selon les tarifs en vigueur.</p>
                                </div>
                            </div>
                            <div style={styles.guaranteeItem}>
                                <span style={{ fontSize: "18px" }}>🤝</span>
                                <div>
                                    <h4 style={styles.guaranteeHeading}>Paiement sécurisé</h4>
                                    <p style={styles.guaranteeText}>Paiement à la livraison ou via vos moyens sécurisés habituels.</p>
                                </div>
                            </div>
                        </div>

                        {/* BLOC VENDEUR TRANSPARENT */}
                        <div style={styles.sellerBox}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "18px" }}>🏪</span>
                                <h4 style={{ margin: 0, fontWeight: "700", fontSize: "14px" }}>
                                    {product.sellerName || "Boutique Partenaire ViteVendu"}
                                </h4>
                            </div>
                            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                                Membre vérifié sur la plateforme ViteVendu.
                            </p>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}

const styles = {
    pageWrapper: {
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, sans-serif",
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
        justifyContent: "space-between",
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
        margin: 0,
        color: "#1e293b"
    },
    cartBadgeBtn: {
        background: "#f1f5f9",
        border: "none",
        padding: "8px 14px",
        borderRadius: "20px",
        fontWeight: "700",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px"
    },
    badgeCount: {
        background: "#2563eb",
        color: "#fff",
        fontSize: "11px",
        padding: "2px 6px",
        borderRadius: "10px"
    },
    mainLayout: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "90px 24px 40px 24px",
        display: "flex",
        flexWrap: "wrap",
        gap: "32px"
    },
    leftColumn: {
        flex: "1 1 400px",
        height: "max-content"
    },
    rightColumn: {
        flex: "1 1 500px",
        position: "sticky",
        top: "90px"
    },
    imageContainer: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)"
    },
    image: {
        width: "100%",
        maxHeight: "400px",
        objectFit: "contain",
        borderRadius: "12px"
    },
    announcementDetailsCard: {
        marginTop: "16px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    },
    categoryTag: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#2563eb",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    },
    shareBtn: {
        background: "#f1f5f9",
        border: "none",
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        color: "#475569"
    },
    announcementTitle: {
        margin: "12px 0 6px 0",
        fontSize: "22px",
        fontWeight: "800",
        color: "#0f172a",
        lineHeight: "1.3"
    },
    ratingSummaryRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "12px"
    },
    starIcon: {
        fontSize: "14px"
    },
    ratingText: {
        fontSize: "13px",
        color: "#475569"
    },
    announcementPriceRow: {
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        marginBottom: "4px"
    },
    announcementPrice: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#10b981"
    },
    specTable: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "8px",
        fontSize: "13px"
    },
    specLabel: {
        padding: "10px 0",
        color: "#64748b",
        borderBottom: "1px solid #f1f5f9",
        fontWeight: "500",
        width: "40%"
    },
    specValue: {
        padding: "10px 0",
        color: "#0f172a",
        borderBottom: "1px solid #f1f5f9",
        fontWeight: "600"
    },
    infoBox: {
        background: "#ffffff",
        borderRadius: "24px",
        padding: "28px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)"
    },
    checkoutPriceSection: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: "16px"
    },
    price: {
        color: "#0f172a",
        margin: 0,
        fontSize: "28px",
        fontWeight: "800"
    },
    sectionTitle: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#0f172a",
        margin: "0 0 12px 0"
    },
    sizeContainer: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
    },
    sizeBtn: {
        border: "1px solid",
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s ease"
    },
    descriptionBox: {
        marginTop: "24px",
        borderTop: "1px solid #f1f5f9",
        paddingTop: "16px"
    },
    descriptionText: {
        margin: 0,
        fontSize: "14px",
        color: "#475569",
        lineHeight: "1.8",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        textAlign: "justify"
    },
    reviewsSection: {
        marginTop: "24px",
        borderTop: "1px solid #f1f5f9",
        paddingTop: "20px"
    },
    reviewsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    reviewCard: {
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0"
    },
    reviewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px"
    },
    reviewAuthor: {
        fontSize: "13px",
        fontWeight: "700",
        color: "#1e293b"
    },
    reviewStars: {
        fontSize: "11px"
    },
    reviewDate: {
        fontSize: "11px",
        color: "#94a3b8",
        display: "block",
        marginBottom: "6px"
    },
    reviewComment: {
        margin: 0,
        fontSize: "13px",
        color: "#475569",
        lineHeight: "1.5"
    },
    noReviewsBox: {
        background: "#f8fafc",
        padding: "16px",
        borderRadius: "14px",
        border: "1px dashed #cbd5e1",
        textAlign: "center"
    },
    noReviewsText: {
        margin: 0,
        fontSize: "13px",
        color: "#64748b",
        lineHeight: "1.5"
    },
    guaranteesBox: {
        marginTop: "24px",
        background: "#f8fafc",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    guaranteeItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
    },
    guaranteeHeading: {
        margin: "0 0 2px 0",
        fontSize: "13px",
        fontWeight: "700"
    },
    guaranteeText: {
        margin: 0,
        fontSize: "12px",
        color: "#64748b"
    },
    sellerBox: {
        marginTop: "20px",
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
    },
    actionBox: {
        display: "flex",
        gap: "12px",
        marginTop: "24px"
    },
    cartBtn: {
        flex: 1,
        background: "#f59e0b",
        color: "#ffffff",
        border: "none",
        padding: "16px",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px"
    },
    buyBtn: {
        flex: 1,
        background: "#10b981",
        color: "#ffffff",
        border: "none",
        padding: "16px",
        borderRadius: "14px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px"
    },
    errorContainer: {
        padding: "60px 20px",
        textAlign: "center",
        fontFamily: "sans-serif",
        color: "#1e293b"
    },
    errorBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "10px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "16px"
    },

    reviewFormContainer: {
        marginTop: "32px",
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
    },
    reviewForm: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "12px",
    },
    formLabel: {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "6px",
    },
    formInput: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
    },
    formTextarea: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        outline: "none",
        fontFamily: "inherit",
        resize: "vertical",
        boxSizing: "border-box",
    },
    starRatingSelector: {
        display: "flex",
        gap: "4px",
        padding: "4px 0",
    },
    clickableStar: {
        fontSize: "28px",
        cursor: "pointer",
        transition: "transform 0.1s ease",
    },
    submitReviewBtn: {
        alignSelf: "flex-start",
        padding: "10px 20px",
        background: "#0f172a",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "14px",
        cursor: "pointer",
        marginTop: "8px",
        transition: "background 0.2s",
    },
};
