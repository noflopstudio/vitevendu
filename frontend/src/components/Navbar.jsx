import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/login");
    };

    return (
        <div style={styles.navbar}>

            <Link to="/" style={styles.logo}>
                🛍️ ViteVendu
            </Link>

            <div style={styles.links}>

                <Link to="/">Home</Link>

                {user ? (
                    <>
                        <Link to="/client">Dashboard</Link>
                        <button onClick={logout} style={styles.logout}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                    </>
                )}

            </div>
        </div>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        padding: 15,
        borderBottom: "1px solid #ddd",
        alignItems: "center"
    },
    logo: {
        fontWeight: "bold",
        textDecoration: "none",
        fontSize: 18
    },
    links: {
        display: "flex",
        gap: 15,
        alignItems: "center"
    },
    logout: {
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer"
    }
};