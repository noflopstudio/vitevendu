import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // 🔐 SIGNUP
    const handleSignup = async () => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            alert("❌ " + error.message);
            setLoading(false);
            return;
        }

        alert("✅ Compte créé !");
        console.log(data);

        setLoading(false);
    };

    // 🔑 LOGIN + ROLE REDIRECT
    const handleLogin = async () => {
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("❌ " + error.message);
            setLoading(false);
            return;
        }

        const user = data.user;

        // 🧠 récupérer profil
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            alert("❌ profil introuvable");
            setLoading(false);
            return;
        }

        // 🚀 REDIRECT SELON ROLE
        if (profile.role === "admin") {
            navigate("/admin");
        } else if (profile.role === "seller") {
            navigate("/seller");
        } else {
            navigate("/client");
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Login / Inscription</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br />

            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSignup} disabled={loading}>
                S'inscrire
            </button>

            <button onClick={handleLogin} disabled={loading}>
                Se connecter
            </button>
        </div>
    );
}