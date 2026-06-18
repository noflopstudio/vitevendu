import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=400";

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ================= IMAGE SAFE =================
    const getImageUrl = (path) => {
        if (!path) return FALLBACK_IMAGE;
        if (path.startsWith("http")) return path;
        return `${supabase.storageUrl}/object/public/products/${path}`;
    };

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        const { data } = await supabase.from("products").select("*");
        setProducts(data || []);
    };

    // ================= FETCH CATEGORIES =================
    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("*");
        setCategories(data || []);
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchCategories()]);
            setLoading(false);
        };
        load();
    }, []);

    // ================= FILTER =================
    const filteredProducts = products.filter((p) => {
        const matchCategory =
            selectedCategory === "all"
                ? true
                : Number(p.category_id) === Number(selectedCategory);

        const matchSearch = (p.title || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    if (loading) {
        return <div style={styles.loading}>🔄 Chargement en cours...</div>;
    }

    return (
        <div style={styles.page}>

            <h1 style={styles.title}>🛍️ Marketplace</h1>
            <p style={styles.subtitle}>Découvrez les produits disponibles</p>

            <h3 style={styles.count}>
                {filteredProducts.length} article(s)
            </h3>

            {/* SEARCH */}
            <input
                style={styles.search}
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* CATEGORIES */}
            <div style={styles.catRow}>
                <button
                    style={{
                        ...styles.catBtn,
                        ...(selectedCategory === "all"
                            ? styles.catBtnActive
                            : {})
                    }}
                    onClick={() => setSelectedCategory("all")}
                >
                    Tous
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        style={{
                            ...styles.catBtn,
                            ...(selectedCategory === cat.id
                                ? styles.catBtnActive
                                : {})
                        }}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* PRODUCTS */}
            <div style={styles.grid}>
                {filteredProducts.map((p) => (
                    <div key={p.id} style={styles.card}>

                        <img
                            src={getImageUrl(p.image)}
                            alt={p.title}
                            style={styles.img}
                            onError={(e) => {
                                e.target.src = FALLBACK_IMAGE;
                            }}
                        />

                        <div style={styles.body}>

                            <div style={styles.cat}>
                                🗂️{" "}
                                {categories.find(
                                    (c) => c.id === p.category_id
                                )?.name || "Général"}
                            </div>

                            <h3 style={styles.name}>{p.title}</h3>

                            <div style={styles.price}>
                                {Number(p.price || 0).toLocaleString()} FCFA
                            </div>

                            {/* ❌ PANIER SUPPRIMÉ
                                ✔ on garde juste navigation produit
                            */}
                            <button
                                style={styles.btn}
                                onClick={() =>
                                    navigate(`/product/${p.id}`, {
                                        state: { product: p }
                                    })
                                }
                            >
                                Voir détails
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
const styles = {
    page: {
        padding: "40px 20px",
        background: "#f8fafc",
        minHeight: "100vh",
        maxWidth: "1100px",
        margin: "0 auto"
    },
    // Titre avec un rappel de bleu profond
    title: {
        fontSize: "32px",
        fontWeight: "800",
        color: "#1e3a8a",
        marginBottom: "8px"
    },
    subtitle: {
        color: "#64748b",
        marginBottom: "25px",
        fontSize: "16px"
    },
    count: {
        fontSize: "14px",
        color: "#f97316", // Orange pour attirer l'œil sur le compteur
        fontWeight: "600",
        marginBottom: "20px"
    },
    // Recherche modernisée
    search: {
        width: "100%",
        padding: "16px",
        border: "2px solid #e2e8f0",
        borderRadius: "12px",
        marginBottom: "30px",
        fontSize: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    },
    catRow: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "30px" },
    catBtn: {
        padding: "10px 20px",
        borderRadius: "25px",
        border: "1px solid #cbd5e1",
        background: "#fff",
        cursor: "pointer",
        fontWeight: "500",
        transition: "all 0.3s"
    },
    catBtnActive: {
        background: "#22c55e", // Vert actif
        color: "#fff",
        border: "1px solid #22c55e"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "25px"
    },
    // Carte avec ombre légère et bords arrondis
    card: {
        background: "#fff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(30, 58, 138, 0.08)",
        border: "1px solid #f1f5f9",
        transition: "transform 0.3s"
    },
    img: { width: "100%", height: "180px", objectFit: "cover" },
    body: { padding: "20px" },
    cat: {
        fontSize: "11px",
        color: "#22c55e", // Vert pour la catégorie
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "8px"
    },
    name: { fontSize: "16px", margin: "0 0 10px 0", color: "#1e293b" },
    price: {
        fontSize: "18px",
        fontWeight: "800",
        color: "#f97316", // Orange pour le prix
        marginBottom: "15px"
    },
    btn: {
        width: "100%",
        padding: "12px",
        border: "none",
        background: "#1e3a8a", // Bleu pour le bouton principal
        color: "#fff",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    },
    loading: { padding: "50px", textAlign: "center", fontSize: "18px", color: "#1e3a8a" }
};