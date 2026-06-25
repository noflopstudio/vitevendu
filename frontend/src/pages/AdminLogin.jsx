import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            alert("❌ " + error.message);
            return;
        }

        // ✅ session locale
        localStorage.setItem("admin", "true");

        // 👉 on affiche bouton au lieu de rediriger direct
        setIsLogged(true);
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h1 style={styles.title}>👑 Administration</h1>

                <p style={styles.subtitle}>
                    Connectez-vous à votre espace administrateur
                </p>

                <input
                    type="email"
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.button}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>

                {/* 🔥 APRÈS CONNEXION */}
                {isLogged && (
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{
                            ...styles.button,
                            background: "#16a34a",
                            marginTop: "10px",
                        }}
                    >
                        👉 Continuer vers l'accueil
                    </button>
                )}
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        padding: "20px",
    },

    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        padding: "35px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    title: {
        margin: 0,
        textAlign: "center",
        color: "#0f172a",
    },

    subtitle: {
        margin: 0,
        textAlign: "center",
        color: "#64748b",
        fontSize: "14px",
    },

    input: {
        padding: "14px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        fontSize: "15px",
        outline: "none",
    },

    button: {
        padding: "14px",
        border: "none",
        borderRadius: "12px",
        background: "#2563eb",
        color: "#fff",
        fontWeight: "700",
        fontSize: "15px",
        cursor: "pointer",
    },
};