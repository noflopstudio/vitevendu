import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Categories() {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // 📥 Charger catégories
    const fetchCategories = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
        } else {
            setCategories(data || []);
        }

        setLoading(false);
    };

    // ➕ Ajouter catégorie
    const addCategory = async () => {
        if (!name.trim()) {
            alert("Veuillez saisir un nom de catégorie.");
            return;
        }

        const { error } = await supabase
            .from("categories")
            .insert([
                {
                    name: name.trim()
                }
            ]);

        if (error) {
            console.log(error);
            alert("Erreur lors de l'ajout.");
            return;
        }

        setName("");
        fetchCategories();
    };

    // 🗑 Supprimer catégorie
    const deleteCategory = async (id) => {
        const confirmDelete = window.confirm(
            "Supprimer cette catégorie ?"
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);

        if (error) {
            console.log(error);
            alert("Erreur lors de la suppression.");
            return;
        }

        fetchCategories();
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    🗂️ Gestion des catégories
                </h1>

                <div style={styles.counter}>
                    {categories.length} catégorie(s)
                </div>
            </div>

            {/* FORMULAIRE */}
            <div style={styles.formCard}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addCategory();
                        }
                    }}
                    placeholder="Nom de la catégorie"
                    style={styles.input}
                />

                <button
                    onClick={addCategory}
                    disabled={loading}
                    style={styles.addBtn}
                >
                    ➕ Ajouter
                </button>
            </div>

            {/* LOADING */}
            {loading && (
                <div style={styles.loading}>
                    ⏳ Chargement...
                </div>
            )}

            {/* LISTE */}
            {!loading && categories.length === 0 && (
                <div style={styles.empty}>
                    Aucune catégorie disponible.
                </div>
            )}

            <div style={styles.list}>
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        style={styles.card}
                    >
                        <div>
                            <div style={styles.categoryName}>
                                {cat.name}
                            </div>
                        </div>

                        <button
                            onClick={() => deleteCategory(cat.id)}
                            style={styles.deleteBtn}
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "20px",
        background: "#f8fafc",
        minHeight: "100vh"
    },

    header: {
        marginBottom: "20px"
    },

    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "800",
        color: "#0f172a"
    },

    counter: {
        marginTop: "8px",
        color: "#64748b",
        fontSize: "14px"
    },

    formCard: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
    },

    input: {
        flex: 1,
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        outline: "none",
        fontSize: "14px"
    },

    addBtn: {
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "12px 18px",
        cursor: "pointer",
        fontWeight: "600"
    },

    loading: {
        textAlign: "center",
        padding: "20px"
    },

    empty: {
        textAlign: "center",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        color: "#64748b"
    },

    list: {
        display: "grid",
        gap: "12px"
    },

    card: {
        background: "#fff",
        borderRadius: "12px",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },

    categoryName: {
        fontWeight: "700",
        color: "#0f172a"
    },

    deleteBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "8px 12px",
        cursor: "pointer"
    }
};