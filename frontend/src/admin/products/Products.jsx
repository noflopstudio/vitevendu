import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sizes, setSizes] = useState(""); // 👟 AJOUT POINTURES

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // ================= FETCH =================
    const fetchProducts = async () => {
        const { data } = await supabase
            .from("products")
            .select("*, categories(name)")
            .order("created_at", { ascending: false });

        setProducts(data || []);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from("categories").select("*");
        setCategories(data || []);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ================= RESET =================
    const resetForm = () => {
        setTitle("");
        setPrice("");
        setCategoryId("");
        setSizes("");
        setImageFile(null);
        setImagePreview("");
        setEditingId(null);
    };

    // ================= UPLOAD IMAGE =================
    const uploadImage = async () => {
        if (!imageFile) return null;

        const fileName = `${Date.now()}_${imageFile.name}`;

        const { error } = await supabase.storage
            .from("images")
            .upload(fileName, imageFile);

        if (error) {
            console.log("UPLOAD ERROR:", error);
            return null;
        }

        const { data } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    // ================= ADD =================
    const addProduct = async (e) => {
        e.preventDefault();
        if (!title || !price || !categoryId) return alert("Remplis tous les champs");

        setLoading(true);

        const imageUrl = await uploadImage();

        const sizesArray = sizes
            ? sizes.split(",").map(s => Number(s.trim()))
            : null;

        await supabase.from("products").insert([
            {
                title,
                price: Number(price),
                image: imageUrl,
                category_id: Number(categoryId),
                sizes: sizesArray
            }
        ]);

        resetForm();
        setLoading(false);
        fetchProducts();
    };

    // ================= UPDATE =================
    const saveUpdate = async () => {
        if (!editingId) return;

        setLoading(true);

        let imageUrl = null;

        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;

            const { error } = await supabase.storage
                .from("images")
                .upload(fileName, imageFile);

            if (!error) {
                const { data } = supabase.storage
                    .from("images")
                    .getPublicUrl(fileName);

                imageUrl = data.publicUrl;
            }
        }

        const sizesArray = sizes
            ? sizes.split(",").map(s => Number(s.trim()))
            : null;

        const updateData = {
            title,
            price: Number(price),
            category_id: Number(categoryId),
            sizes: sizesArray
        };

        if (imageUrl) {
            updateData.image = imageUrl;
        }

        await supabase
            .from("products")
            .update(updateData)
            .eq("id", editingId);

        resetForm();
        setLoading(false);
        fetchProducts();
    };

    // ================= DELETE =================
    const deleteProduct = async (id) => {
        if (!confirm("Supprimer ce produit ?")) return;

        await supabase.from("products").delete().eq("id", id);
        fetchProducts();
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.headerTitle}>🛍️ Gestion des Produits</h1>

            <div style={styles.mainLayout}>

                {/* FORM */}
                <aside style={styles.sidebar}>
                    <h2 style={styles.formTitle}>
                        {editingId ? "✏️ Modifier le produit" : "➕ Ajouter un produit"}
                    </h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            editingId ? saveUpdate() : addProduct(e);
                        }}
                    >
                        <input
                            placeholder="Nom du produit"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="number"
                            placeholder="Prix (FCFA)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={styles.input}
                        />

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            style={styles.input}
                        >
                            <option value="">Catégorie</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* 👟 POINTURES */}
                        <input
                            placeholder="Pointures (ex: 38,39,40)"
                            value={sizes}
                            onChange={(e) => setSizes(e.target.value)}
                            style={styles.input}
                        />

                        <input
                            type="file"
                            onChange={(e) => {
                                const f = e.target.files[0];
                                setImageFile(f);
                                if (f) setImagePreview(URL.createObjectURL(f));
                            }}
                            style={styles.input}
                        />

                        {imagePreview && (
                            <img src={imagePreview} style={styles.preview} />
                        )}

                        <button
                            type="submit"
                            style={styles.primaryBtn}
                            disabled={loading}
                        >
                            {editingId ? "💾 Sauvegarder" : "➕ Ajouter"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.secondaryBtn}
                            >
                                Annuler
                            </button>
                        )}
                    </form>
                </aside>

                {/* LIST */}
                <main style={styles.grid}>
                    {products.map(p => (
                        <div key={p.id} style={styles.card}>
                            <img
                                src={p.image || "https://via.placeholder.com/150"}
                                style={styles.cardImg}
                            />

                            <h4>{p.title}</h4>
                            <p>{Number(p.price).toLocaleString()} FCFA</p>

                            {/* 👟 DISPLAY SIZES */}
                            {p.sizes?.length > 0 && (
                                <div>
                                    {p.sizes.map((s) => (
                                        <span key={s}> {s} </span>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setEditingId(p.id);
                                    setTitle(p.title);
                                    setPrice(p.price);
                                    setCategoryId(p.category_id);
                                    setSizes(p.sizes ? p.sizes.join(",") : "");
                                }}
                            >
                                Modifier
                            </button>

                            <button onClick={() => deleteProduct(p.id)}>
                                Supprimer
                            </button>
                        </div>
                    ))}
                </main>

            </div>
        </div>
    );
}

const styles = {
    pageContainer: { padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" },
    headerTitle: { fontSize: "32px", fontWeight: "800", color: "#1e293b", marginBottom: "30px" },
    mainLayout: { display: "grid", gridTemplateColumns: "350px 1fr", gap: "40px", alignItems: "start" },
    sidebar: { backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", position: "sticky", top: "20px" },
    formTitle: { fontSize: "18px", marginBottom: "20px", color: "#334155" },
    input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" },
    preview: { width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px" },
    primaryBtn: { width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    secondaryBtn: { width: "100%", padding: "12px", marginTop: "10px", backgroundColor: "#64748b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
    card: { backgroundColor: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" },
    imgWrapper: { position: "relative" },
    cardImg: { width: "100%", height: "160px", objectFit: "cover" },
    badge: { position: "absolute", bottom: "10px", left: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "10px" },
    cardContent: { padding: "15px" },
    title: { margin: "0 0 5px 0", color: "#1e293b" },
    price: { color: "#16a34a", fontWeight: "800", fontSize: "16px" },
    actions: { display: "flex", gap: "10px", marginTop: "10px" },
    editBtn: { backgroundColor: "#eff6ff", color: "#2563eb", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" },
    deleteBtn: { backgroundColor: "#fef2f2", color: "#e11d48", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }
};